import React from "react";

const RefillsLeftBox: React.FC = () => {
  return (
    <div>
      <h4 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>
        Refills Left
      </h4>
      <div
        className="p-3"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p style={{ marginBottom: "0", fontSize: "14px" }}>
          Random text about refills left for the patient.
        </p>
      </div>
    </div>
  );
};

export default RefillsLeftBox;
