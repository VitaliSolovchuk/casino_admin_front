import React, { FC } from 'react';
import { paths } from 'shared/lib/consts/paths';
import { useNavigate } from 'react-router-dom';
import { GridRenderCellParams } from '@mui/x-data-grid';

export const HighlightCell: FC<{ params: GridRenderCellParams }> = ({ params }) => {
  const navigate = useNavigate();
  const rowId = params.id;
  const colField = params.field;

  const handleMouseEnter = () => {
    const table = document.querySelector('.MuiDataGrid-root');
    if (table) {
      const rows = table.querySelectorAll('.MuiDataGrid-row');
      const cols = table.querySelectorAll(`.MuiDataGrid-cell[data-field='${colField}']`);
      const rowIndex = Array.from(rows).findIndex((row) => row.getAttribute('data-id') === String(rowId));
      rows[rowIndex]?.classList.add('highlight-row');
      cols.forEach((col) => col.classList.add('highlight-col'));
    }
  };

  const handleMouseLeave = () => {
    const table = document.querySelector('.MuiDataGrid-root');
    if (table) {
      const rows = table.querySelectorAll('.MuiDataGrid-row');
      const cols = table.querySelectorAll(`.MuiDataGrid-cell[data-field='${colField}']`);
      const rowIndex = Array.from(rows).findIndex((row) => row.getAttribute('data-id') === String(rowId));
      rows[rowIndex]?.classList.remove('highlight-row');
      cols.forEach((col) => col.classList.remove('highlight-col'));
    }
  };

  const handleCellClick = () => {
    const partnerId = 5;
    const currencyName = colField;
    // eslint-disable-next-line prefer-destructuring
    const gameName = params.row.gameName;

    navigate(
      `${paths.sessions}?partner-id=${partnerId}&currency=${currencyName}&game=${gameName}`,
    );
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCellClick}
      style={{ whiteSpace: 'normal', wordWrap: 'break-word', cursor: 'pointer' }}
      className="cell-for-hover"
    >
      {params.value}
    </div>
  );
};
