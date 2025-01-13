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
      <h5 style={{ marginBottom: "15px" }}>Patient Info</h5>
      <div className="row mb-3">
        <div className="col-md-6">
          <strong>Patient ID:</strong>
          <div>{patient.PTNT_ID}</div>
        </div>
        <div className="col-md-6">
          <strong>Patient Name:</strong>
          <div>{patient.Patient_Name}</div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <strong>Drug:</strong>
          <div>{patient.Drug}</div>
        </div>
        <div className="col-md-6">
          <strong>Rx Fills Remaining:</strong>
          <div>{patient.Rx_fills_remaining}</div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <strong>New Rx Status:</strong>
          <div>{patient.new_rx_status}</div>
        </div>
        <div className="col-md-6">
          <strong>Payment Method:</strong>
          <div>{patient.pymt_mthd_desc}</div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <strong>Current DNF:</strong>
          <div>{patient.current_dnf}</div>
        </div>
        <div className="col-md-6">
          <strong>Total Fill Supply in Hand:</strong>
          <div>{patient.total_fill_supply_in_hand}</div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
