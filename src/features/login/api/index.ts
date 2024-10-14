import $api from '../../../http';
import { LoginPartnerData, LoginPartnerDataProps } from '../types/types';

export const login = async (props: LoginPartnerDataProps) => {
  try {
    const response = await $api
      .post<LoginPartnerData>('/admin-panel/partner-authorization', props);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
