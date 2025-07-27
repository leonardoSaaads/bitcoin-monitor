import { useEffect, useCallback, useMemo } from 'react';
import { 
  RefreshCwIcon, 
  TrendingUpIcon, 
  DollarSignIcon,
  CalendarIcon,
  InfoIcon,
  AlertCircleIcon 
} from 'lucide-react';
import { useApp } from '../hooks/useAppContext';
import { useBitQuery } from '../hooks/useBitQuery';

const BitcoinPrice = () => {
  const { data, isLoading, error, pageConfig } = useApp();
  const { fetchBitcoinPrice, cleanup } = useBitQuery();

  const loadBitcoinPrice = useCallback(() => {
    const date = pageConfig?.date || new Date().toISOString().split('T')[0];
    fetchBitcoinPrice(date);
  }, [fetchBitcoinPrice, pageConfig]);

  useEffect(() => {
    loadBitcoinPrice();
    return cleanup; // Cleanup ao desmontar
  }, [loadBitcoinPrice, cleanup]);

  const handleRefresh = useCallback(() => {
    loadBitcoinPrice();
  }, [loadBitcoinPrice]);

  // Processamento dos dados com memoização
  const processedData = useMemo(() => {
    const outputs = data?.bitcoin?.outputs || [];
    const firstOutput = outputs[0];
    
    if (!firstOutput) return null;

    return {
      outputs,
      mainPrice: firstOutput,
      hasMultipleOutputs: outputs.length > 1,
      totalOutputs: outputs.length
    };
  }, [data]);

  const formatCurrency = useCallback((value) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(Number(value));
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateString));
  }, []);

  // Estados de carregamento e erro
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <RefreshCwIcon className="w-12 h-12 text-blue-600 animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Carregando preço do Bitcoin</h3>
            <p className="text-gray-600">Consultando dados da BitQuery...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <AlertCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold mb-2">Erro ao carregar dados</h3>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  <RefreshCwIcon className="w-4 h-4" />
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!processedData) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <InfoIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-yellow-800 font-semibold mb-2">Nenhum dado encontrado</h3>
                <p className="text-yellow-600 text-sm mb-4">
                  Não foi possível obter o preço do Bitcoin para a data selecionada.
                </p>
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                >
                  <RefreshCwIcon className="w-4 h-4" />
                  Atualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { mainPrice, outputs, hasMultipleOutputs, totalOutputs } = processedData;
  const selectedDate = pageConfig?.date || new Date().toISOString().split('T')[0];

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUpIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Preço do Bitcoin</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {formatDate(selectedDate)}
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <RefreshCwIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>

        {/* Main Price Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-lg">
                <DollarSignIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Preço Principal</h2>
                <p className="text-sm text-gray-600">Valor em USD</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {formatCurrency(mainPrice.usd)}
            </div>
            <div className="text-sm text-gray-500">
              {mainPrice.value || 'N/A'} BTC
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes da Consulta</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Data:</span>
                <span className="font-medium">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Valor Base:</span>
                <span className="font-medium">{mainPrice.value || 'N/A'} BTC</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Expressão:</span>
                <span className="font-medium text-xs">{mainPrice.expression || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Total de Outputs:</span>
                <span className="font-medium">{totalOutputs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multiple Outputs Table */}
        {hasMultipleOutputs && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Todos os Outputs ({totalOutputs})
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Lista completa de outputs para {formatDate(selectedDate)}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Valor (BTC)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Valor (USD)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Expressão
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {outputs.slice(0, 20).map((output, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {output.value || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(output.usd)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">
                        {output.expression || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {outputs.length > 20 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Mostrando 20 de {totalOutputs} outputs. Use filtros para refinar os resultados.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Sobre os Dados</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Os dados são obtidos através da API GraphQL da BitQuery</p>
                <p>• Os preços são históricos e podem variar conforme a data selecionada</p>
                <p>• Valores em USD são calculados baseados na taxa de câmbio da data consultada</p>
                <p>• Múltiplos outputs podem existir para uma única data devido a diferentes transações</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinPrice;