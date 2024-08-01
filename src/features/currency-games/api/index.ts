import axios from 'axios';
import { baseURL } from 'shared/lib/consts/url';
import { CurrencyGamesDataProps, PartnerData } from '../types/types';

export const postGamesStatisticData = async (props: CurrencyGamesDataProps) => {
  try {
    const response = await axios.post<PartnerData>(
      `${baseURL}/admin-panel-statistics/get-grouped-by-currency-games`,
      props,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
