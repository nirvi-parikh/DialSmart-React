import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Title from "./components/Title";
import Dropdowns from "./components/Dropdowns";
import PatientInfo from "./components/PatientInfo";
import SummaryBox from "./components/SummaryBox";
import GeneralInfoBox from "./components/GeneralInfoBox";
import CommunicationBox from "./components/CommunicationBox";
import PatientAdherenceBox from "./components/PatientAdherenceBox";
import RefillsLeftBox from "./components/RefillsLeftBox";
import DigitalRegistrationBox from "./components/DigitalRegistrationBox";
import DataInsightsBox from "./components/DataInsightsBox";
import favicon from "./cvs_favicon.ico";

const App: React.FC = () => {
  const [patientInfo, setPatientInfo] = useState<any[]>([]); // Stores the top 10 patient records
  const [selectPatientIds, setSelectPatientIds] = useState<string[]>([]); // Top 10 patient IDs
  const [selectDrugIds, setSelectDrugIds] = useState<string[]>([]); // Top 10 drug IDs
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedDrug, setSelectedDrug] = useState<string>("");
  const [patientData, setPatientData] = useState<any | null>(null); // Cached API response
  const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
  const [comments, setComments] = useState<string>(""); // Comments state
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

  // Fetch data once on initial load
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
        setPatientData(response.data); // Cache the entire response
      } catch (error: any) {
        console.error("Error fetching data:", error.message || error);
        alert("Failed to fetch patient data.");
      }
    };

    fetchData(); // Call only once on mount
  }, []);


  const handleSearch = () => {
    if (!selectedPatientId || !selectedDrug) {
      alert("Please select both Patient ID and Drug.");
      return;
    }

    // Get patient info mapping
    const patientKey = `('${selectedPatientId}', '${selectedDrug}')`; // Key format from API response
    const selectedInfo = patientData?.patient_info?.[patientKey] || null;

    if (!selectedInfo) {
      alert("No data found for the selected Patient ID and Drug.");
      return;
    }

    setPatientInfo(selectedInfo);
  };
  
  const toggleTable = () => {
    setIsTableVisible(!isTableVisible);
  };

  const handleFeedback = (type: "up" | "down") => {
    alert(`Feedback submitted: ${type === "up" ? "Thumbs Up" : "Thumbs Down"}`);
  };

  const handleFeedbackSubmit = () => {
    if (comments.trim() !== "") {
      alert(`Comments submitted: ${comments}`);
      setComments("");
    }
  };

  return (
    <div>
      <Header />
      <main className="container">
        {/* Title and Dropdowns Row */}
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

        {/* Main Content Section */}
        <div style={{ marginTop: "30px" }}>
          <div className="d-flex gap-3">
            {/* First Column */}
            <div style={{ flex: "0 0 250px", maxWidth: "250px" }}>
              <PatientInfo
                selectedPatientId={selectedPatientId}
                selectedDrug={selectedDrug}
              />
            </div>

            {/* Second Column */}
            <div style={{ flex: 1 }}>
              <SummaryBox />
              <div style={{ marginTop: "20px" }}>
                <CommunicationBox />
              </div>
              <div style={{ marginTop: "20px" }}>
                <GeneralInfoBox />
              </div>
            </div>

            {/* Third Column */}
            <div style={{ flex: 1 }}>
              <PatientAdherenceBox />
              <div style={{ marginTop: "20px" }}>
                <RefillsLeftBox />
              </div>
              <div style={{ marginTop: "20px" }}>
                <DigitalRegistrationBox />
              </div>
              <div style={{ marginTop: "20px" }}>
                <DataInsightsBox />
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Table Section */}
        <div style={{ marginTop: "30px" }}>
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
            <span>📋 Patient Details</span>
            <span>{isTableVisible ? "▲" : "▼"}</span>
          </div>

          {isTableVisible && (
            <div className="card card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Drug</th>
                    <th>Refills Remaining</th>
                    <th>Last Interaction</th>
                    <th>Adherence Score</th>
                  </tr>
                </thead>
                <tbody>
                  {patientInfo.map((item) => (
                    <tr key={`${item.patient_id}-${item.drug}`}>
                      <td>{item.patient_id}</td>
                      <td>{item.drug}</td>
                      <td>{item.rx_fills_remaining || "N/A"}</td>
                      <td>{item.last_interaction || "N/A"}</td>
                      <td>{item.adherence_score || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Feedback Section */}
        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h5 style={{ marginBottom: "15px" }}>We Value Your Feedback</h5>
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-success"
              onClick={() => handleFeedback("up")}
            >
              👍
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => handleFeedback("down")}
            >
              👎
            </button>
          </div>
          <div className="mt-3">
            <textarea
              className="form-control"
              rows={3}
              placeholder="Enter your comments here..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
          <button
            className="btn"
            style={{
              backgroundColor: "#c50005",
              color: "white",
              marginTop: "15px",
            }}
            onClick={handleFeedbackSubmit}
            disabled={comments.trim() === ""}
          >
            Submit
          </button>
        </div>
      </main>

      {/* Disclaimer Section */}
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
