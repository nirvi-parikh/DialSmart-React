import React, { useState, useMemo } from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import Papa from "papaparse"; // CSV Parsing Library

// Custom filter UI
const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)}
      placeholder="Search..."
      style={{ width: "100%", fontSize: "12px" }}
    />
  );
};

const App = ({ summaryData }: { summaryData: any }) => {
  const [isTableVisible, setIsTableVisible] = useState(false);

  const toggleTable = () => setIsTableVisible(!isTableVisible);

  // Define table columns with filtering
  const columns = useMemo(
    () => [
      { Header: "spclt_ptnt_gid", accessor: "spclt_ptnt_gid" },
      { Header: "note_typ_cd", accessor: "note_typ_cd" },
      { Header: "src_add_ts", accessor: "src_add_ts" },
      { Header: "note_txt", accessor: "note_txt" },
      { Header: "note_smry_txt", accessor: "note_smry_txt" },
      { Header: "note_description", accessor: "note_description" },
      { Header: "notes", accessor: "notes" },
      { Header: "patient_id", accessor: "patient_id" },
      { Header: "ptnt_id", accessor: "ptnt_id" },
    ],
    []
  );

  const data = useMemo(() => summaryData?.df_notes || [], [summaryData]);

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data, defaultColumn }, useFilters, useSortBy);

  // Function to Download CSV
  const downloadCSV = () => {
    const csvData = data.map((row) =>
      columns.reduce((acc, col) => {
        acc[col.accessor] = row[col.accessor] || "N/A"; // Handle missing values
        return acc;
      }, {} as any)
    );

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "patient_notes.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ marginTop: "30px" }}>
      {summaryData && (
        <>
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
              📋 Patient Notes{" "}
              <span style={{ fontSize: "14px", fontWeight: "normal", color: "gray" }}>
                (Used for above Notes Summary)
              </span>
            </span>
            <span>{isTableVisible ? "▲" : "▼"}</span>
          </div>

          {isTableVisible && summaryData?.df_notes?.length > 0 ? (
            <>
              <button
                onClick={downloadCSV}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: "10px",
                }}
              >
                📥 Download CSV
              </button>

              <div
                className="card card-body"
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <table {...getTableProps()} className="table table-bordered">
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()} style={{ fontSize: "13px" }}>
                        {headerGroup.headers.map((column) => (
                          <th
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                            style={{ cursor: "pointer" }}
                          >
                            {column.render("Header")}
                            <span>{column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}</span>
                            <div>{column.canFilter ? column.render("Filter") : null}</div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()} style={{ fontSize: "12px" }}>
                          {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>{cell.render("Cell") || "N/A"}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : isTableVisible ? (
            <p>No patient notes available.</p>
          ) : null}
        </>
      )}
    </div>
  );
};

export default App;
