import React from "react";

const CustomTable = ({
  data,
  columns,
  show = "",
  lastPage = 1,
  page = 1,
  handlePageChange,
}) => {

  const getColumnWidths = (columns) => {
    let usedWidth = 0;
    const autoColumns = [];

    columns.forEach((col) => {
      if (col.width) {
        usedWidth += parseFloat(col.width);
      } else {
        autoColumns.push(col);
      }
    });

    const remainingWidth = Math.max(100 - usedWidth, 0);
    const autoWidth =
      autoColumns.length > 0 ? remainingWidth / autoColumns.length : 0;

    return columns.map((col) => ({
      ...col,
      _calculatedWidth: col.width || `${autoWidth}%`,
    }));
  };

  const finalColumns = getColumnWidths(columns);

    return (
      <>
        <div className="customers-table-wrapper">
          <table className="customers-table">
            <colgroup>
              {finalColumns.map((col, i) => (
                <col key={i} style={{ width: col._calculatedWidth }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`${col.bothClass || ""} ${col.thClass || ""}`}
                  >
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data?.map((row, index) => (
                <tr key={index}>
                  {columns.map((col, i) => (
                    <td
                      className={`${col.bothClass || ""} ${col.tdClass || ""}`}
                      key={i}
                    >
                      {typeof col.row === "function"
                        ? col.row(row)
                        : row[col.row]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-container">
          <span className="pagination-content">{show}</span>
          <div className="pagination-actions-container">
            <button
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </button>
            <button
              className="pagination-btn"
              disabled={page === lastPage}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </>
    );
};

export default CustomTable;
