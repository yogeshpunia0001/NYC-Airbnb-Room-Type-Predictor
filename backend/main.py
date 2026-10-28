import os
import joblib
import pandas as pd
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict

# ─── Global Model Holder & Path Configurations ─────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE = os.path.join(BASE_DIR, "Model_Pipeline.pkl")
DATA_FILE = os.path.join(BASE_DIR, "AB_NYC_2019.csv")
NYC_DATA_JSON = os.path.join(BASE_DIR, "nyc_data.json")
model_pipeline = None


# ─── Lifespan Context Manager (Loads Model Once on Startup) ─────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    global model_pipeline
    if not os.path.exists(MODEL_FILE):
        raise FileNotFoundError(f"Model file '{MODEL_FILE}' not found. Please train and export it first.")
    
    # Load the end-to-end serialized pipeline
    model_pipeline = joblib.load(MODEL_FILE)
    print("✅ Model_Pipeline.pkl loaded successfully into memory.")
    yield
    print("🛑 Shutting down backend service.")


# ─── Initialize FastAPI App ────────────────────────────────────────────────────
app = FastAPI(
    title="NYC Airbnb Room Type Classifier API",
    description="Production inference backend predicting room types using tuned Random Forest and Scikit-Learn pipelines.",
    version="1.0.0",
    lifespan=lifespan
)

# ─── CORS Middleware Configuration ─────────────────────────────────────────────
# Configured for decoupled production deployment (Next.js on Vercel, FastAPI on Render)
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://theyogeshpoonia.in",
    "https://www.theyogeshpoonia.in",
    "https://airbnb.theyogeshpoonia.in",
    "*",
]

# Optional additional origins from environment variable
env_origins = os.getenv("ALLOWED_ORIGINS") or os.getenv("CORS_ORIGINS")
if env_origins:
    ALLOWED_ORIGINS.extend([o.strip() for o in env_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",  # Accepts all Vercel preview URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Pydantic Request & Response Schemas ─────────────────────────────────────────
class ListingFeatures(BaseModel):
    # Geographics & Location
    latitude: float = Field(..., ge=40.0, le=41.5, example=40.7128)
    longitude: float = Field(..., ge=-75.0, le=-73.0, example=-73.9654)
    neighbourhood_group: str = Field(..., example="Brooklyn")
    neighbourhood: str = Field(..., example="Williamsburg")
    
    # Rental & Listing Characteristics
    price: float = Field(..., ge=0.0, example=150.0)
    minimum_nights: int = Field(..., ge=1, example=3)
    number_of_reviews: int = Field(0, ge=0, example=25)
    reviews_per_month: float = Field(0.0, ge=0.0, example=1.5)
    calculated_host_listings_count: int = Field(1, ge=1, example=2)
    availability_365: int = Field(..., ge=0, le=365, example=180)


class PredictionResponse(BaseModel):
    predicted_room_type: str
    confidence_probabilities: Dict[str, float]
    status: str = "success"


# ─── Endpoints ──────────────────────────────────────────────────────────────────
@app.get("/")
def health_check():
    """Health check endpoint to verify backend status."""
    return {"status": "healthy", "service": "NYC Airbnb Classification API"}


@app.post("/predict", response_model=PredictionResponse)
def predict_room_type(listing: ListingFeatures):
    """
    Accepts raw listing features, structures them into a DataFrame,
    runs them through the pre-fitted Scikit-Learn pipeline, and returns predictions.
    """
    if model_pipeline is None:
        raise HTTPException(status_code=503, detail="Model pipeline is not loaded yet.")

    try:
        # 1. Convert input to DataFrame matching training schema
        input_data = pd.DataFrame([{
            "latitude": listing.latitude,
            "longitude": listing.longitude,
            "neighbourhood_group": listing.neighbourhood_group,
            "neighbourhood": listing.neighbourhood,
            "price": listing.price,
            "minimum_nights": listing.minimum_nights,
            "number_of_reviews": listing.number_of_reviews,
            "reviews_per_month": listing.reviews_per_month,
            "calculated_host_listings_count": listing.calculated_host_listings_count,
            "availability_365": listing.availability_365,
        }])

        # 2. Pipeline inference (automatically applies ColumnTransformer preprocessing + Random Forest)
        prediction = model_pipeline.predict(input_data)[0]
        probabilities = model_pipeline.predict_proba(input_data)[0]
        
        # 3. Map probabilities to class names
        class_names = model_pipeline.classes_.tolist()
        prob_dict = {
            cls_name: round(float(prob), 4)
            for cls_name, prob in zip(class_names, probabilities)
        }

        return PredictionResponse(
            predicted_room_type=str(prediction),
            confidence_probabilities=prob_dict
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")