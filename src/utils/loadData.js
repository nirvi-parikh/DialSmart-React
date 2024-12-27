import axios from "axios";
import Papa from "papaparse";

/**
 * Fetches and parses a CSV file from Google Cloud Storage.
 * @param {string} blobName - The name of the file in GCS (e.g., "dialsmart_daily_data_layer.csv").
 * @param {string} bucketName - The name of the bucket in GCS (e.g., "anbc-sga-workbench-backup-pss-dev").
 * @returns {Promise<Array<Object>>} - Parsed CSV data as an array of objects.
 */
export const loadDataFromGCS = async (blobName, bucketName) => {
  try {
    // Construct the GCS file URL
    const fileUrl = `https://storage.googleapis.com/${bucketName}/${blobName}`;

    // Fetch the file from GCS
    const response = await axios.get(fileUrl, { responseType: "blob" });

    // Parse the CSV file
    return new Promise((resolve, reject) => {
      Papa.parse(response.data, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => resolve(result.data),
        error: (error) => reject(error),
      });
    });
  } catch (error) {
    console.error("Error fetching or parsing data from GCS:", error.message);
    throw error;
  }
};
