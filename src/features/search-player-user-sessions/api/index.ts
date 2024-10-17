import $api from '../../../http';
import { postPlayerUserSessionsProps, SessionResponse2 } from '../types/types';

export const postSessionsForPlayer2 = async (props: postPlayerUserSessionsProps) => {
  try {
    const response = await $api.post<SessionResponse2>('/admin-panel-statistics/get-player-sessions', props);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
