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
  const currentDate = new Date().toLocaleDateString();

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
      try {
        console.log("Fetching data from API...");
        const response = await axios.get("http://127.0.0.1:5173/data", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("API Response:", response.data);
        setPatientData(response.data);
      } catch (error: any) {
        console.error("Error fetching data:", error.message || error);
        alert("Failed to fetch patient data.");
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    if (!selectedPatientId || !selectedDrug) {
      alert("Please select both Patient ID and Drug.");
      return;
    }

    const patientKey = `('${selectedPatientId}', '${selectedDrug}')`;
    const selectedInfo = patientData?.patient_info?.[patientKey] || null;

    if (!selectedInfo) {
      alert("No data found for the selected Patient ID and Drug.");
      return;
    }

    setPatientInfo(selectedInfo);
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
            currentDate={currentDate}
          />
        </div>

        <div className="mb-4">
          <PatientInfo patient={patientInfo} />
        </div>

        <div style={{ marginTop: "30px" }}>
          <div className="d-flex gap-3">
            <div style={{ flex: 1 }}>
              <SummaryBox />
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
              <div style={{ marginTop: "20px" }}>
                <RefillsLeftBox />
              </div>
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
      </main>

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
