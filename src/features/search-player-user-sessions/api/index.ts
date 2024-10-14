import $api from '../../../http';
import { postPlayerUserSessionsProps, SessionResponse, SessionResponse2 } from '../types/types';

export const postSessionsForPlayer = async (props: postPlayerUserSessionsProps) => {
  try {
    const response = await $api.post<SessionResponse>('/admin-panel/get-sessions-for-player', props);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postSessionsForPlayer2 = async (props: postPlayerUserSessionsProps) => {
  try {
    const response = await $api.post<SessionResponse2>('/admin-panel-statistics/get-player-sessions', props);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
