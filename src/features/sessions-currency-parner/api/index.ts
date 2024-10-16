import $api from '../../../http';
import { postSessionsCurrency, ResultSessionsInfo } from '../types/types';

export const postSessionsCurrencyData = async (props: postSessionsCurrency) => {
  const { partnerId, currencyes, ...requestData } = props;

  // Формируем параметры в зависимости от типа currency
  let queryParams = `partnerId=${partnerId}`;

  if (Array.isArray(currencyes)) {
    queryParams += currencyes.map((cur) => `&currencyes=${cur}`).join('');
  } else {
    queryParams += `&currencyes=${currencyes}`;
  }

  try {
    const response = await $api
      .post<ResultSessionsInfo>(`/admin-panel-statistics/get-currency-sessions?${queryParams}`, requestData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
