import { createContext } from 'react';

const initialState = {
  token: null,
  currentPage: null,
  pageConfig: null,
  isLoading: false,
  error: null,
  data: null,
  lastUpdated: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.payload, error: null, data: null, lastUpdated: null };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload.page, pageConfig: action.payload.config, data: null, error: null, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: action.payload ? null : state.error };
    case 'SET_DATA':
      return { ...state, data: action.payload, isLoading: false, error: null, lastUpdated: new Date().toISOString() };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'CLEAR_DATA':
      return { ...state, data: null, error: null, isLoading: false, lastUpdated: null };
    default:
      return state;
  }
};

export const AppContext = createContext();
export { initialState, appReducer };