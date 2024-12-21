import React from "react";

interface PatientData {
  name: string;
  id: string;
  drug: string;
  rxFillsRemaining: string;
  expectedSupplyInHand: string;
  newRxStatus: string;
  paymentMethod: string;
  alternatePhoneNo: string;
  currentDNF: string;
}

interface PatientInfoProps {
  patient: PatientData | null;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
  if (!patient) {
    return <div>No patient data available.</div>;
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
      <h5 style={{ marginBottom: "15px" }}>Patient Info</h5>
      <div className="row mb-3">
        <div className="col-md-3">
          <strong>Patient Name</strong>
          <div>{patient.name}</div>
        </div>
        <div className="col-md-3">
          <strong>Patient ID</strong>
          <div>{patient.id}</div>
        </div>
        <div className="col-md-3">
          <strong>Drug</strong>
          <div>{patient.drug}</div>
        </div>
        <div className="col-md-3">
          <strong>Rx Fills Remaining</strong>
          <div>{patient.rxFillsRemaining}</div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
