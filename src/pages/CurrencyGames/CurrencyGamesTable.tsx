import React, { useMemo, FC } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { CurrencyGamesData } from 'features/currency-games/types/types';
import TableGrid from 'widgets/tableGrid/ui/TableGrid';

const transformDataForTable = (data: CurrencyGamesData) => {
  const gamesMap: Record<number, Record<string, any>> = {};

  data.gameStatistics.forEach((currencyStat) => {
    currencyStat.games.forEach((game) => {
      if (!gamesMap[game.gameId]) {
        gamesMap[game.gameId] = {
          gameName: game.gameName,
        };
      }
      gamesMap[game.gameId][currencyStat.currencyName] = game.currencyGameGgr;
    });
  });

  const usdGgrTotal = data.gameStatistics.reduce((acc, curr) => acc + parseFloat(curr.usdGgr), 0);
  const gamesArray = Object.values(gamesMap);
  gamesArray.push({ gameName: 'Total', usdGgr: usdGgrTotal.toString() });

  return gamesArray;
};

// eslint-disable-next-line max-len
const CurrencyGamesTable: FC<{ data: CurrencyGamesData, isLoading: boolean, error: Error }> = ({ data, isLoading, error }) => {
  const tableData = useMemo(() => transformDataForTable(data), [data]);

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'gameName',
      headerName: 'Game',
      flex: 1,
    },
    ...data.gameStatistics.map((stat) => ({
      field: stat.currencyName,
      headerName: stat.currencyName,
      flex: 1,
    })),
    {
      field: 'usdGgr',
      headerName: 'USD Total',
      flex: 1,
    },
  ], [data]);

  return (
    <TableGrid
      data={tableData}
      rowId={(row: { gameName: any; }) => row.gameName}
      isLoading={isLoading}
      error={error}
      columns={columns}
      title="Currency-Games Table"
    />
  );
};

export default CurrencyGamesTable;
