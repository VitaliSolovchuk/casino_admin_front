import React, {
  FC, useEffect, useContext, useMemo, useState, useRef,
} from 'react';
import useTableGrid from 'widgets/tableGrid/model/tableGridStore';
import useFilterDateRange from 'entities/dateRangeCalendar/model/dateRangeStore';
import { useDataRequest } from 'shared/lib/hooks/useDataRequest';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import { postCurrencyGamesStatisticData } from 'features/currency-games/api';
import { CurrencyGamesData } from 'features/currency-games/types/types';
import { GridColDef, GridFilterModel, GridRenderCellParams } from '@mui/x-data-grid';
import TotalGGRContext from '../../TotalGGRContext';
import TableGrid from '../../shared/ui/TableGrid/TableGrid';
import { HighlightCell } from './HighlightCell';

const CurrencyGames: FC = () => {
  const { paginationModel } = useTableGrid((state) => state);
  const { filterDate } = useFilterDateRange((state) => state);
  const { dateRange } = filterDate;
  const { setTotalGgrUsd } = useContext(TotalGGRContext);
  const [localFilterModel, setLocalFilterModel] = useState<GridFilterModel>({ items: [], quickFilterValues: [] });
  const hasMounted = useRef(false);

  const {
    data,
    isLoading,
    error,
  } = useDataRequest<CurrencyGamesData>(
    'currency-games-',
    () => postCurrencyGamesStatisticData({
      paginationModel,
      filterModel: localFilterModel,
      filterDate: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    }),
  );

  const { mutate, isLoading: isLoadingMutate } = useMutationRequest<CurrencyGamesData>(
    'currency-games-',
    () => postCurrencyGamesStatisticData(
      {
        paginationModel,
        filterModel: localFilterModel,
        filterDate: {
          startDate: dateRange[0],
          endDate: dateRange[1],
        },
      },
    ),
  );

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

  const tableData = useMemo(() => transformDataForTable(data), [data]);

  useEffect(() => {
    if (!isLoading && data) {
      setTotalGgrUsd(data.totalGgrUsd);
    }

    if (error) {
      console.error('Error fetching data:', error);
    }
  }, [data, isLoading, error, setTotalGgrUsd]);

  useEffect(() => {
    mutate();
    if (hasMounted.current) {
      mutate();
    } else {
      hasMounted.current = true;
    }
  }, [mutate, paginationModel, localFilterModel, filterDate, dateRange]);

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
    <div>
      <TableGrid
        data={tableData}
        rowCountState={tableData?.length}
        rowId={(row: { gameName: string; }) => row.gameName}
        isLoading={isLoading || isLoadingMutate}
        error={error as Error}
        columns={columns}
        title="Currency-Games Table"
        setLocalFilterModel={setLocalFilterModel}
        sortingMode="server"
      />
    </div>
  );
};
export default CurrencyGames;
