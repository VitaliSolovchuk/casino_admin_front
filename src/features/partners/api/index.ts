import axios from 'axios';
import { baseURL } from 'shared/lib/consts/url';
import {
  GamesDataProps, GamesWithUSDRTP, PartnerData, PartnersDataProps,
} from '../types/types';

export const getPartnersData = async () => {
  const response = await axios.get<PartnerData>(
    `${baseURL}/admin-panel/partners`,
  );
  return response.data;
};

export const postPartnersData = async (props: PartnersDataProps) => {
  try {
    const response = await axios.post<PartnerData>(
      `${baseURL}/admin-panel/partners`,
      props,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postGamesData = async (props: GamesDataProps) => {
  try {
    const response = await axios.post<GamesWithUSDRTP[]>(
      `${baseURL}/admin-panel/games`,
      props,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postPartnersStatisticData = async (props: PartnersDataProps) => {
  try {
    const response = await axios.post<PartnerData>(
      `${baseURL}/admin-panel-statistics/get-grouped-by-currency`,
      props,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postGamesStatisticData = async (props: PartnersDataProps) => {
  try {
    const response = await axios.post<PartnerData>(
      `${baseURL}/admin-panel-statistics/get-grouped-by-games`,
      props,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
