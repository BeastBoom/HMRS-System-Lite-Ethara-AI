import re
from datetime import date, datetime
from typing import List, Optional, Literal
from uuid import UUID
from pydantic import BaseModel, EmailStr, field_validator, ConfigDict


# Email regex pattern for validation
EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


# Error response schemas
class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorDetail

# Department schemas
class DepartmentBase(BaseModel):
    name: str

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


# Employee schemas
class EmployeeCreate(BaseModel):
    employeeId: str
    fullName: str
    email: str
    department: str

    @field_validator("employeeId")
    @classmethod
    def validate_employee_id(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Employee ID is required")
        return v.strip()

    @field_validator("fullName")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Full name is required")
        return v.strip()

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Email is required")
        v = v.strip().lower()
        if not EMAIL_REGEX.match(v):
            raise ValueError("Invalid email format")
        return v

    @field_validator("department")
    @classmethod
    def validate_department(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Department is required")
        return v.strip()


class EmployeeUpdate(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        v = v.strip().lower()
        if not EMAIL_REGEX.match(v):
            raise ValueError("Invalid email format")
        return v


class EmployeeResponse(BaseModel):
    id: UUID
    employeeId: str
    fullName: str
    email: str
    department: str
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_orm_model(cls, employee) -> "EmployeeResponse":
        return cls(
            id=employee.id,
            employeeId=employee.employee_id,
            fullName=employee.full_name,
            email=employee.email,
            department=employee.department,
            createdAt=employee.created_at,
        )


class EmployeeListResponse(BaseModel):
    employees: List[EmployeeResponse]


# Attendance schemas
class AttendanceCreate(BaseModel):
    employeeId: str
    date: date
    status: Literal["present", "absent"]

    @field_validator("employeeId")
    @classmethod
    def validate_employee_id(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Employee ID is required")
        return v.strip()

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in ["present", "absent"]:
            raise ValueError("Status must be 'present' or 'absent'")
        return v


class AttendanceRecord(BaseModel):
    date: date
    status: str

    model_config = ConfigDict(from_attributes=True)


class AttendanceListResponse(BaseModel):
    attendance: List[AttendanceRecord]


class AttendanceResponse(BaseModel):
    id: UUID
    employeeId: str
    date: date
    status: str

    model_config = ConfigDict(from_attributes=True)



class AttendanceUpdate(BaseModel):
    employeeId: str
    date: date
    status: Optional[Literal["present", "absent"]] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        if v not in ["present", "absent"]:
            raise ValueError("Status must be 'present' or 'absent'")
        return v


class AttendanceBulkCreate(BaseModel):
    employeeIds: List[str]
    date: date
    status: Literal["present", "absent"]
    overwrite: bool = False

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in ["present", "absent"]:
            raise ValueError("Status must be 'present' or 'absent'")
        return v


class AttendanceBulkResponse(BaseModel):
    created: List[str]
    updated: List[str]
    skipped: List[str]
    message: str


# Health check schema
class HealthResponse(BaseModel):
    status: str
