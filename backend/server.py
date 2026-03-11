from fastapi import FastAPI, APIRouter
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import io
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List
import uuid
from datetime import datetime, timezone
import openpyxl

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# Models
class EmailSubscriber(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    subscribed_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class SubscribeRequest(BaseModel):
    email: EmailStr


class SubscribeResponse(BaseModel):
    success: bool
    message: str


# Routes
@api_router.get("/")
async def root():
    return {"message": "CuratedCloset API"}


@api_router.post("/subscribe", response_model=SubscribeResponse)
async def subscribe(req: SubscribeRequest):
    existing = await db.subscribers.find_one({"email": req.email}, {"_id": 0})
    if existing:
        return SubscribeResponse(success=False, message="This email is already registered.")

    subscriber = EmailSubscriber(email=req.email)
    doc = subscriber.model_dump()
    await db.subscribers.insert_one(doc)
    return SubscribeResponse(success=True, message="Welcome to CuratedCloset!")


@api_router.get("/admin/subscribers")
async def get_subscribers():
    subscribers = await db.subscribers.find({}, {"_id": 0}).sort("subscribed_at", -1).to_list(10000)
    return {"subscribers": subscribers, "total": len(subscribers)}


@api_router.get("/admin/subscribers/export")
async def export_subscribers():
    subscribers = await db.subscribers.find({}, {"_id": 0}).sort("subscribed_at", -1).to_list(10000)

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Subscribers"
    ws.append(["Email", "Subscribed At"])

    for sub in subscribers:
        ws.append([sub.get("email", ""), sub.get("subscribed_at", "")])

    # Auto-width columns
    for col in ws.columns:
        max_length = 0
        col_letter = col[0].column_letter
        for cell in col:
            if cell.value:
                max_length = max(max_length, len(str(cell.value)))
        ws.column_dimensions[col_letter].width = max_length + 4

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=curatedcloset_subscribers.xlsx"}
    )


@api_router.delete("/admin/subscribers/{subscriber_id}")
async def delete_subscriber(subscriber_id: str):
    result = await db.subscribers.delete_one({"id": subscriber_id})
    if result.deleted_count == 0:
        return {"success": False, "message": "Subscriber not found"}
    return {"success": True, "message": "Subscriber deleted"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
