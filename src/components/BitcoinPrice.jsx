import { useEffect } from 'react';
import { RefreshCwIcon, TrendingUpIcon, DollarSignIcon } from 'lucide-react';
import { useApp } from '../AppContext';
import { useApi } from '../hooks/useApi';

const BitcoinPrice = () => {
  const { data, isLoading, error } = useApp();
  const { fetchBitcoinPrice } = useApi();

  useEffect(() => {
    fetchBitcoinPrice();
  }, [fetchBitcoinPrice]);

  const handleRefresh = () => {
    fetchBitcoinPrice();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <RefreshCwIcon className="w-6 h-6 animate-spin" />
          <span>Carregando preço do Bitcoin...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Erro ao carregar dados</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const trade = data?.EVM?.DEXTrades?.[0];

  if (!trade) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-semibold mb-2">Nenhum dado encontrado</h3>
          <p className="text-yellow-600 text-sm">Não foi possível obter o preço atual do Bitcoin.</p>
          <button
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm"
          >
            Atualizar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUpIcon className="w-6 h-6 text-orange-500" />
          Preço Atual do Bitcoin
        </h1>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCwIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preço Principal */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center gap-3 mb-4">
            <DollarSignIcon className="w-8 h-8 text-green-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Preço em USD</h2>
              <p className="text-sm text-gray-600">Último preço negociado</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600">
            ${trade.Trade.PriceInUSD ? Number(trade.Trade.PriceInUSD).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }) : 'N/A'}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes da Negociação</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Moeda:</span>
              <span className="font-medium">{trade.Trade.Currency.Symbol} ({trade.Trade.Currency.Name})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Preço Base:</span>
              <span className="font-medium">{trade.Trade.Price || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Última Atualização:</span>
              <span className="font-medium">
                {trade.Block.Time ? new Date(trade.Block.Time).toLocaleString('pt-BR') : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Nota:</strong> Os preços são obtidos através de negociações em DEX (Exchanges Descentralizadas) 
          e podem não refletir exatamente o preço em exchanges centralizadas. Os dados são atualizados em tempo real.
        </p>
      </div>
    </div>
  );
};

export default BitcoinPrice;