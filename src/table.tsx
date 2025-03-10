import { useState } from "react";

const [sortedColumn, setSortedColumn] = useState<string | null>(null);
const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
const [sortedData, setSortedData] = useState(summaryData?.df_notes || []);

const handleSort = (column: string) => {
  let newSortOrder = "asc";
  if (sortedColumn === column && sortOrder === "asc") {
    newSortOrder = "desc";
  }
  
  setSortedColumn(column);
  setSortOrder(newSortOrder);
  
  const sorted = [...summaryData.df_notes].sort((a, b) => {
    if (a[column] === null || a[column] === undefined) return 1;
    if (b[column] === null || b[column] === undefined) return -1;
    
    if (typeof a[column] === "number") {
      return newSortOrder === "asc" ? a[column] - b[column] : b[column] - a[column];
    }
    
    return newSortOrder === "asc"
      ? String(a[column]).localeCompare(String(b[column]))
      : String(b[column]).localeCompare(String(a[column]));
  });

  setSortedData(sorted);
};

{summaryData && (
  <div style={{ marginTop: "30px", backgroundColor: "#f8f9fa", border: "1px solid #ccc", borderRadius: "5px", padding: "10px 15px" }}>
    
    <div onClick={toggleTable} style={{ cursor: "pointer", color: "#333", display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: "bold" }}>
      <span>📋 Patient Notes <span style={{ fontSize: "14px", fontWeight: "normal", color: "gray" }}>(Used for above Notes Summary)</span></span>
      <span>{isTableVisible ? "▲" : "▼"}</span>
    </div>

    {isTableVisible && (
      <div className="card card-body" style={{ maxHeight: "200px", overflowY: "auto", marginTop: "10px", border: "1px solid #ddd", padding: "10px", borderRadius: "5px", backgroundColor: "white" }}>
        {sortedData.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr style={{ fontSize: "13px", cursor: "pointer" }}>
                {[
                  "spclt_ptnt_gid", "note_typ_cd", "src_add_ts", "note_txt",
                  "note_smry_txt", "note_description", "notes", "patient_id", "ptnt_id"
                ].map((column) => (
                  <th key={column} onClick={() => handleSort(column)}>
                    {column} {sortedColumn === column ? (sortOrder === "asc" ? "🔼" : "🔽") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item: any, index: number) => (
                <tr key={index} style={{ fontSize: "12px" }}>
                  <td>{item.spclt_ptnt_gid}</td>
                  <td>{item.note_typ_cd}</td>
                  <td>{item.src_add_ts || "N/A"}</td>
                  <td>{item.note_txt || "N/A"}</td>
                  <td>{item.note_smry_txt}</td>
                  <td>{item.note_description}</td>
                  <td>{item.notes || "N/A"}</td>
                  <td>{item.patient_id || "N/A"}</td>
                  <td>{item.ptnt_id || "N/A"}</td>
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
)}
