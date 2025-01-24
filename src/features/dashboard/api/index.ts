import axios from 'axios';
import { baseURL } from 'shared/lib/consts/url';
import { UpdateServerKeyProps } from '../types/types';

export const postUpdateServerKeysData = async (props: UpdateServerKeyProps) => {
  try {
    const response = await axios.post<string>(`${baseURL}/admin-panel/update-server-keys`, props);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
