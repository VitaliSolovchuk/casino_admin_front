import React, { useMemo, FC } from 'react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom'; // Добавлено для навигации
import { paths } from 'shared/lib/consts/paths';
import { CurrencyGamesData } from 'features/currency-games/types/types';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';

const transformDataForTable = (data?: CurrencyGamesData) => {
  if (!data) return [];

  const gamesMap: Record<number, Record<string, any>> = {};
  const curMap: Record<string, number> = {};

  data.gameStatistics.forEach((currencyStat) => {
    curMap[currencyStat.currencyName] = 0;
    currencyStat.games.forEach((game) => {
      if (!gamesMap[game.gameId]) {
        gamesMap[game.gameId] = {
          gameName: game.gameName,
        };

        gamesMap[game.gameId].total = 0;
      }
      gamesMap[game.gameId][currencyStat.currencyName] = game.usdGameGgr;
      gamesMap[game.gameId].total += +game.usdGameGgr;
      curMap[currencyStat.currencyName] += +game.usdGameGgr;
    });
  });

  Object.values(gamesMap).forEach((game) => {
    game.total = game.total.toFixed(2);
  });

  const usdGgrTotal = data.gameStatistics.reduce((acc, curr) => acc + parseFloat(curr.usdGgr), 0);

  const totalRow: Record<string, string> = { gameName: 'total', total: usdGgrTotal.toFixed(2) };
  Object.entries(curMap).forEach(([currencyName, totalValue]) => {
    totalRow[currencyName] = totalValue.toFixed(2);
  });

  const gamesArray = Object.values(gamesMap);
  gamesArray.unshift(totalRow);

  return gamesArray;
};

interface CurrencyGamesTableProps {
  data?: CurrencyGamesData;
  isLoading: boolean;
  error: Error;
}

const HighlightCell: FC<{ params: GridRenderCellParams }> = ({ params }) => {
  const navigate = useNavigate(); // Используем для навигации
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
    const partnerId = 5; // Константный partnerId
    const currencyName = colField; // Название валюты – это поле
    // eslint-disable-next-line prefer-destructuring
    const gameName = params.row.gameName;

    // Переход на новую страницу с передачей параметров
    navigate(
      `${paths.sessionsForGameCurrency}?partner-id=${partnerId}&currency-name=${currencyName}&game-name=${gameName}`,
    );
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCellClick} // Добавляем событие клика
      style={{ whiteSpace: 'normal', wordWrap: 'break-word', cursor: 'pointer' }}
      className="cell-for-hover"
    >
      {params.value}
    </div>
  );
};

const CurrencyGamesTable: FC<CurrencyGamesTableProps> = ({ data, isLoading, error }) => {
  const tableData = useMemo(() => transformDataForTable(data), [data]);

  const columns: GridColDef[] = useMemo(() => {
    if (!data) return [{ field: 'gameName', headerName: 'Game', flex: 1 }];

    return [
      {
        field: 'gameName',
        headerName: 'Game',
        flex: 1,
        minWidth: 75,
        type: 'string',
        renderCell: (params: GridRenderCellParams<any, any>) => (
          <HighlightCell params={params} />
        ),
      },
      {
        field: 'total',
        headerName: 'USD Total',
        flex: 1,
        minWidth: 85,
        type: 'number',
        renderCell: (params: GridRenderCellParams<any, any>) => (
          <HighlightCell params={params} />
        ),
      },
      ...data.gameStatistics.map((stat) => ({
        field: stat.currencyName,
        headerName: stat.currencyName,
        flex: 1,
        minWidth: 65,
        type: 'number',
        renderCell: (params: GridRenderCellParams<any, any>) => (
          <HighlightCell params={params} />
        ),
      })),
    ];
  }, [data]);

  return (
    <TableGrid
      data={tableData}
      rowId={(row) => row.gameName}
      isLoading={isLoading}
      error={error}
      columns={columns}
      title="Currency-Games Table"
    />
  );
};

export default CurrencyGamesTable;
