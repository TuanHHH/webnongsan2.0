import React, { useState } from 'react';

const TableGrid = () => {
  const [gridTemplateColumns, setGridTemplateColumns] = useState("1fr 2fr 3fr 3fr 5fr 2fr 2fr");

  return (
    <div>
      <style>
        {`
          .table-grid {
            display: grid;
            grid-template-columns: ${gridTemplateColumns};
            border: 2px solid black;
          }

          .cell {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
            word-wrap: break-word;
            overflow-wrap: break-word;
            white-space: pre-wrap;
            word-break: break-all;
          }
        `}
      </style>
    </div>
  );
};

export default TableGrid;
