import {
  GamesData, GamesDataProps, GamesWithUSDRTP, PartnerCurrensyData, PartnerData, PartnersDataProps,
} from '../types/types';
import $api from '../../../http';

export const getPartnersData = async () => {
  const response = await $api.get<PartnerData>('/admin-panel/partners');
  return response.data;
};

export const postPartnersData = async (props: PartnersDataProps) => {
  try {
    const response = await $api.post<PartnerData>('/admin-panel/partners', props);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postGamesData = async (props: GamesDataProps) => {
  try {
    const response = await $api.post<GamesWithUSDRTP[]>('/admin-panel/games', props);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postPartnersStatisticData = async (props: PartnersDataProps) => {
  const { partnerId, ...requestData } = props;

  const queryParams = `partnerId=${partnerId}`;
  try {
    const response = await $api.post<PartnerData>(`/admin-panel-statistics/get-grouped-by-currency?${queryParams}`, requestData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postPartnersCurrenseStatisticData = async (props: PartnersDataProps) => {
  try {
    const response = await $api.post<PartnerCurrensyData>('/admin-panel-statistics/get-grouped-by-partner', props);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postGamesStatisticData = async (props: GamesDataProps) => {
  try {
    const response = await $api.post<GamesData>('/admin-panel-statistics/get-grouped-by-games', props);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
