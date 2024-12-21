import React from "react";

const SummaryBox: React.FC = () => {
  return (
    <div>
      {/* Summary Heading */}
      <h4 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>
        Notes{" "}
        <span style={{ fontSize: "14px", fontWeight: "normal", color: "gray" }}>
          (past 30 days)
        </span>
      </h4>

      {/* Summary Box */}
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
            <span style={{ fontWeight: "bold" }}>Significant details:</span>
            <div style={{ fontWeight: "normal", marginTop: "5px" }}>
              Some random text about significant details.
            </div>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Rx info:</span>
            <div style={{ fontWeight: "normal", marginTop: "5px" }}>
              Some random text about Rx info.
            </div>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>
              Prescription Benefit Verification (BV) info:
            </span>
            <div style={{ fontWeight: "normal", marginTop: "5px" }}>
              Some random text about prescription benefit verification.
            </div>
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Billing/Invoice:</span>
            <div style={{ fontWeight: "normal", marginTop: "5px" }}>
              Some random text about billing and invoice management.
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SummaryBox;
