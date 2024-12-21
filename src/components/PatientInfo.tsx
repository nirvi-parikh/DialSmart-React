import React from "react";

const PatientInfo: React.FC = () => {
  const patientData = {
    name: "DANIEL WEITZ",
    id: "6228751",
    drug: "DUPIXENT",
    rxFillsRemaining: "3",
    expectedSupplyInHand: "Not Available",
    newRxStatus: "Not applicable",
    paymentMethod: "STATEMENT",
    alternatePhoneNo: "Not Available",
    currentDNF: "No",
  };

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
        <div className="mb-3">
          <div style={{ fontWeight: "normal" }}>Patient Name</div>
          <div style={{ fontWeight: "bold" }}>{patientData.name}</div>
        </div>
        <div className="mb-3">
          <div style={{ fontWeight: "normal" }}>Patient ID</div>
          <div style={{ fontWeight: "bold" }}>{patientData.id}</div>
        </div>
        <div className="mb-3">
          <div style={{ fontWeight: "normal" }}>Drug</div>
          <div style={{ fontWeight: "bold" }}>{patientData.drug}</div>
        </div>
        <div className="mb-3">
          <div style={{ fontWeight: "normal" }}>Rx Fills Remaining</div>
          <div style={{ fontWeight: "bold" }}>{patientData.rxFillsRemaining}</div>
        </div>
        <div className="mb-3">
          <div style={{ fontWeight: "normal" }}>Expected Supply in Hand</div>
          <div style={{ fontWeight: "bold" }}>{patientData.expectedSupplyInHand}</div>
        </div>
        <div className="mb-3">
          <div style={{ fontWeight: "normal" }}>New Rx Status</div>
          <div style={{ fontWeight: "bold" }}>{patientData.newRxStatus}</div>
        </div>
        <div className="mb-3">
          <div style={{ fontWeight: "normal" }}>Payment Method</div>
          <div style={{ fontWeight: "bold" }}>{patientData.paymentMethod}</div>
        </div>
        <div className="mb-3">
          <div style={{ fontWeight: "normal" }}>Alternate Phone No.</div>
          <div style={{ fontWeight: "bold" }}>{patientData.alternatePhoneNo}</div>
        </div>
        <div>
          <div style={{ fontWeight: "normal" }}>Current DNF</div>
          <div style={{ fontWeight: "bold" }}>{patientData.currentDNF}</div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
