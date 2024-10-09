import axios from 'axios';
import { baseURL } from 'shared/lib/consts/url';
import { postPlayerUserSessionsProps, SessionResponse } from '../types/types';

export const postSessionsForPlayer = async (props: postPlayerUserSessionsProps) => {
  try {
    const response = await axios.post<SessionResponse>(`${baseURL}/admin-panel/get-sessions-for-player`, props);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postSessionsForPlayer2 = async (props: postPlayerUserSessionsProps) => {
  try {
    const response = await axios.post<SessionResponse>(`${baseURL}/admin-panel-statistics/get-player-sessions`, props);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
