from .employees import router as employees_router
from .attendance import router as attendance_router
from .dashboard import router as dashboard_router
from .departments import router as departments_router


__all__ = ["employees_router", "attendance_router", "dashboard_router"]
