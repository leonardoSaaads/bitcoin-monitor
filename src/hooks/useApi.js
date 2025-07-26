import { useCallback } from 'react';
import { useApp } from '../AppContext';

const BITQUERY_BASE_URL = 'https://graphql.bitquery.io';

export const useApi = () => {
  const { token, setLoading, setData, setError } = useApp();

  const makeRequest = useCallback(async (query, variables = {}) => {
    if (!token) {
      setError('Token de acesso não configurado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(BITQUERY_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-API-KEY': token // Alguns endpoints podem usar este header
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Erro na resposta da API');
      }

      setData(result.data);
      return result.data;
    } catch (error) {
      const errorMessage = error.message || 'Erro desconhecido na requisição';
      setError(errorMessage);
      console.error('API Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setData, setError]);

  const fetchBitcoinPrice = useCallback(async () => {
    const query = `
      query {
        EVM(dataset: combined, network: ethereum) {
          DEXTrades(
            where: {Trade: {Currency: {SmartContract: {is: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"}}}}
            orderBy: {descendingByField: "Block_Time"}
            limit: {count: 1}
          ) {
            Trade {
              Price
              PriceInUSD
              Currency {
                Symbol
                Name
              }
            }
            Block {
              Time
            }
          }
        }
      }
    `;
    
    return makeRequest(query);
  }, [makeRequest]);

  const fetchBitcoinBalance = useCallback(async (config) => {
    const query = `
      query GetBitcoinBalance($network: BitcoinNetwork!, $address: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
        Bitcoin(network: $network) {
          Outputs(
            outputAddress: {is: $address}
            limit: {count: $limit, offset: $offset}
            date: {since: $from, till: $till}
            orderBy: {descendingByField: "Block_Date"}
          ) {
            Transaction {
              Hash
            }
            Block {
              Date
              Height
            }
            Value
            OutputScript
            Index
          }
        }
      }
    `;

    const variables = {
      network: config.network,
      address: config.address,
      limit: config.limit,
      offset: config.offset,
      from: config.from,
      till: config.till
    };

    return makeRequest(query, variables);
  }, [makeRequest]);

  return {
    fetchBitcoinPrice,
    fetchBitcoinBalance
  };
};