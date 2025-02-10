import React from "react";

interface DataInsightsProps {
  data: { [section: string]: { [key: string]: string } };
  children?: React.ReactNode;
}

const DataInsightsBox: React.FC<DataInsightsProps> = ({ data, children }) => {
  return (
    <div>
      {/* Data Insights Heading */}
      <h4 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>
        Data Insights{" "}
        <span style={{ fontSize: "14px", fontWeight: "normal", color: "gray" }}>
          (Under Construction)
        </span>
      </h4>

      {/* Data Insights Box */}
      <div
        className="p-3"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        <ul style={{ paddingLeft: "20px", marginBottom: "0" }}>
          {Object.entries(data).map(([sectionTitle, sectionItems]) => (
            <li style={{ marginBottom: "10px" }} key={sectionTitle}>
              <span style={{ fontWeight: "bold" }}>{sectionTitle}:</span>
              <div style={{ fontWeight: "normal", marginTop: "5px" }}>
                <ul
                  style={{
                    listStyleType: "circle",
                    paddingLeft: "20px",
                    marginTop: "5px"
                  }}
                >
                  {Object.entries(sectionItems).map(([itemKey, itemValue]) => (
                    <li style={{ marginBottom: "5px" }} key={itemKey}>
                      <strong>{itemKey}:</strong> {itemValue}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        {/* Children for feedback */}
        <div style={{ marginTop: "20px" }}>{children}</div>
      </div>
    </div>
  );
};

export default DataInsightsBox;
