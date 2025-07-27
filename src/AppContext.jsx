import { createContext, useReducer, useCallback } from 'react';

export const AppContext = createContext();

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

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setToken = useCallback((token) => dispatch({ type: 'SET_TOKEN', payload: token }), []);
  const setPage = useCallback((page, config = null) => dispatch({ type: 'SET_PAGE', payload: { page, config } }), []);
  const setLoading = useCallback((loading) => dispatch({ type: 'SET_LOADING', payload: loading }), []);
  const setData = useCallback((data) => dispatch({ type: 'SET_DATA', payload: data }), []);
  const setError = useCallback((error) => dispatch({ type: 'SET_ERROR', payload: error }), []);
  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);
  const clearData = useCallback(() => dispatch({ type: 'CLEAR_DATA' }), []);

  const hasToken = Boolean(state.token);
  const hasData = Boolean(state.data);
  const isHome = state.currentPage === null || state.currentPage === 'home';

  const value = {
    ...state,
    hasToken,
    hasData,
    isHome,
    setToken,
    setPage,
    setLoading,
    setData,
    setError,
    clearError,
    clearData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
