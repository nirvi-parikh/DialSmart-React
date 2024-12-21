import React from "react";
import Select from "react-select";

interface DropdownsProps {
  patientIds: string[];
  drugs: { [patientId: string]: string[] };
  selectedPatientId: string;
  setSelectedPatientId: (value: string) => void;
  selectedDrug: string;
  setSelectedDrug: (value: string) => void;
  onSearch: () => void;
  currentDate: string;
}

const Dropdowns: React.FC<DropdownsProps> = ({
  patientIds,
  drugs,
  selectedPatientId,
  setSelectedPatientId,
  selectedDrug,
  setSelectedDrug,
  onSearch,
  currentDate,
}) => {
  const availableDrugs = drugs[selectedPatientId] || [];

  // Convert patient IDs to options for react-select
  const patientOptions = patientIds.map((id) => ({
    value: id,
    label: id,
  }));

  // Common style for dropdowns
  const dropdownStyle = {
    width: "240px", // Same width for both dropdowns
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3">
        {/* Select Patient Dropdown with Searchable Feature */}
        <div style={dropdownStyle}>
          <Select
            options={patientOptions}
            placeholder="Select Patient"
            value={patientOptions.find((option) => option.value === selectedPatientId)}
            onChange={(selectedOption) => {
              setSelectedPatientId(selectedOption?.value || "");
              setSelectedDrug(""); // Reset drug selection when patient changes
            }}
            isClearable
            styles={{
              placeholder: (base) => ({
                ...base,
                fontSize: "14px", // Consistent font size
                whiteSpace: "nowrap", // Prevent wrapping
              }),
              control: (base) => ({
                ...base,
                minHeight: "36px", // Align with the Select Drug dropdown
                fontSize: "14px",
              }),
            }}
          />
        </div>

        {/* Select Drug Dropdown */}
        <div style={dropdownStyle}>
          <select
            id="drug"
            className="form-select"
            style={{
              fontSize: "14px",
              height: "36px",
              lineHeight: "1.5",
              padding: "4px 12px",
            }}
            value={selectedDrug}
            onChange={(e) => setSelectedDrug(e.target.value)}
            disabled={!selectedPatientId}
          >
            <option value="" disabled>
              Select Drug
            </option>
            {availableDrugs.map((drug) => (
              <option key={drug} value={drug}>
                {drug}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          type="button"
          className="btn btn-danger"
          style={{
            height: "36px",
            fontSize: "14px",
            padding: "0 10px",
            flexShrink: "0",
          }}
          onClick={onSearch}
          disabled={!selectedPatientId || !selectedDrug}
        >
          Search
        </button>
      </div>

      {/* Data Refreshed Section */}
      <div className="mt-2 text-muted" style={{ fontSize: "12px" }}>
        Data refreshed on: <strong>{currentDate}</strong>
      </div>
    </div>
  );
};

export default Dropdowns;
