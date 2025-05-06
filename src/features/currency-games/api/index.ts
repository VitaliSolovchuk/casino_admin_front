import { baseURL } from 'shared/lib/consts/url';
import $api from '../../../http';
import { CurrencyGamesDataProps, CurrencyGamesData } from '../types/types';

export const postCurrencyGamesStatisticData = async (props: CurrencyGamesDataProps) => {
  try {
    // eslint-disable-next-line max-len
    const response = await $api.post<CurrencyGamesData>(`${baseURL}/admin-panel-statistics/get-grouped-by-currency-games`, props);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
