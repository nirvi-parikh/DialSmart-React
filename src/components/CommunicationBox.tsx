import React from "react";

const CommunicationBox: React.FC = () => {
  return (
    <div>
      {/* Communication Heading */}
      <h4 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>
        Communication Summary
      </h4>

      {/* Communication Box */}
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
            <span style={{ fontWeight: "bold" }}>Call:</span>
            <div style={{ fontWeight: "normal", marginTop: "5px" }}>
              Random text about call communication with patients.
            </div>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Refill reminders:</span>
            <div style={{ fontWeight: "normal", marginTop: "5px" }}>
              Random text about refill reminders sent to patients.
            </div>
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>System communication:</span>
            <div style={{ fontWeight: "normal", marginTop: "5px" }}>
              Random text about automated system communications.
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CommunicationBox;
