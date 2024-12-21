import React from "react";

const Title: React.FC = () => {
  return (
    <div
      className="d-flex align-items-center flex-shrink-1"
      style={{
        whiteSpace: "nowrap", // Prevent line breaks
        marginRight: "20px", // Add spacing between title and dropdowns
      }}
    >
      <h1
        className="mb-0"
        style={{
          fontSize: "18px", // Reduced font size
          fontFamily: "sans-serif",
          color: "#c50005",
          fontWeight: "bold",
        }}
      >
        DialSmart{" "}
        <span
          className="text-muted"
          style={{ color: "gray", fontWeight: "bold" }}
        >
          | Know Before You Call
        </span>
      </h1>
    </div>
  );
};

export default Title;
