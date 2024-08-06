import React, { useMemo, FC } from 'react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
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

  // Округляем итоговые значения total до двух знаков после запятой
  Object.values(gamesMap).forEach((game) => {
    game.total = game.total.toFixed(2);
  });

  const usdGgrTotal = data.gameStatistics.reduce((acc, curr) => acc + parseFloat(curr.usdGgr), 0);

  const totalRow: Record<string, string> = { gameName: 'Total', total: usdGgrTotal.toFixed(2) };
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

const CurrencyGamesTable: FC<CurrencyGamesTableProps> = ({ data, isLoading, error }) => {
  const tableData = useMemo(() => transformDataForTable(data), [data]);
  console.log(tableData);

  const columns: GridColDef[] = useMemo(() => {
    if (!data) return [{ field: 'gameName', headerName: 'Game', flex: 1 }];

    return [
      {
        field: 'gameName',
        headerName: 'Game',
        flex: 1,
        minWidth: 50,
        type: 'string',
      },
      {
        field: 'total',
        headerName: 'USD Total',
        flex: 1,
        minWidth: 50,
        type: 'number',
        renderCell: (params: GridRenderCellParams<any, any>) => (
          <span style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
            {params.value}
          </span>
        ),
      },
      ...data.gameStatistics.map((stat) => ({
        field: stat.currencyName,
        headerName: stat.currencyName,
        flex: 1,
        minWidth: 50,
        type: 'number',
        renderCell: (params: GridRenderCellParams<any, any>) => (
          <span style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
            {params.value}
          </span>
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
