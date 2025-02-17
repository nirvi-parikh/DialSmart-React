import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Generate unique feedback_id
import SummaryBox from "./SummaryBox";
import RefillsLeftBox from "./RefillsLeftBox";

const App: React.FC = () => {
  // Mock data for patient and drug selection
  const selectedPatientId = "P123";
  const selectedDrugId = "D456";

  // Mock summaryData JSON containing df_notes
  const summaryData = {
    df_notes: [
      { spclt_ptnt_gid: "SPG456", notes_text: "First note" },
      { spclt_ptnt_gid: "SPG456", notes_text: "Second note" },
    ],
    notes_summary: "Progress is good overall.",
    data_insights: "Further dosage might be required.",
  };

  // ✅ Extract spclt_ptnt_gid from df_notes (First available value)
  const spcltPtntGid = summaryData.df_notes?.[0]?.spclt_ptnt_gid || null;

  // ✅ Concatenate all values from `notes_text` column
  const concatenatedNotesText = summaryData.df_notes
    ?.map((row) => row.notes_text)
    ?.filter(Boolean)
    .join(", ") || null;

  // ✅ State for Keeping Feedback ID (It remains the same for both Summary & Refill submissions)
  const [feedbackId, setFeedbackId] = useState<string | null>(null);

  // 🚀 **State for Summary Feedback**
  const [summaryFeedback, setSummaryFeedback] = useState("");
  const [summaryLike, setSummaryLike] = useState<boolean | null>(null);
  const [summarySubmitted, setSummarySubmitted] = useState(false);

  // 🚀 **State for Refill Feedback**
  const [refillFeedback, setRefillFeedback] = useState("");
  const [refillLike, setRefillLike] = useState<boolean | null>(null);
  const [refillSubmitted, setRefillSubmitted] = useState(false);

  // ✅ **Single Function for Like/Dislike (Handles Both Summary & Refill)**
  const handleThumbClick = (feedbackType: "summary" | "refill", type: "up" | "down") => {
    if (feedbackType === "summary") {
      setSummaryLike(type === "up");
    } else {
      setRefillLike(type === "up");
    }
  };

  // 🛠️ **Submit Feedback (Handles Both Summary & Refill)**
  const handleSubmitFeedback = async (feedbackType: "summary" | "refill") => {
    const id = feedbackId || uuidv4(); // Generate new `feedback_id` if not set

    const isSummary = feedbackType === "summary";
    const isRefill = feedbackType === "refill";

    const payload = {
      feedback_id: id,
      patient_id: selectedPatientId,
      spclt_ptnt_gid: spcltPtntGid,
      drug: selectedDrugId,
      notes_text: concatenatedNotesText,
      notes_summary: summaryData.notes_summary,
      data_insights: summaryData.data_insights,
      notes_feedback_txt: isSummary ? summaryFeedback || null : null,
      notes_insights_txt: isRefill ? refillFeedback || null : null,
      notes_like: isSummary ? summaryLike ?? null : null,
      data_insights_like: isRefill ? refillLike ?? null : null,
      data_update_ts: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:8000/insert-feedback", payload);
      alert(`${feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)} Feedback submitted!`);
      setFeedbackId(id);

      if (isSummary) {
        setSummarySubmitted(true);
      } else {
        setRefillSubmitted(true);
      }

      // ✅ Reset everything only after both feedbacks are submitted
      if (summarySubmitted && refillSubmitted) {
        setFeedbackId(null);
        setSummarySubmitted(false);
        setRefillSubmitted(false);
      }
    } catch (error) {
      console.error(`Error submitting ${feedbackType} feedback:`, error);
      alert(`Failed to submit ${feedbackType} feedback.`);
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <div className="d-flex gap-3">
        {/* Summary Feedback Section */}
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
              <button
                className={`btn ${summaryLike === true ? "btn-success" : "btn-outline-success"}`}
                onClick={() => handleThumbClick("summary", "up")}
              >
                👍
              </button>
              <button
                className={`btn ${summaryLike === false ? "btn-danger" : "btn-outline-danger"}`}
                onClick={() => handleThumbClick("summary", "down")}
              >
                👎
              </button>
            </div>
            <button
              className="btn btn-danger mt-2"
              onClick={() => handleSubmitFeedback("summary")}
            >
              Submit Summary Feedback
            </button>
          </div>
        </div>

        {/* Refill Feedback Section */}
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
              <button
                className={`btn ${refillLike === true ? "btn-success" : "btn-outline-success"}`}
                onClick={() => handleThumbClick("refill", "up")}
              >
                👍
              </button>
              <button
                className={`btn ${refillLike === false ? "btn-danger" : "btn-outline-danger"}`}
                onClick={() => handleThumbClick("refill", "down")}
              >
                👎
              </button>
            </div>
            <button
              className="btn btn-danger mt-2"
              onClick={() => handleSubmitFeedback("refill")}
            >
              Submit Refill Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
