import axios from 'axios';
import { baseURL } from '../../../shared/lib/consts/url';
import { getPlayersProps, Player } from '../types/types';

export const getPlayersData = async (props: getPlayersProps) => {
  try {
    const response = await axios.get<Player[]>(
      `${baseURL}/admin-panel/players-for-partner?partnerId=${props.partnerId}`,
      {
        params: props.params,
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
