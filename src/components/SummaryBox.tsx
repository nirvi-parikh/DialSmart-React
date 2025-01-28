import React from "react";

interface SummaryBoxProps {
  notesSummary: {
    SignificantDetails?: string[];
    RxInfo?: string[];
    PrescriptionBenefitVerificationInfo?: string[];
    BillingInvoice?: string[];
    GeneralUpdates?: string[];
    Communication?: {
      Calls?: string[];
      RefillReminders?: string[];
      SystemCommunications?: string[];
    };
  };
}

const SummaryBox: React.FC<SummaryBoxProps> = ({ notesSummary }) => {
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
              {notesSummary.SignificantDetails?.join(", ") || "N/A"}
            </div>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Rx info:</span>
            <div style={{ fontWeight: "normal", marginTop: "5px" }}>
              {notesSummary.RxInfo?.join(", ") || "N/A"}
            </div>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>
              Prescription Benefit Verification (BV) info:
            </span>
            <div style={{ fontWeight: "normal", marginTop: "5px" }}>
              {notesSummary.PrescriptionBenefitVerificationInfo?.join(", ") || "N/A"}
            </div>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Billing/Invoice:</span>
            <div style={{ fontWeight: "normal", marginTop: "5px" }}>
              {notesSummary.BillingInvoice?.join(", ") || "N/A"}
            </div>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Communication Summary:</span>
            <ul style={{ listStyleType: "circle", paddingLeft: "20px", marginTop: "5px" }}>
              <li style={{ marginBottom: "5px" }}>
                <strong>Call:</strong> {notesSummary.Communication?.Calls?.join(", ") || "N/A"}
              </li>
              <li style={{ marginBottom: "5px" }}>
                <strong>Refill Reminders:</strong>{" "}
                {notesSummary.Communication?.RefillReminders?.join(", ") || "N/A"}
              </li>
              <li>
                <strong>System Communication:</strong>{" "}
                {notesSummary.Communication?.SystemCommunications?.join(", ") || "N/A"}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SummaryBox;
