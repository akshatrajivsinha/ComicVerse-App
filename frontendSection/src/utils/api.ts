import axios from 'axios';

const CATEGORY_API_URL = 'https://getcategory-cm5h7rlbta-uc.a.run.app';

const SHOW_LIST_API_URL = 'https://getshowlist-cm5h7rlbta-uc.a.run.app';

const HERO_VIDEO_API_URL = 'https://getherovideo-cm5h7rlbta-uc.a.run.app';

const UPCOMING_MOVIES_API_URL =
  'https://getupcommingmovies-cm5h7rlbta-uc.a.run.app';

const MY_STORIES_API_URL = 'https://getmystorie-cm5h7rlbta-uc.a.run.app';

const SHOW_DETAIL_API_URL =
  'https://getshowdetailbyslug-cm5h7rlbta-uc.a.run.app';

const STORY_DETAIL_API_URL =
  'https://getstorydetialbyslug-cm5h7rlbta-uc.a.run.app';

const USER_DATA_API_URL = 'https://getuserusingauthtoken-cm5h7rlbta-uc.a.run.app';
const SET_USER_PROFILE_API_URL = 'https://setuserprofilefunction-cm5h7rlbta-uc.a.run.app';

export interface Category {
  id: string;
  name: string;
  image: string;
  createdAt?: any;
}

export interface Show {
  id?: string;
  title?: string;
  name?: string;
  image?: string;
  description?: string;
  createdAt?: any;
  [key: string]: any;
}

export interface HeroVideo {
  id?: string;
  videoUri?: string;
  poster?: string;
  categoryImage?: string;
  categoryTitle?: string;
  createdAt?: any;
}

export interface Story {
  id?: string;
  slug?: string;
  imageUri?: string;
  smallImageUri?: string;
  category?: string;
  title?: string;
  description?: string;
  author?: string;
  releaseYear?: string;
  rating?: number;
  language?: string;
  genre?: string[];
  relatedStories?: Story[];
  createdAt?: any;
}

export interface UpcomingMovie {
  id?: string;
  imageUri?: string;
  title?: string;
  releaseDate?: string;
  rating?: string;
  createdAt?: any;
}

export interface UserProfile {
  uid?: string;
  email: string;
  profileName?: string;
  profileImage?: string;
  coverImage?: string;
  provider?: string;
  registrationCompleted?: boolean;
  createdAt?: number;
}

export const getCategories = async () => {
  try {
    const { data } = await axios.get(CATEGORY_API_URL);
    return data;
  } catch {
    return {
      success: false,
      data: [],
      error: 'Failed to fetch categories',
    };
  }
};

export const getShowList = async () => {
  try {
    const { data } = await axios.get(SHOW_LIST_API_URL);
    return data;
  } catch {
    return {
      success: false,
      data: [],
      error: 'Failed to fetch show list',
    };
  }
};

export const getHeroVideo = async () => {
  try {
    const { data } = await axios.get(HERO_VIDEO_API_URL);
    return data;
  } catch {
    return {
      success: false,
      data: null,
      error: 'Failed to fetch hero video',
    };
  }
};

export const getUpcomingMovies = async () => {
  try {
    const { data } = await axios.get(UPCOMING_MOVIES_API_URL);
    return data;
  } catch {
    return {
      success: false,
      data: [],
      error: 'Failed to fetch upcoming movies',
    };
  }
};

export const getMyStories = async () => {
  try {
    const { data } = await axios.get(MY_STORIES_API_URL);
    return data;
  } catch {
    return {
      success: false,
      data: [],
      error: 'Failed to fetch stories',
    };
  }
};

export const getShowDetailBySlug = async (slug: string) => {
  try {
    const { data } = await axios.post(SHOW_DETAIL_API_URL, {
      slug,
    });

    return data;
  } catch {
    return {
      success: false,
      data: null,
      error: 'Failed to fetch show details',
    };
  }
};

export const getStoryDetialBySlug = async (slug: string) => {
  try {
    const { data } = await axios.post(STORY_DETAIL_API_URL, {
      slug,
    });

    return data;
  } catch {
    return {
      success: false,
      data: null,
      error: 'Failed to fetch story details',
    };
  }
};

export const getUserByDatabaseToken = async (token: string) => {
  try {
    const { data } = await axios.get(USER_DATA_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch {
    return {
      success: false,
      user: null,
      error: 'Failed to fetch user data',
    };
  }
};

export const setUserProfile = async (
  token: string,
  body: { profileName: string; coverImage: string; profileImage: string },
) => {
  try {
    const { data } = await axios.post(SET_USER_PROFILE_API_URL, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 30000,
    });
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.error || error?.message || 'Failed to update profile';
    console.error('setUserProfile error:', message);
    return {
      success: false,
      error: message,
    };
  }
};