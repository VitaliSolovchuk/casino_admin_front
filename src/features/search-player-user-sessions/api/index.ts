import $api from '../../../http';
import {
  ItemSession2, postPlayerUserSessionsProps, SessionForUserForBetDto, SessionResponse2,
} from '../types/types';

export const postSessionsForPlayer2 = async (props: postPlayerUserSessionsProps) => {
  try {
    const response = await $api.post<SessionResponse2>('/admin-panel-statistics/get-player-sessions', props);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postSessionForPlayer = async (props: SessionForUserForBetDto) => {
  try {
    const response = await $api.post<ItemSession2>('/admin-panel/session-by-bet-id', props);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
