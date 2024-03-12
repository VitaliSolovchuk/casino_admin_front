import axios from 'axios';
import { baseURL } from 'shared/lib/consts/url';
import { getSessionsProps, SessionEvent } from '../types/types';

export const getSessionsData = async (props: getSessionsProps) => {
  try {
    const response = await axios.get<SessionEvent[]>(
      `${baseURL}/admin-panel/session-for-player?sessionId=${props.sessionId}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
