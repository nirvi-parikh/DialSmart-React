from fastapi import FastAPI, HTTPException
from google.cloud import storage
from google.auth.transport.requests import Request
from google.auth import default
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  # Adjust this based on your React app's URL
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hardcoded impersonated target service account
TARGET_SERVICE_ACCOUNT = "target-impersonation-account@your-project.iam.gserviceaccount.com"
BUCKET_NAME = "your-gcs-bucket-name"
FILE_NAME = "path/to/your_file.csv"
PROJECT_NAME = "your-project-id"  # Replace with your actual project ID

def get_impersonated_credentials():
    """
    Authenticates and creates credentials for the impersonated service account
    using default application credentials.

    Returns:
        google.auth.credentials.Credentials: Impersonated credentials.
    """
    # Get default credentials (e.g., from `gcloud auth application-default login`)
    source_credentials, _ = default(scopes=["https://www.googleapis.com/auth/cloud-platform"])

    # Impersonate the target service account
    impersonated_credentials = source_credentials.with_subject(TARGET_SERVICE_ACCOUNT)

    # Refresh credentials to ensure they're valid
    impersonated_credentials.refresh(Request())

    return impersonated_credentials


def load_csv_from_gcs(credentials) -> pd.DataFrame:
    """
    Load a CSV file from GCS into a Pandas DataFrame.

    Args:
        credentials: Authenticated Google Cloud credentials.

    Returns:
        pd.DataFrame: DataFrame containing the CSV data.
    """
    client = storage.Client(credentials=credentials, project=PROJECT_NAME)
    bucket = client.bucket(BUCKET_NAME)
    blob = bucket.blob(FILE_NAME)
    csv_data = blob.download_as_text()
    df = pd.read_csv(pd.compat.StringIO(csv_data))
    return df


# Global variable for DataFrame
dataframe = None

@app.on_event("startup")
async def startup_event():
    global dataframe
    try:
        # Get impersonated credentials using default application credentials
        impersonated_credentials = get_impersonated_credentials()

        # Load CSV from GCS
        dataframe = load_csv_from_gcs(impersonated_credentials)
    except Exception as e:
        print(f"Error loading data: {e}")


@app.get("/data")
async def get_data():
    global dataframe
    if dataframe is None:
        raise HTTPException(status_code=500, detail="Data not loaded")
    
    # Prepare "select patient id" and "select drug id" options
    patient_ids = dataframe["patient_id"].unique().tolist()
    drug_ids = dataframe["drug"].unique().tolist()

    # Return JSON response
    return {
        "patient_info": dataframe.to_dict(orient="records"),
        "select_patient_id": patient_ids,
        "select_drug_id": drug_ids,
    }
