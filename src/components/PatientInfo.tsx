import React, { useEffect, useState } from "react";

interface PatientDetails {
  patient_id: string;
  name?: string;
  drug: string;
  rx_fills_remaining?: number;
  expected_supply_in_hand?: string;
  new_rx_status?: string;
  payment_method?: string;
  alternate_phone_no?: string;
  current_dnf?: string;
  [key: string]: any; // Allow additional dynamic fields
}

interface PatientInfoProps {
  selectedPatientId: string;
  selectedDrug: string;
}

const PatientInfo: React.FC<PatientInfoProps> = ({
  selectedPatientId,
  selectedDrug,
}) => {
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (selectedPatientId && selectedDrug) {
        setLoading(true);
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/patient-info?patient_id=${selectedPatientId}&drug=${selectedDrug}`
          );
          if (response.ok) {
            const data = await response.json();
            setPatientDetails(data.length > 0 ? data[0] : null); // Assuming API returns an array
          } else {
            console.error("Error fetching patient info:", response.statusText);
            setPatientDetails(null);
          }
        } catch (error) {
          console.error("Error fetching patient info:", error);
          setPatientDetails(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPatientDetails();
  }, [selectedPatientId, selectedDrug]);

  if (loading) {
    return <div>Loading patient details...</div>;
  }

  if (!selectedPatientId || !selectedDrug) {
    return <div>Please select a patient and drug to view details.</div>;
  }

  if (!patientDetails) {
    return (
      <div style={{ fontStyle: "italic", color: "#999" }}>
        No details available for the selected patient and drug.
      </div>
    );
  }

  return (
    <div>
      {/* Patient Info Heading */}
      <h4 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>
        Patient Info
      </h4>

      {/* Patient Info Box */}
      <div
        className="p-3"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {Object.entries(patientDetails).map(([key, value]) => (
          <div key={key} className="mb-3">
            <div style={{ fontWeight: "normal", textTransform: "capitalize" }}>
              {key.replace(/_/g, " ")} {/* Format key to be more readable */}
            </div>
            <div style={{ fontWeight: "bold" }}>
              {value !== null && value !== undefined ? value : "Not Available"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientInfo;