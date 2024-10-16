import $api from '../../../http';
import { Player, postPlayersProps } from '../types/types';

export const postPlayersData = async (props: postPlayersProps) => {
  const { partnerId, currency, ...requestData } = props;

  // Формируем параметры в зависимости от типа currency
  let queryParams = `partnerId=${partnerId}`;

  if (Array.isArray(currency)) {
    queryParams += currency.map((cur) => `&currencyes=${cur}`).join('');
  } else {
    queryParams += `&currencyes=${currency}`;
  }

  try {
    const response = await $api.post<Player[]>(`/admin-panel/players-for-partner?${queryParams}`, requestData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
