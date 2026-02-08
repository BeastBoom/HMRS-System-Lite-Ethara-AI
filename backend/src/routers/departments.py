from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ..database import get_db
from ..models import Department
from ..schemas import DepartmentResponse, DepartmentCreate, ErrorResponse

router = APIRouter(prefix="/api/departments", tags=["departments"])

@router.get("", response_model=List[DepartmentResponse])
def list_departments(db: Session = Depends(get_db)):
    """List all departments."""
    return db.query(Department).all()

@router.post(
    "", 
    response_model=DepartmentResponse, 
    status_code=status.HTTP_201_CREATED,
    responses={409: {"model": ErrorResponse, "description": "Department already exists"}}
)
def create_department(department: DepartmentCreate, db: Session = Depends(get_db)):
    """Create a new department."""
    existing = db.query(Department).filter(Department.name == department.name).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail={
                "code": "DUPLICATE",
                "message": f"Department '{department.name}' already exists"
            }
        )
    
    new_dept = Department(name=department.name)
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    return new_dept
