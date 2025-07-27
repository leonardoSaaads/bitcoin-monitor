import { useReducer, useCallback } from 'react';
import { AppContext, initialState, appReducer } from './contexts/AppContext';

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