import { baseURL } from 'shared/lib/consts/url';
import { UpdateServerKeyForUserProps, UpdateServerKeyProps } from '../types/types';
import $api from '../../../http';

export const postUpdateServerKeysData = async (props: UpdateServerKeyProps) => {
  try {
    const response = await $api.post<string>(`${baseURL}/admin-panel/update-server-keys`, props);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postUpdateServerKeyForUser = async (props: UpdateServerKeyForUserProps) => {
  try {
    const response = await $api.post<string>(`${baseURL}/admin-panel/update-server-key-for-user`, props);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
