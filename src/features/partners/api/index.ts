import axios from 'axios';
import { baseURL } from 'shared/lib/consts/url';
import { PartnerData, PartnersDataProps } from '../types/types';

export const getPartnersData = async () => {
  const response = await axios.get<PartnerData[]>(
    `${baseURL}/admin-panel/partners`,
  );
  return response.data;
};

export const fetchPartnersData = async (props: PartnersDataProps) => {
  try {
    await axios.post(
      `${baseURL}/admin-panel/partners`,
      props,
    );
  } catch (e) {
    console.log(e);
  }
};
