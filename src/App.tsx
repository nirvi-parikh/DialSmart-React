import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Title from "./components/Title";
import Dropdowns from "./components/Dropdowns";
import PatientInfo from "./components/PatientInfo";
import Papa from "papaparse";
import favicon from "./cvs_favicon.ico";

interface PatientData {
  name: string;
  id: string;
  drug: string;
  rxFillsRemaining: string;
  expectedSupplyInHand: string;
  newRxStatus: string;
  paymentMethod: string;
  alternatePhoneNo: string;
  currentDNF: string;
}

const App: React.FC = () => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedDrug, setSelectedDrug] = useState<string>("");
  const [currentPatientInfo, setCurrentPatientInfo] = useState<PatientData | null>(null);

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
    const fetchPatientData = async () => {
      try {
        const response = await fetch(
          "https://storage.googleapis.com/<your-bucket-name>/patient-data.csv"
        );
        if (!response.ok) throw new Error("Failed to fetch patient data");

        const csvData = await response.text();
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setPatients(result.data as PatientData[]);
          },
          error: (err) => {
            console.error("Error parsing CSV:", err);
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientData();
  }, []);

  useEffect(() => {
    if (selectedPatientId && selectedDrug) {
      const patientInfo = patients.find(
        (patient) => patient.id === selectedPatientId && patient.drug === selectedDrug
      );
      setCurrentPatientInfo(patientInfo || null);
    }
  }, [selectedPatientId, selectedDrug, patients]);

  const handlePatientChange = (id: string) => {
    setSelectedPatientId(id);
    setSelectedDrug(""); // Reset drug when patient changes
  };

  const handleDrugChange = (drug: string) => {
    setSelectedDrug(drug);
  };

  const uniquePatients = Array.from(new Set(patients.map((p) => p.id)));
  const drugsForSelectedPatient = patients
    .filter((p) => p.id === selectedPatientId)
    .map((p) => p.drug);

  return (
    <div>
      <Header />
      <main className="container">
        {/* Title and Dropdowns Row */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <Title />
          <Dropdowns
            patients={uniquePatients}
            drugs={drugsForSelectedPatient}
            selectedPatientId={selectedPatientId}
            selectedDrug={selectedDrug}
            onPatientChange={handlePatientChange}
            onDrugChange={handleDrugChange}
            currentDate={currentDate}
          />
        </div>

        {/* Patient Info Section */}
        <div style={{ marginTop: "30px" }}>
          <PatientInfo patient={currentPatientInfo} />
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
          The content on this website has been collected by an Artificial Intelligence (AI)
          Model. While we strive for accuracy, the information may not always be
          comprehensive or up-to-date. Please consult a professional or authorized source
          for detailed and verified data. This website is provided for informational
          purposes only and does not constitute medical or legal advice.
        </p>
      </footer>
    </div>
  );
};

export default App;
