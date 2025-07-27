// hooks/useBitQuery.js
import { useCallback, useRef } from 'react';
import { useApp } from '../hooks/useAppContext';

const BITQUERY_BASE_URL = 'https://graphql.bitquery.io';

export const useBitQuery = () => {
  const { token, setLoading, setData, setError } = useApp();
  const abortControllerRef = useRef(null);

  // Função para converter data para ISO8601DateTime
  const formatToISO8601DateTime = useCallback((dateString) => {
    if (!dateString) return null;
    
    // Se já é um datetime completo, retorna como está
    if (dateString.includes('T')) {
      return dateString;
    }
    
    // Se é apenas uma data (YYYY-MM-DD), adiciona horário UTC
    return `${dateString}T00:00:00Z`;
  }, []);

  const makeRequest = useCallback(async (query, variables = {}) => {
    if (!token) {
      setError('Token de acesso não configurado');
      return;
    }

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(BITQUERY_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query,
          variables
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.errors) {
        const errorMsg = result.errors.map(err => err.message).join(', ');
        throw new Error(`GraphQL Error: ${errorMsg}`);
      }

      if (!result.data) {
        throw new Error('Resposta da API sem dados');
      }

      setData(result.data);
      return result.data;
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      const errorMessage = error.message || 'Erro desconhecido na requisição';
      setError(errorMessage);
      console.error('BitQuery API Error:', error);
      throw error;
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [token, setLoading, setData, setError]);

  const fetchBitcoinPrice = useCallback(async (date = new Date().toISOString().split('T')[0]) => {
    const query = `
      query GetBitcoinPrice($date: ISO8601DateTime!) {
        bitcoin {
          outputs(date: {is: $date}) {
            value
            usd: value(in: USD)
            expression(get: "usd/value")
          }
        }
      }
    `;
    
    // Converter a data para o formato correto
    const formattedDate = formatToISO8601DateTime(date);
    
    return makeRequest(query, { date: formattedDate });
  }, [makeRequest, formatToISO8601DateTime]);

  const fetchBitcoinBalance = useCallback(async (config) => {
    const query = `
      query GetBitcoinBalance($network: BitcoinNetwork!, $address: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
        bitcoin(network: $network) {
          inputs(date: {since: $from, till: $till}, inputAddress: {is: $address}) {
            count
            value
            value_usd: value(in: USD)
            min_date: minimum(of: date)
            max_date: maximum(of: date)
          }
          outputs(date: {since: $from, till: $till}, outputAddress: {is: $address}) {
            count
            value
            value_usd: value(in: USD)
            min_date: minimum(of: date)
            max_date: maximum(of: date)
          }
        }
      }
    `;

    const variables = {
      network: config.network || "bitcoin",
      address: config.address,
      from: formatToISO8601DateTime(config.from) || null,
      till: formatToISO8601DateTime(config.till) || null
    };

    return makeRequest(query, variables);
  }, [makeRequest, formatToISO8601DateTime]);

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    fetchBitcoinPrice,
    fetchBitcoinBalance,
    makeRequest,
    cleanup
  };
};