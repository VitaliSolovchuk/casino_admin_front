import $api from '../../../http';
import { getSessionsProps, SessionEvent } from '../types/types';

export const getSessionsData = async (props: getSessionsProps) => {
  const { sessionId, ...requestData } = props;
  try {
    const response = await $api.get<SessionEvent[]>(
      `/admin-panel/session-for-player?sessionId=${sessionId}`,
      {
        params: requestData,
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const postSessionsData = async (props: getSessionsProps) => {
  const { sessionId, ...requestData } = props;
  try {
    const response = await $api.post<SessionEvent[]>(
      `/admin-panel/session-for-player?sessionId=${sessionId}`,
      requestData,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
