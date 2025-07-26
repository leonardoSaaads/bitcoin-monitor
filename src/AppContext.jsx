import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  token: null,
  currentPage: null,
  pageConfig: null,
  isLoading: false,
  error: null,
  data: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload,
        error: null
      };
    
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload.page,
        pageConfig: action.payload.config,
        data: null,
        error: null
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        error: null
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setToken = (token) => {
    dispatch({ type: 'SET_TOKEN', payload: token });
  };

  const setPage = (page, config = null) => {
    dispatch({ type: 'SET_PAGE', payload: { page, config } });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setData = (data) => {
    dispatch({ type: 'SET_DATA', payload: data });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    setToken,
    setPage,
    setLoading,
    setData,
    setError,
    clearError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};