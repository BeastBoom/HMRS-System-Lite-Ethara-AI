from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel

from ..database import get_db
from ..models import Employee, Attendance, AttendanceStatus

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

class DashboardStats(BaseModel):
    totalEmployees: int
    presentToday: int
    absentToday: int
    attendanceRate: float

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics."""
    # Total employees
    total_employees = db.query(func.count(Employee.id)).scalar()

    # Today's attendance
    today = func.current_date()
    
    present_today = db.query(func.count(Attendance.id)).filter(
        Attendance.date == today,
        Attendance.status == AttendanceStatus.present
    ).scalar()
    
    absent_today = db.query(func.count(Attendance.id)).filter(
        Attendance.date == today,
        Attendance.status == AttendanceStatus.absent
    ).scalar()
    
    # Calculate rate (based on total employees, or total records?)
    # Usually rate is present / total_employees * 100 for daily rate
    attendance_rate = 0.0
    if total_employees > 0:
        attendance_rate = (present_today / total_employees) * 100

    return DashboardStats(
        totalEmployees=total_employees,
        presentToday=present_today,
        absentToday=absent_today,
        attendanceRate=round(attendance_rate, 1)
    )
