import React from "react";

interface SummaryBoxProps {
  notesSummary: {
    "Significant Details"?: any;
    "Rx Info"?: any;
    "Prescription Benefit Verification (BV) Info"?: any;
    "Billing/Invoice"?: any;
    "General Updates"?: any;
    Communication?: any;
    [key: string]: any;
  };
  children?: React.ReactNode;
}

const SummaryBox: React.FC<SummaryBoxProps> = ({ notesSummary, children }) => {
  // Mapping to customize display labels
  const labelMapping: { [key: string]: string } = {
    "Significant Details": "Significant Details",
    "Rx Info": "Rx Info",
    "Prescription Benefit Verification (BV) Info": "Prescription Benefit Verification (BV) Info",
    "Billing/Invoice": "Billing/Invoice",
    "General Updates": "General Updates",
    Communication: "Communication Summary",
    Calls: "Call",
    "Refill Reminders": "Refill Reminders",
    "System Communications": "System Communication",
  };

  const getLabel = (key: string) => labelMapping[key] || key;

  // Enhanced recursive rendering function
  const renderContent = (value: any): React.ReactNode => {
    if (Array.isArray(value)) {
      if (value.length === 0) return "N/A";
      // If the first item is an object, assume all items are objects and render them accordingly
      if (typeof value[0] === "object" && value[0] !== null) {
        return (
          <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "5px" }}>
            {value.map((item, index) => (
              <li key={index}>
                {Object.entries(item).map(([key, val]) => (
                  <div key={key}>
                    <strong>{getLabel(key)}:</strong> {val}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        );
      }
      // Otherwise, join primitive array items with commas
      return value.join(", ");
    }
    if (value && typeof value === "object") {
      return (
        <ul style={{ listStyleType: "circle", paddingLeft: "20px", marginTop: "5px" }}>
          {Object.entries(value).map(([subKey, subValue]) => (
            <li key={subKey} style={{ marginBottom: "5px" }}>
              <strong>{getLabel(subKey)}:</strong> {renderContent(subValue)}
            </li>
          ))}
        </ul>
      );
    }
    return value ? String(value) : "N/A";
  };

  return (
    <div>
      {/* Summary Heading */}
      <h4 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>
        Notes Summary{" "}
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
          {Object.entries(notesSummary).map(([key, value]) => (
            <li key={key} style={{ marginBottom: "10px" }}>
              <span style={{ fontWeight: "bold" }}>{getLabel(key)}:</span>
              <div style={{ fontWeight: "normal", marginTop: "5px" }}>
                {renderContent(value)}
              </div>
            </li>
          ))}
        </ul>
        {/* Children for additional feedback */}
        <div style={{ marginTop: "20px" }}>{children}</div>
      </div>
    </div>
  );
};

export default SummaryBox;
