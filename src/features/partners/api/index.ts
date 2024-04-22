import axios from 'axios';
import { baseURL } from 'shared/lib/consts/url';
import { paths } from 'shared/lib/consts/paths';
import { PartnerData, PartnersDataProps } from '../types/types';

export const getPartnersData = async () => {
  const response = await axios.get<PartnerData>(
    `${baseURL}/admin-panel${paths.partners}`,
  );
  return response.data;
};

export const postPartnersData = async (props: PartnersDataProps) => {
  try {
    const response = await axios.post<PartnerData>(
      `${baseURL}/admin-panel${paths.partners}`,
      props,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
