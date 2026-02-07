import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from dotenv import load_dotenv

from .routers import employees_router, attendance_router, dashboard_router, departments_router
from .schemas import HealthResponse

load_dotenv()

# Get allowed origins from environment
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
origins = [origin.strip() for origin in ALLOWED_ORIGINS.split(",")]

app = FastAPI(
    title="HRMS-Lite API",
    description="Human Resource Management System - Lite Edition",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Custom exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors with consistent error format."""
    errors = exc.errors()
    if errors:
        first_error = errors[0]
        field = first_error.get("loc", ["unknown"])[-1]
        message = first_error.get("msg", "Validation error")
        
        # Clean up the message
        if "Value error," in message:
            message = message.replace("Value error, ", "")
        
        return JSONResponse(
            status_code=400,
            content={
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": f"{field}: {message}",
                }
            },
        )
    
    return JSONResponse(
        status_code=400,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request data",
            }
        },
    )


from fastapi import HTTPException

# Custom exception handler for HTTPException to ensure consistent format
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with consistent error format."""
    # Check if detail is a dict (our custom structure) or string
    if isinstance(exc.detail, dict):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.detail},
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": "HTTP_ERROR",
                "message": exc.detail,
            }
        },
    )
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions."""
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred",
            }
        },
    )


# Health check endpoint
@app.get("/health", response_model=HealthResponse, tags=["health"])
def health_check():
    """Health check endpoint."""
    return HealthResponse(status="ok")


# Include routers
app.include_router(employees_router)
app.include_router(attendance_router)
app.include_router(dashboard_router)
app.include_router(departments_router)

# Import Department model here to avoid circular imports if any, or just use it
from .models import Department, Base
from .database import SessionLocal, engine

# Create tables
Base.metadata.create_all(bind=engine)

@app.on_event("startup")
def seed_departments():
    """Seed default departments if they don't exist."""
    db = SessionLocal()
    try:
        defaults = [
            "IT", "Management", "Sales", "HR", "Finance", 
            "Product", "Operations", "Support", "Marketing", "Design"
        ]
        for dept_name in defaults:
            exists = db.query(Department).filter(Department.name == dept_name).first()
            if not exists:
                db.add(Department(name=dept_name))
        db.commit()
    except Exception as e:
        print(f"Error seeding departments: {e}")
    finally:
        db.close()


