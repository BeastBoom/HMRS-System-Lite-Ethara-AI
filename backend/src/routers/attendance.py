from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ..database import get_db
from ..models import Employee, Attendance, AttendanceStatus
from ..schemas import (
    AttendanceCreate,
    AttendanceResponse,
    ErrorResponse,
    AttendanceUpdate,
    AttendanceBulkCreate,
    AttendanceBulkResponse,
)

router = APIRouter(prefix="/api/attendance", tags=["attendance"])


@router.get(
    "",
    response_model=AttendanceResponse,
    responses={404: {"model": ErrorResponse, "description": "Attendance not found"}},
)
def get_attendance_by_date(
    employeeId: str = Query(..., description="Employee ID (string)"),
    date: date = Query(..., description="Date of attendance"),
    db: Session = Depends(get_db),
):
    """Get a single attendance record by employee ID and date."""
    # Find employee first
    employee = db.query(Employee).filter(Employee.employee_id == employeeId).first()
    if not employee:
        raise HTTPException(
            status_code=404,
            detail={"code": "NOT_FOUND", "message": "Employee not found"},
        )

    attendance = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == employee.id,
            Attendance.date == date,
        )
        .first()
    )
    
    if not attendance:
        # Return 404 so UI knows no record exists
         raise HTTPException(
            status_code=404,
            detail={"code": "NOT_FOUND", "message": "No attendance record found for this date"},
        )

    return AttendanceResponse(
        id=attendance.id,
        employeeId=employee.employee_id,
        date=attendance.date,
        status=attendance.status.value,
    )


@router.post(
    "",
    response_model=AttendanceResponse,
    status_code=201,
    responses={
        400: {"model": ErrorResponse, "description": "Validation error"},
        404: {"model": ErrorResponse, "description": "Employee not found"},
        409: {"model": ErrorResponse, "description": "Duplicate attendance"},
    },
)
def mark_attendance(attendance_data: AttendanceCreate, db: Session = Depends(get_db)):
    """Mark attendance for an employee."""
    # Find employee by employee_id string
    employee = (
        db.query(Employee)
        .filter(Employee.employee_id == attendance_data.employeeId)
        .first()
    )
    if not employee:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "NOT_FOUND",
                "message": f"Employee with ID '{attendance_data.employeeId}' not found",
            },
        )

    # Check if attendance already exists for this employee on this date
    existing = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == employee.id,
            Attendance.date == attendance_data.date,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=409,
            detail={
                "code": "DUPLICATE",
                "message": f"Attendance already marked for employee '{attendance_data.employeeId}' on {attendance_data.date}",
                "userMessage": "Attendance already marked for this employee on this date.",
            },
        )

    # Create attendance record
    attendance = Attendance(
        employee_id=employee.id,
        date=attendance_data.date,
        status=AttendanceStatus(attendance_data.status),
    )

    try:
        db.add(attendance)
        db.commit()
        db.refresh(attendance)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail={
                "code": "DUPLICATE",
                "message": f"Attendance already marked for this employee on {attendance_data.date}",
                "userMessage": "Attendance already marked for this employee on this date.",
            },
        )


    
    return AttendanceResponse(
        id=attendance.id,
        employeeId=employee.employee_id,
        date=attendance.date,
        status=attendance.status.value,
    )


@router.patch(
    "",
    response_model=AttendanceResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Validation error"},
        404: {"model": ErrorResponse, "description": "Attendance not found"},
    },
)
def update_attendance(update_data: AttendanceUpdate, db: Session = Depends(get_db)):
    """Update an existing attendance record."""
    # Find employee first to get internal ID
    employee = (
        db.query(Employee)
        .filter(Employee.employee_id == update_data.employeeId)
        .first()
    )
    if not employee:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "NOT_FOUND",
                "message": f"Employee with ID '{update_data.employeeId}' not found",
                "userMessage": "Employee not found."
            },
        )

    # Find attendance record
    attendance = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == employee.id,
            Attendance.date == update_data.date,
        )
        .first()
    )
    if not attendance:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "NOT_FOUND",
                "message": "Attendance record not found to update",
                "userMessage": "No attendance found to update."
            },
        )

    # Update status
    if update_data.status:
         attendance.status = AttendanceStatus(update_data.status)

    try:
        db.commit()
        db.refresh(attendance)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail={
                "code": "INTERNAL_ERROR", 
                "message": str(e),
                "userMessage": "Failed to update attendance."
            }
        )

    return AttendanceResponse(
        id=attendance.id,
        employeeId=employee.employee_id,
        date=attendance.date,
        status=attendance.status.value,
    )


@router.post(
    "/bulk",
    response_model=AttendanceBulkResponse,
    status_code=201,
    responses={
        400: {"model": ErrorResponse, "description": "Validation error"},
    },
)
def bulk_mark_attendance(bulk_data: AttendanceBulkCreate, db: Session = Depends(get_db)):
    """Bulk mark attendance for multiple employees."""
    
    created_ids = []
    updated_ids = []
    skipped_ids = []
    
    # Pre-fetch all employees to minimize queries? Or just process one by one in transaction?
    # Given the list might be small (pagination size), one by one is okay for now, 
    # but strictly we should optimize.
    # Let's verify employees exist first.
    
    targets = db.query(Employee).filter(Employee.employee_id.in_(bulk_data.employeeIds)).all()
    target_map = {e.employee_id: e for e in targets}
    
    # Check for missing employees?
    # Spec doesn't strictly say, but good to know.
    
    try:
        for emp_id in bulk_data.employeeIds:
            employee = target_map.get(emp_id)
            if not employee:
                # Should we error or skip?
                # Let's skip invalid IDs but maybe log?
                continue
                
            # Check existing
            existing = (
                db.query(Attendance)
                .filter(
                    Attendance.employee_id == employee.id,
                    Attendance.date == bulk_data.date,
                )
                .first()
            )
            
            if existing:
                if bulk_data.overwrite:
                    existing.status = AttendanceStatus(bulk_data.status)
                    updated_ids.append(emp_id)
                else:
                    skipped_ids.append(emp_id)
            else:
                new_record = Attendance(
                    employee_id=employee.id,
                    date=bulk_data.date,
                    status=AttendanceStatus(bulk_data.status),
                )
                db.add(new_record)
                created_ids.append(emp_id)
        
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail={
                "code": "INTERNAL_ERROR",
                "message": str(e),
                "userMessage": "Bulk operation failed."
            }
        )
        
    return AttendanceBulkResponse(
        created=created_ids,
        updated=updated_ids,
        skipped=skipped_ids,
        message=f"Processed attendance: {len(created_ids)} created, {len(updated_ids)} updated, {len(skipped_ids)} skipped."
    )
