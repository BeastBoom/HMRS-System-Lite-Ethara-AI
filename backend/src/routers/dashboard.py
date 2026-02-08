from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List
from datetime import date, timedelta

from ..database import get_db
from ..models import Employee, Attendance, AttendanceStatus

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

class DashboardStats(BaseModel):
    totalEmployees: int
    todayPresent: int
    monthPresent: int
    avgAttendancePercent: float

@router.get("/summary", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics."""
    # Total employees
    total_employees = db.query(func.count(Employee.id)).scalar()

    # Today's attendance
    today = date.today()
    
    today_present = db.query(func.count(Attendance.id)).filter(
        Attendance.date == today,
        Attendance.status == AttendanceStatus.present
    ).scalar()
    
    # Month's attendance
    first_day_month = today.replace(day=1)
    month_present = db.query(func.count(Attendance.id)).filter(
        Attendance.date >= first_day_month,
        Attendance.status == AttendanceStatus.present
    ).scalar()
    
    # Calculate avg attendance percent (based on last 30 days)
    # Formula: Total Present / (Total Present + Total Absent) * 100
    # This ignores days where no attendance was marked.
    thirty_days_ago = today - timedelta(days=30)
    
    attendance_stats = db.query(
        func.count(Attendance.id).filter(Attendance.status == AttendanceStatus.present).label('present'),
        func.count(Attendance.id).filter(Attendance.status == AttendanceStatus.absent).label('absent')
    ).filter(
        Attendance.date >= thirty_days_ago,
        Attendance.date <= today
    ).first()
    
    total_present_30d = attendance_stats.present or 0
    total_absent_30d = attendance_stats.absent or 0
    total_marked_30d = total_present_30d + total_absent_30d
    
    avg_attendance_percent = 0.0
    if total_marked_30d > 0:
        avg_attendance_percent = (total_present_30d / total_marked_30d) * 100

    return DashboardStats(
        totalEmployees=total_employees,
        todayPresent=today_present,
        monthPresent=month_present,
        avgAttendancePercent=round(avg_attendance_percent, 1)
    )


class TrendDataPoint(BaseModel):
    date: str
    present: int
    absent: int

class TrendsResponse(BaseModel):
    series: List[TrendDataPoint]

@router.get("/trends", response_model=TrendsResponse)
def get_trends(
    from_date: str = Query(None, alias="from"),
    to_date: str = Query(None, alias="to"),
    db: Session = Depends(get_db)
):
    """Get attendance trends for a date range."""
    # Default to last 30 days if not provided
    if not to_date:
        to_date = date.today().isoformat()
    if not from_date:
        from_date = (date.today() - timedelta(days=30)).isoformat()
        
    # Query logic
    records = (
        db.query(Attendance.date, Attendance.status)
        .filter(Attendance.date >= from_date)
        .filter(Attendance.date <= to_date)
        .all()
    )
    
    # Process in python for simplicity (or use complex SQL group by)
    # Using a dict to aggregate by date
    daily_stats = {}
    
    # Initialize range? No, just present points or fill gaps?
    # Simple aggregation of retrieved records for now.
    for r in records:
        d_str = r.date.isoformat()
        if d_str not in daily_stats:
            daily_stats[d_str] = {"present": 0, "absent": 0}
        
        if r.status == AttendanceStatus.present:
            daily_stats[d_str]["present"] += 1
        elif r.status == AttendanceStatus.absent:
            daily_stats[d_str]["absent"] += 1
            
    # Convert to list and sort
    series = []
    for d_str, stats in daily_stats.items():
        series.append(TrendDataPoint(
            date=d_str,
            present=stats["present"],
            absent=stats["absent"]
        ))
    
    series.sort(key=lambda x: x.date)
    
    return TrendsResponse(series=series)


class DepartmentDistributionItem(BaseModel):
    name: str
    count: int

@router.get("/departments", response_model=List[DepartmentDistributionItem])
def get_department_distribution(db: Session = Depends(get_db)):
    """Get employee count per department."""
    # Group by department string in Employee model
    # Or strict Department table join?
    # Employee.department is a string, Department table exists.
    # Let's group by Employee.department string for simplicity/robustness if data is inconsistent,
    # or query Department table and left join count.
    
    # Accurate approach: Query all departments, count employees in them.
    from ..models import Department
    
    depts = db.query(Department).all()
    distribution = []
    
    for dept in depts:
        count = db.query(func.count(Employee.id)).filter(Employee.department == dept.name).scalar()
        distribution.append(DepartmentDistributionItem(name=dept.name, count=count))
        
    # Handle employees with null/invalid departments? (Optional)
    
    return distribution
