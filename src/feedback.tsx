import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; 
import SummaryBox from "./SummaryBox";
import RefillsLeftBox from "./RefillsLeftBox";

const App: React.FC = () => {
  // ✅ Mock Data
  const selectedPatientId = "P123";
  const selectedDrugId = "D456";

  const summaryData = {
    df_notes: [
      { spclt_ptnt_gid: "SPG456", notes_text: "First note" },
      { spclt_ptnt_gid: "SPG456", notes_text: "Second note" },
    ],
    notes_summary: "Progress is good overall.",
    insights_summary: {
      "Refills Status": {
        "Refills Left": "Yes, there are refills remaining for some medications.",
        "Specific Medications": "MENOPUR: 1 refill, FOLLISTIM AQ: 0 refills, ADALIMUMAB-ADAZ: 0 refills, HUMIRA PEN: 1 refill"
      }
    },
  };

  // ✅ Extract spclt_ptnt_gid
  const spcltPtntGid = summaryData.df_notes?.[0]?.spclt_ptnt_gid || null;
  
  // ✅ Format notes_txt
  const notesTxt = summaryData.df_notes?.map(row => row.notes_text)?.filter(text => text?.trim()).join(", ") || null;

  // ✅ State
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [summaryFeedback, setSummaryFeedback] = useState("");
  const [summaryLike, setSummaryLike] = useState<boolean | null>(null);
  const [refillFeedback, setRefillFeedback] = useState("");
  const [refillLike, setRefillLike] = useState<boolean | null>(null);

  // ✅ Function to Generate Payload
  const generatePayload = (feedbackType: "summary" | "refill", likeType?: "up" | "down") => {
    const id = feedbackId || uuidv4(); // Generate or reuse feedback_id

    const isSummary = feedbackType === "summary";
    const isRefill = feedbackType === "refill";

    return {
      feedback_id: id,
      patient_id: selectedPatientId,
      spclt_ptnt_gid: spcltPtntGid,
      drug: selectedDrugId,
      notes_txt: notesTxt,
      notes_summary: summaryData.notes_summary,
      data_insights: JSON.stringify(summaryData.insights_summary),
      notes_feedback_txt: isSummary ? summaryFeedback?.trim() || null : null,
      notes_insights_txt: isRefill ? refillFeedback?.trim() || null : null,
      notes_like: isSummary ? (likeType ? (likeType === "up" ? "true" : "false") : summaryLike?.toString()) : null,
      data_insights_like: isRefill ? (likeType ? (likeType === "up" ? "true" : "false") : refillLike?.toString()) : null,
      data_update_ts: new Date().toISOString(),
    };
  };

  // ✅ Function to Send API Request
  const sendFeedbackToBackend = async (payload: any) => {
    console.log("Sending Payload:", JSON.stringify(payload, null, 2));
    try {
      await axios.post("http://localhost:8000/insert-feedback", payload);
      setFeedbackId(payload.feedback_id);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  // ✅ Handle Thumbs Click
  const handleThumbClick = (feedbackType: "summary" | "refill", type: "up" | "down") => {
    if (feedbackType === "summary") setSummaryLike(type === "up");
    else setRefillLike(type === "up");

    alert(`${type === "up" ? "Thumbs Up 👍" : "Thumbs Down 👎"} recorded for ${feedbackType === "summary" ? "Summary" : "Refill"} Feedback.`);

    const payload = generatePayload(feedbackType, type);
    sendFeedbackToBackend(payload);
  };

  // ✅ Handle Feedback Submission (Added Your Snippet)
  const handleSubmitFeedback = async (feedbackType: "summary" | "refill") => {
    const id = feedbackId || uuidv4(); // Generate new `feedback_id` if not set

    const isSummary = feedbackType === "summary";
    const isRefill = feedbackType === "refill";

    const payload = generatePayload(feedbackType);
    sendFeedbackToBackend(payload);

    if (isSummary) setSummaryFeedback("");
    if (isRefill) setRefillFeedback("");
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <div className="d-flex gap-3">
        {/* ✅ Summary Feedback Section */}
        <div style={{ flex: 1 }}>
          <SummaryBox />
          <div style={{ marginTop: "20px" }}>
            <h5>Summary Feedback</h5>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Enter feedback for the summary..."
              value={summaryFeedback}
              onChange={(e) => setSummaryFeedback(e.target.value)}
            />
            <div className="d-flex align-items-center gap-3 mt-2">
              <button className={`btn ${summaryLike === true ? "btn-success" : "btn-outline-success"}`} onClick={() => handleThumbClick("summary", "up")}>👍</button>
              <button className={`btn ${summaryLike === false ? "btn-danger" : "btn-outline-danger"}`} onClick={() => handleThumbClick("summary", "down")}>👎</button>
            </div>
            <button className="btn btn-danger mt-2" onClick={() => handleSubmitFeedback("summary")}>Submit Summary Feedback</button>
          </div>
        </div>

        {/* ✅ Refill Feedback Section */}
        <div style={{ flex: 1 }}>
          <RefillsLeftBox />
          <div style={{ marginTop: "20px" }}>
            <h5>Refill Feedback</h5>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Enter feedback for the refills left..."
              value={refillFeedback}
              onChange={(e) => setRefillFeedback(e.target.value)}
            />
            <div className="d-flex align-items-center gap-3 mt-2">
              <button className={`btn ${refillLike === true ? "btn-success" : "btn-outline-success"}`} onClick={() => handleThumbClick("refill", "up")}>👍</button>
              <button className={`btn ${refillLike === false ? "btn-danger" : "btn-outline-danger"}`} onClick={() => handleThumbClick("refill", "down")}>👎</button>
            </div>
            <button className="btn btn-danger mt-2" onClick={() => handleSubmitFeedback("refill")}>Submit Refill Feedback</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
