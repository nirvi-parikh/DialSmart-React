import React from "react";

const PatientAdherenceBox: React.FC = () => {
  return (
    <div>
      {/* Patient Adherence Heading */}
      <h4 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>
        Patient Adherence
      </h4>

      {/* Patient Adherence Box */}
      <div
        className="p-3"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <ul style={{ paddingLeft: "20px", marginBottom: "0" }}>
          <li style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Refill Patterns:</span>
            <div style={{ fontWeight: "normal", marginTop: "5px" }}>
              Random text about patient refill patterns.
            </div>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Missed Doses:</span>
            <div style={{ fontWeight: "normal", marginTop: "5px" }}>
              Random text about tracking missed doses.
            </div>
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Engagement Metrics:</span>
            <div style={{ fontWeight: "normal", marginTop: "5px" }}>
              Random text about patient engagement with reminders.
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PatientAdherenceBox;
