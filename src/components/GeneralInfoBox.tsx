import React from "react";

const GeneralInfoBox: React.FC = () => {
  return (
    <div>
      {/* General Info Heading */}
      <h4 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>
        General Updates
      </h4>

      {/* General Info Box */}
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
            <span style={{ fontWeight: "bold" }}>System Notifications:</span>{" "}
            Random text about system notifications.
          </li>
          <li style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Account Details:</span> Random text
            about account details.
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>Help Resources:</span> Random text
            about help resources.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GeneralInfoBox;
