import React, { useState } from "react";

interface PatientNotesTableProps {
  summaryData: {
    df_notes: Array<{ [key: string]: any }>;
  };
}

const PatientNotesTable: React.FC<PatientNotesTableProps> = ({ summaryData }) => {
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const toggleTable = () => {
    setIsTableVisible(!isTableVisible);
  };

  const columns = [
    "spclt_ptnt_gid",
    "note_typ_cd",
    "src_add_ts",
    "note_txt",
    "note_smry_txt",
    "note_description",
    "notes",
    "patient_id",
    "ptnt_id",
  ];

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn === column) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return "⇅"; // Default icon when not sorted
  };

  const handleFilterChange = (column: string, value: string) => {
    setFilters({ ...filters, [column]: value });
  };

  const filteredAndSortedData = [...(summaryData?.df_notes || [])]
    .filter((item) =>
      columns.every(
        (column) =>
          !filters[column] || String(item[column] || "").toLowerCase().includes(filters[column].toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortColumn) return 0;
      const valA = a[sortColumn] || "";
      const valB = b[sortColumn] || "";
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

  return (
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
        <span>
          📝 Patient Notes{" "}
          <span style={{ fontSize: "14px", fontWeight: "normal", color: "gray" }}>
            (Used for above Notes Summary)
          </span>
        </span>
        <span>{isTableVisible ? "➖" : "➕"}</span>
      </div>

      {isTableVisible && (
        <div
          className="card card-body"
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "5px",
            marginTop: "10px",
          }}
        >
          {filteredAndSortedData.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr style={{ fontSize: "13px", cursor: "pointer" }}>
                  {columns.map((column) => (
                    <th key={column} onClick={() => handleSort(column)}>
                      {column} <span>{getSortIcon(column)}</span>
                    </th>
                  ))}
                </tr>
                <tr>
                  {columns.map((column) => (
                    <th key={column}>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={filters[column] || ""}
                        onChange={(e) => handleFilterChange(column, e.target.value)}
                        style={{
                          width: "100%",
                          fontSize: "12px",
                          padding: "4px",
                          border: "1px solid #ccc",
                          borderRadius: "3px",
                        }}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedData.map((item, index) => (
                  <tr key={index} style={{ fontSize: "12px" }}>
                    {columns.map((column) => (
                      <td key={column}>{item[column] || "N/A"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No patient notes available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientNotesTable;
