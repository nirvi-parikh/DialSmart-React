from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import storage
import pandas as pd

app = FastAPI()

# Configure CORS
origins = ["http://localhost:5173"]  # React or other frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


INCLUDE_FIELDS = [
    "PTNT_ID",
    "Patient_Name",
    "Drug",
    "Rx_fills_remaining",
    "new_rx_status",
    "pymt_mthd_desc",
    "current_dnf",
    "total_fill_supply_in_hand",
]

@app.get("/data")
async def get_data():
    """
    API endpoint to return patient_id, drugs_by_patient, and patient_info mapping.

    Returns:
        dict: Contains patient_id, drugs_by_patient, and patient_info mapping.
    """
    global dataframe
    if dataframe is None:
        raise HTTPException(status_code=500, detail="Data not loaded")

    # Filter the DataFrame to include only the required fields
    filtered_df = dataframe[INCLUDE_FIELDS].copy()

    # Prepare patient_id (unique patient IDs)
    patient_ids = filtered_df["PTNT_ID"].unique().tolist()

    # Prepare drugs_by_patient (mapping of patient ID to their drugs)
    drugs_by_patient = (
        filtered_df.groupby("PTNT_ID")["Drug"]
        .apply(list)
        .to_dict()
    )

    # Prepare patient_info (mapping of (patient_id, drug) to patient information)
    patient_info_mapping = filtered_df.groupby(["PTNT_ID", "Drug"]).apply(
        lambda group: group.iloc[0].to_dict()
    ).to_dict()

    # Prepare the response
    response = {
        "patient_id": patient_ids,
        "drugs_by_patient": drugs_by_patient,
        "patient_info": patient_info_mapping,
    }

    print("Response Data:", response)  # Debug: Print the response data
    return response