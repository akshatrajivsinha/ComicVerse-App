import axios from 'axios';

const API_BASE_URL = 'https://getcategory-cm5h7rlbta-uc.a.run.app';

export interface Category {
  id: string;
  name: string;
  image: string;
  createdAt?: any;
}

export const getCategories = async () => {
  try {
    const { data } = await axios.get(API_BASE_URL);
    return data;
  } catch {
    return { success: false, data: [], error: 'Failed to fetch categories' };
  }
};
