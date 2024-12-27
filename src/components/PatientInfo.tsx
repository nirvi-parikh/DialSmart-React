import React from "react";

interface PatientInfoProps {
  selectedPatientId: string;
  selectedDrug: string;
  patientData: any[];
}

const PatientInfo: React.FC<PatientInfoProps> = ({
  selectedPatientId,
  selectedDrug,
  patientData,
}) => {
  // Find relevant patient details
  const patientDetails = patientData.find(
    (item) =>
      item.patient_id === selectedPatientId && item.drug === selectedDrug
  );

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
        {selectedPatientId && selectedDrug && patientDetails ? (
          <>
            <div className="mb-3">
              <div style={{ fontWeight: "normal" }}>Patient Name</div>
              <div style={{ fontWeight: "bold" }}>
                {patientDetails.name || "Not Available"}
              </div>
            </div>
            <div className="mb-3">
              <div style={{ fontWeight: "normal" }}>Patient ID</div>
              <div style={{ fontWeight: "bold" }}>
                {patientDetails.patient_id}
              </div>
            </div>
            <div className="mb-3">
              <div style={{ fontWeight: "normal" }}>Drug</div>
              <div style={{ fontWeight: "bold" }}>{patientDetails.drug}</div>
            </div>
            <div className="mb-3">
              <div style={{ fontWeight: "normal" }}>Rx Fills Remaining</div>
              <div style={{ fontWeight: "bold" }}>
                {patientDetails.rx_fills_remaining || "Not Available"}
              </div>
            </div>
            <div className="mb-3">
              <div style={{ fontWeight: "normal" }}>Expected Supply in Hand</div>
              <div style={{ fontWeight: "bold" }}>
                {patientDetails.expected_supply_in_hand || "Not Available"}
              </div>
            </div>
            <div className="mb-3">
              <div style={{ fontWeight: "normal" }}>New Rx Status</div>
              <div style={{ fontWeight: "bold" }}>
                {patientDetails.new_rx_status || "Not Applicable"}
              </div>
            </div>
            <div className="mb-3">
              <div style={{ fontWeight: "normal" }}>Payment Method</div>
              <div style={{ fontWeight: "bold" }}>
                {patientDetails.payment_method || "Not Available"}
              </div>
            </div>
            <div className="mb-3">
              <div style={{ fontWeight: "normal" }}>Alternate Phone No.</div>
              <div style={{ fontWeight: "bold" }}>
                {patientDetails.alternate_phone_no || "Not Available"}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: "normal" }}>Current DNF</div>
              <div style={{ fontWeight: "bold" }}>
                {patientDetails.current_dnf || "Not Available"}
              </div>
            </div>
          </>
        ) : (
          <div style={{ fontStyle: "italic", color: "#999" }}>
            Please select a patient and drug to view details.
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientInfo;
