import React from "react";

interface DropdownsProps {
  patients: string[];
  drugs: string[];
  selectedPatientId: string;
  selectedDrug: string;
  onPatientChange: (id: string) => void;
  onDrugChange: (drug: string) => void;
  currentDate: string;
}

const Dropdowns: React.FC<DropdownsProps> = ({
  patients,
  drugs,
  selectedPatientId,
  selectedDrug,
  onPatientChange,
  onDrugChange,
  currentDate,
}) => {
  return (
    <div className="d-flex align-items-center gap-3">
      {/* Select Patient Dropdown */}
      <div>
        <select
          id="patient-id"
          className="form-select"
          value={selectedPatientId}
          onChange={(e) => onPatientChange(e.target.value)}
        >
          <option value="">Select Patient</option>
          {patients.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>

      {/* Select Drug Dropdown */}
      <div>
        <select
          id="drug"
          className="form-select"
          value={selectedDrug}
          onChange={(e) => onDrugChange(e.target.value)}
          disabled={!selectedPatientId} // Disable if no patient is selected
        >
          <option value="">Select Drug</option>
          {drugs.map((drug) => (
            <option key={drug} value={drug}>
              {drug}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div className="text-muted" style={{ fontSize: "0.9rem" }}>
        Data refreshed on: <strong>{currentDate}</strong>
      </div>
    </div>
  );
};

export default Dropdowns;
