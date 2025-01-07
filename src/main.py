from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import storage
import pandas as pd

app = FastAPI()

# Configure CORS
origins = ["https://localhost:5173"]  # React or other frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
BUCKET_NAME = "your-gcs-bucket-name"
FILE_NAME = "path/to/your_file.csv"
PROJECT_NAME = "your-project-id"

# Global variable to hold the DataFrame
dataframe = None


def load_csv_from_gcs() -> pd.DataFrame:
    """
    Load a CSV file from GCS into a Pandas DataFrame.

    Returns:
        pd.DataFrame: DataFrame containing the CSV data.
    """
    try:
        # Initialize GCS client with default credentials
        client = storage.Client(project=PROJECT_NAME)
        bucket = client.bucket(BUCKET_NAME)
        blob = bucket.blob(FILE_NAME)
        csv_data = blob.download_as_text()
        df = pd.read_csv(pd.compat.StringIO(csv_data))
        return df
    except Exception as e:
        print(f"Error reading from GCS: {e}")
        raise


@app.on_event("startup")
async def startup_event():
    """
    Load the CSV data from GCS into a global DataFrame on application startup.
    """
    global dataframe
    try:
        print("Starting up and loading data from GCS...")
        # Load data from GCS
        dataframe = load_csv_from_gcs()
        print("DataFrame loaded successfully:")
        print(dataframe.head())  # Debug: Print first few rows of the DataFrame
    except Exception as e:
        print(f"Error loading data: {e}")


@app.get("/data")
async def get_data():
    """
    API endpoint to return all patient information and selection options for React.

    Returns:
        dict: Contains patient_info, select_patient_id, and select_drug_id.
    """
    global dataframe
    if dataframe is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    # Prepare selection options
    patient_ids = dataframe["patient_id"].unique().tolist()
    drug_ids = dataframe["drug"].unique().tolist()

    return {
        "patient_info": dataframe.to_dict(orient="records"),
        "select_patient_id": patient_ids,
        "select_drug_id": drug_ids,
    }
