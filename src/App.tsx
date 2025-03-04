import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Title from "./components/Title";
import Dropdowns from "./components/Dropdowns";
import PatientInfo from "./components/PatientInfo";
import SummaryBox from "./components/SummaryBox";
import RefillsLeftBox from "./components/RefillsLeftBox";
import favicon from "./cvs_favicon.ico";

const App: React.FC = () => {
  const [patientInfo, setPatientInfo] = useState<any | null>(null);
  const [selectPatientIds, setSelectPatientIds] = useState<string[]>([]);
  const [selectDrugIds, setSelectDrugIds] = useState<string[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedDrug, setSelectedDrug] = useState<string>("");
  const [patientData, setPatientData] = useState<any | null>(null);
  const [summaryFeedback, setSummaryFeedback] = useState<string>("");
  const [refillFeedback, setRefillFeedback] = useState<string>("");
  const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
  const currentDate = new Date().toLocaleDateString();
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    document.title = "CVS DialSmart";

    const faviconLink = document.createElement("link");
    faviconLink.rel = "icon";
    faviconLink.href = favicon;
    document.head.appendChild(faviconLink);

    return () => {
      document.head.removeChild(faviconLink);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingPatient(true); // Start loading for patient data
      try {
        console.log("Fetching patient data from API...");
        const response = await axios.get(
          "https://spcltopz-dialsmart-api.pss-dev.aig.aetna.com/patient-profile",
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log("API Response:", response.data);
        setPatientData(response.data);
      } catch (error: any) {
        console.error("Error fetching patient data:", error.message || error);
        alert("Failed to fetch patient data.");
      } finally {
        setLoadingPatient(false); // Stop loading
      }
    };

    fetchData(); // Call only once on mount
  }, []);

  const fetchSummary = async (patientId: string) => {
    if (!patientId) return;

    setLoadingSummary(true); // Start loading for summary
    try {
      console.log("Fetching summary from API for selected patient id...");
      const response = await axios.get(
        `https://spcltopz-dialsmart-api.pss-dev.aig.aetna.com/notes-insights-summary?patient_id=${patientId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Summary API Response:", response.data);
      setSummaryData(response.data);
    } catch (error: any) {
      console.error("Error fetching summary data:", error.message || error);
      alert("Failed to fetch summary data for the patient.");
    } finally {
      setLoadingSummary(false); // Stop loading
    }
  };

  const toggleTable = () => {
    setIsTableVisible((prev) => !prev);
  };

  const handleSearch = async () => {
    if (!selectedPatientId || !selectedDrug) {
      alert("Please select both Patient ID and Drug.");
      return;
    }

    // Get patient info mapping
    const patientKey = `(${selectedPatientId},${selectedDrug})`; // Key format from API response
    const selectedInfo = patientData?.patient_info?.[patientKey] || null;

    if (!selectedInfo) {
      alert("No data found for the selected Patient ID and Drug.");
      return;
    }

    // Update state and fetch summary
    setPatientInfo(selectedInfo);
    fetchSummary(selectedPatientId);

    // Generate a unique session_id using uuid
    const sessionId = uuidv4();

    // Prepare data payload for insertion
    const payload = {
      psr_id: null,
      psr_name: null,
      patient_id: selectedPatientId,
      drug: selectedDrug,
      session_id: sessionId,
      comment: null,
      data_update_ts: new Date().toISOString(), // Current timestamp in ISO format
    };

    // Insert data into Spanner table using Axios
    try {
      const response = await axios.post(
        "https://spcltopz-dialsmart-api.pss-dev.aig.aetna.com/audit_log",
        payload
      );
      console.log("Data inserted successfully:", response.data);
    } catch (error) {
      console.error("Error inserting data:", error);
      alert("Failed to insert data into the Spanner table.");
    }
  };

  // 🚀 **State for Summary Feedback**
  const [summaryFeedback, setSummaryFeedback] = useState("");
  const [summaryLike, setSummaryLike] = useState<boolean | null>(null);

  // 🚀 **State for Refill Feedback**
  const [refillFeedback, setRefillFeedback] = useState("");
  const [refillLike, setRefillLike] = useState<boolean | null>(null);

   // ✅ **Single Function for Like/Dislike (Handles Both Summary & Refill)**
  const handleThumbClick = (feedbackType: "summary" | "refill", type: "up" | "down") => {
    if (feedbackType === "summary") {
      setSummaryLike(type === "up");
    } else {
      setRefillLike(type === "up");
    }
  };

  // 🛠️ **Submit Feedback**
  const handleSubmitFeedback = async () => {
    const feedbackId = uuidv4(); // Generate unique feedback_id

    const payload = {
      feedback_id: feedbackId,
      patient_id: selectedPatientId,
      spclt_ptnt_gid: summaryData.patient_info.gid,
      drug: selectedDrugId,
      notes_text: summaryData.notes_text,
      notes_summary: summaryData.notes_summary,
      data_insights: summaryData.data_insights,
      notes_feedback_txt: summaryFeedback || null,
      notes_insights_txt: refillFeedback || null,
      notes_like: summaryLike ?? null,
      data_insights_like: refillLike ?? null,
      data_update_ts: new Date().toISOString(),
    };

    try {
      const response = await axios.post("http://localhost:8000/insert-feedback", payload);
      alert("Feedback submitted successfully!");
      console.log("Response:", response.data);

      // Reset Fields after successful submission
      setSummaryFeedback("");
      setSummaryLike(null);
      setRefillFeedback("");
      setRefillLike(null);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  const toggleTable = () => {
    setIsTableVisible(!isTableVisible);
  };

  const handleSummaryFeedbackSubmit = () => {
    if (summaryFeedback.trim() !== "") {
      alert(`Summary Feedback submitted: ${summaryFeedback}`);
      setSummaryFeedback("");
    }
  };

  const handleRefillFeedbackSubmit = () => {
    if (refillFeedback.trim() !== "") {
      alert(`Refill Feedback submitted: ${refillFeedback}`);
      setRefillFeedback("");
    }
  };

  const handleThumbFeedback = (type: "up" | "down", context: string) => {
    alert(`Thumbs ${type === "up" ? "Up" : "Down"} submitted for ${context}`);
  };

  return (
      <div>
        <Header />
        <main className="container">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <Title />
            <Dropdowns
              patientIds={selectPatientIds}
              drugs={{}}
              selectedPatientId={selectedPatientId}
              setSelectedPatientId={setSelectedPatientId}
              selectedDrug={selectedDrug}
              setSelectedDrug={setSelectedDrug}
              onSearch={handleSearch}
            />
          </div>
    
          {/* Show Patient Info with Loading */}
          <div className="mb-4">
            {loadingPatient ? (
              <div className="d-flex align-items-center justify-content-center">
                <span className="spinner-border text-primary" role="status"></span>
                <span className="ms-2">Loading patient info...</span>
              </div>
            ) : (
              <PatientInfo patient={patientInfo} />
            )}
          </div>
    
          <div style={{ marginTop: "30px" }}>
            <div className="d-flex gap-3">
              <div style={{ flex: 1 }}>
                {/* Show Summary Box with Loading */}
                {loadingSummary ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <span className="spinner-border text-secondary" role="status"></span>
                    <span className="ms-2">Loading summary...</span>
                  </div>
                ) : (
                  <SummaryBox summaryData={summaryData} />
                )}
    
                <div style={{ marginTop: "20px" }}>
                  <h5>Summary Feedback</h5>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter feedback for the summary box..."
                    value={summaryFeedback}
                    onChange={(e) => setSummaryFeedback(e.target.value)}
                  />
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <button
                      className="btn btn-outline-success"
                      onClick={() => handleThumbFeedback("up", "SummaryBox")}
                    >
                      👍
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleThumbFeedback("down", "SummaryBox")}
                    >
                      👎
                    </button>
                  </div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleSummaryFeedbackSubmit}
                    disabled={summaryFeedback.trim() === ""}
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
    
              <div style={{ flex: 1 }}>
                {/* Show Refills Left Box with Loading */}
                {loadingSummary ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <span className="spinner-border text-warning" role="status"></span>
                    <span className="ms-2">Loading refills...</span>
                  </div>
                ) : (
                  <RefillsLeftBox summaryData={summaryData} />
                )}
    
                <div style={{ marginTop: "20px" }}>
                  <h5>Refill Feedback</h5>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter feedback for the refills left box..."
                    value={refillFeedback}
                    onChange={(e) => setRefillFeedback(e.target.value)}
                  />
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <button
                      className="btn btn-outline-success"
                      onClick={() => handleThumbFeedback("up", "RefillsLeftBox")}
                    >
                      👍
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleThumbFeedback("down", "RefillsLeftBox")}
                    >
                      👎
                    </button>
                  </div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleRefillFeedbackSubmit}
                    disabled={refillFeedback.trim() === ""}
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>    

         <div style={{ marginTop: "30px" }}>
      {/* Expand/Collapse Button */}
      <div
        onClick={toggleTable}
        style={{
          cursor: "pointer",
          backgroundColor: "#f8f9fa",
          color: "#333",
          padding: "10px 15px",
          borderRadius: "5px",
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #ccc",
          fontWeight: "bold",
        }}
      >
        <span>📋 Patient Notes</span>
        <span>{isTableVisible ? "▲" : "▼"}</span>
      </div>

      {/* Expandable Table */}
      {isTableVisible && (
        <div
          className="card card-body"
          style={{
            maxHeight: "200px", // Adjust the height as needed
            overflowY: "auto", // Enables scrolling when content overflows
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <table className="table table-bordered">
            <thead>
              <tr style={{ backgroundColor: "#f1f1f1" }}>
                <th>Patient ID</th>
                <th>Drug</th>
                <th>Refills Remaining</th>
                <th>Last Interaction</th>
              </tr>
            </thead>
            <tbody>
              {patientInfo?.map((item) => (
                <tr key={`${item.patient_id}-${item.drug}`}>
                  <td>{item.patient_id}</td>
                  <td>{item.drug}</td>
                  <td>{item.rx_fills_remaining || "N/A"}</td>
                  <td>{item.last_interaction || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
      </main>

      <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#666" }}>
  Enjoying the "DialSmart" app? If you spot any bugs, need a hand, or have any ideas to make it better, we're all ears. <a href="YOUR_FORM_LINK_HERE">Form link</a>
</div>

      <footer
        style={{
          marginTop: "50px",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderTop: "1px solid #ccc",
          textAlign: "center",
          fontSize: "14px",
          color: "#666",
        }}
      >
        <p>
          The content on this website has been collected by an Artificial
          Intelligence (AI) Model. While we strive for accuracy, the information
          may not always be comprehensive or up-to-date. Please consult a
          professional or authorized source for detailed and verified data. This
          website is provided for informational purposes only and does not
          constitute medical or legal advice.
        </p>
      </footer>
    </div>
  );
};

export default App;
