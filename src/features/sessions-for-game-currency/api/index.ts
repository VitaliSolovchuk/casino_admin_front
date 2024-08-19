import axios from 'axios';
import { baseURL } from 'shared/lib/consts/url';
import {
  SessionForPlayer,
  SessionsPartnerGameCurrencyDataProps,
} from '../types/types';

export const postSessionsPartnerGameCurrencyData = async (props: SessionsPartnerGameCurrencyDataProps) => {
  const {
    partnerId, currencyName, gameName, ...requestData
  } = props;
  try {
    const response = await axios.post<SessionForPlayer[]>(
      // eslint-disable-next-line max-len
      `${baseURL}/admin-panel/sessions-for-game-currencyName-partner?partnerId=${partnerId}&currencyName=${currencyName}&gameName=${gameName}&`,
      requestData,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
