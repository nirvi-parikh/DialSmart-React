from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import storage
from google.auth import impersonated_credentials
from google.auth import default
import pandas as pd

app = FastAPI()

# Configure CORS to allow requests from React
origins = [
    "https://localhost:5173",  # React development server
]

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
TARGET_SERVICE_ACCOUNT = "target-impersonation-account@your-project.iam.gserviceaccount.com"
PROJECT_NAME = "your-project-id"

# Global DataFrame variable
dataframe = None

def get_impersonated_credentials(target_service_account: str, scopes: list):
    """
    Creates credentials for impersonating a service account.

    Args:
        target_service_account (str): The email of the target service account to impersonate.
        scopes (list): The scopes to use for the impersonated credentials.

    Returns:
        impersonated_credentials.Credentials: Impersonated credentials.
    """
    # Get default credentials (e.g., from gcloud auth or service account)
    source_credentials, _ = default(scopes=["https://www.googleapis.com/auth/cloud-platform"])

    # Set up impersonation
    impersonated_creds = impersonated_credentials.Credentials(
        source_credentials=source_credentials,
        target_principal=target_service_account,
        target_scopes=scopes,
        lifetime=3600  # Token lifetime in seconds (1 hour)
    )
    return impersonated_creds

def load_csv_from_gcs(credentials) -> pd.DataFrame:
    """
    Load a CSV file from GCS into a Pandas DataFrame.

    Args:
        credentials: Authenticated Google Cloud credentials.

    Returns:
        pd.DataFrame: DataFrame containing the CSV data.
    """
    try:
        client = storage.Client(credentials=credentials, project=PROJECT_NAME)
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
        # Get impersonated credentials
        impersonated_creds = get_impersonated_credentials(
            target_service_account=TARGET_SERVICE_ACCOUNT,
            scopes=["https://www.googleapis.com/auth/cloud-platform"]
        )
        # Load data from GCS
        dataframe = load_csv_from_gcs(impersonated_creds)
        print("DataFrame loaded successfully:")
        print(dataframe.head())  # Print the first few rows of the DataFrame for debugging
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

    # Return response
    return {
        "patient_info": dataframe.to_dict(orient="records"),
        "select_patient_id": patient_ids,
        "select_drug_id": drug_ids,
    }
