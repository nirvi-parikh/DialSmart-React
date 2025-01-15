import React from "react";

interface PatientData {
  PTNT_ID: string;
  Patient_Name: string;
  Drug: string;
  Rx_fills_remaining: number;
  new_rx_status: string;
  pymt_mthd_desc: string;
  current_dnf: string;
  total_fill_supply_in_hand: number;
  alt_phone_no?: string; // Assuming optional alternate phone number
}

interface PatientInfoProps {
  patient: PatientData | null;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
  if (!patient) {
    return (
      <div className="text-muted">
        Please select a Patient ID and Drug to view patient information.
      </div>
    );
  }

  return (
    <div
      className="container mt-4 p-3"
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className="d-flex flex-column"
        style={{ gap: "15px" }}
      >
        {/* First Row */}
        <div className="d-flex flex-wrap align-items-center" style={{ gap: "20px" }}>
          <div>
            <strong>Patient Name:</strong> {patient.Patient_Name}
          </div>
          <div>
            <strong>Patient ID:</strong> {patient.PTNT_ID}
          </div>
          <div>
            <strong>Drug:</strong> {patient.Drug}
          </div>
          <div>
            <strong>Rx Fills Remaining:</strong> {patient.Rx_fills_remaining}
          </div>
          <div>
            <strong>Expected Supply in Hand:</strong> {patient.total_fill_supply_in_hand}
          </div>
        </div>

        {/* Second Row */}
        <div className="d-flex flex-wrap align-items-center" style={{ gap: "20px" }}>
          <div>
            <strong>New Rx Status:</strong> {patient.new_rx_status}
          </div>
          <div>
            <strong>Payment Method:</strong> {patient.pymt_mthd_desc}
          </div>
          <div>
            <strong>Alternate Phone No:</strong> {patient.alt_phone_no || "N/A"}
          </div>
          <div>
            <strong>Current DNF:</strong> {patient.current_dnf}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
