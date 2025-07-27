import { useEffect, useCallback, useMemo } from 'react';
import { 
  RefreshCwIcon, 
  WalletIcon, 
  TrendingUpIcon,
  TrendingDownIcon,
  ExternalLinkIcon,
  CalendarIcon,
  NetworkIcon,
  InfoIcon,
  AlertCircleIcon,
  CopyIcon
} from 'lucide-react';
import { useApp } from '../hooks/useAppContext';
import { useBitQuery } from '../hooks/useBitQuery';

const BitcoinBalance = () => {
  const { data, isLoading, error, pageConfig } = useApp();
  const { fetchBitcoinBalance, cleanup } = useBitQuery();

  const loadBitcoinBalance = useCallback(() => {
    if (pageConfig) {
      fetchBitcoinBalance(pageConfig);
    }
  }, [fetchBitcoinBalance, pageConfig]);

  useEffect(() => {
    if (pageConfig) {
      loadBitcoinBalance();
    }
    return cleanup;
  }, [loadBitcoinBalance, cleanup, pageConfig]);

  const handleRefresh = useCallback(() => {
    loadBitcoinBalance();
  }, [loadBitcoinBalance]);

  // Processamento dos dados com memoização
  const processedData = useMemo(() => {
    if (!data?.bitcoin) return null;

    const inputs = data.bitcoin.inputs || [];
    const outputs = data.bitcoin.outputs || [];

    // Calcular totais - valores já vêm em BTC da API
    const totalInputValue = inputs.reduce((sum, input) => sum + (input.value || 0), 0);
    const totalOutputValue = outputs.reduce((sum, output) => sum + (output.value || 0), 0);
    const balance = totalOutputValue - totalInputValue;

    // Calcular valores em USD
    const totalInputUSD = inputs.reduce((sum, input) => sum + (parseFloat(input.value_usd) || 0), 0);
    const totalOutputUSD = outputs.reduce((sum, output) => sum + (parseFloat(output.value_usd) || 0), 0);
    const balanceUSD = totalOutputUSD - totalInputUSD;

    return {
      inputs,
      outputs,
      totalInputValue,
      totalOutputValue,
      totalInputUSD,
      totalOutputUSD,
      balance,
      balanceUSD,
      hasInputs: inputs.length > 0,
      hasOutputs: outputs.length > 0,
      totalTransactions: inputs.length + outputs.length
    };
  }, [data]);

  // CORRIGIDO: A API já retorna valores em BTC, não precisamos dividir por 100.000.000
  const formatBTC = useCallback((btcValue) => {
    if (!btcValue && btcValue !== 0) return '0.00000000';
    return Number(btcValue).toFixed(8);
  }, []);

  const formatCurrency = useCallback((value) => {
    if (!value && value !== 0) return '$0.00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Aqui você poderia adicionar um toast de sucesso
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  }, []);

  const truncateAddress = useCallback((address, start = 8, end = 8) => {
    if (!address) return 'N/A';
    if (address.length <= start + end) return address;
    return `${address.slice(0, start)}...${address.slice(-end)}`;
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
            <h3 className="text-lg font-semibold text-gray-900">Carregando balanço Bitcoin</h3>
            <p className="text-gray-600">Analisando transações do endereço...</p>
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
        <div className="text-center py-12">
          <WalletIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum dado encontrado</h3>
          <p className="text-gray-600">Configure os parâmetros na sidebar para consultar um endereço Bitcoin.</p>
        </div>
      </div>
    );
  }

  const { 
    inputs, 
    outputs, 
    totalInputValue, 
    totalOutputValue, 
    totalInputUSD,
    totalOutputUSD,
    balance, 
    balanceUSD,
    hasInputs, 
    hasOutputs,
    totalTransactions 
  } = processedData;

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <WalletIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bitcoin Balance</h1>
              <p className="text-gray-600">Análise de transações do endereço</p>
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

        {/* Address Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Endereço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <WalletIcon className="w-4 h-4" />
                Endereço
              </div>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                  {truncateAddress(pageConfig?.address)}
                </code>
                <button
                  onClick={() => copyToClipboard(pageConfig?.address)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <CopyIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <NetworkIcon className="w-4 h-4" />
                Network
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                {pageConfig?.network || 'bitcoin'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon className="w-4 h-4" />
                Período
              </div>
              <p className="text-sm font-medium">
                {pageConfig?.from ? formatDate(pageConfig.from) : 'Início'} - {' '}
                {pageConfig?.till ? formatDate(pageConfig.till) : 'Fim'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                Total de Transações
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {totalTransactions}
              </p>
            </div>
          </div>
        </div>

        {/* Balance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUpIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Recebido</h3>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-600">
                {formatBTC(totalOutputValue)} BTC
              </p>
              <p className="text-sm text-gray-500">
                {formatCurrency(totalOutputUSD)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDownIcon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Enviado</h3>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-red-600">
                {formatBTC(totalInputValue)} BTC
              </p>
              <p className="text-sm text-gray-500">
                {formatCurrency(totalInputUSD)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                <WalletIcon className={`w-5 h-5 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Balance Atual</h3>
              </div>
            </div>
            <div className="space-y-1">
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {formatBTC(balance)} BTC
              </p>
              <p className="text-sm text-gray-500">
                {formatCurrency(balanceUSD)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ExternalLinkIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Transações</h3>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-900">
                {inputs.length} In / {outputs.length} Out
              </p>
              <p className="text-sm text-gray-500">
                Total: {totalTransactions}
              </p>
            </div>
          </div>
        </div>

        {/* Inputs e Outputs */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingDownIcon className="w-5 h-5 text-red-500" />
                  Inputs ({inputs.length})
                </h2>
                <span className="text-sm text-gray-500">Enviados</span>
              </div>
            </div>
            
            <div className="p-6">
              {!hasInputs ? (
                <div className="text-center py-8">
                  <TrendingDownIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Nenhum input encontrado</p>
                  <p className="text-sm text-gray-400 mt-1">Este endereço não enviou Bitcoin no período consultado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inputs.map((input, index) => (
                    <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Valor Enviado</p>
                          <p className="font-semibold text-red-600">
                            -{formatBTC(input.value)} BTC
                          </p>
                          {input.value_usd && (
                            <p className="text-sm text-gray-500">
                              {formatCurrency(input.value_usd)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Transações</p>
                          <p className="font-medium text-gray-900">{input.count || 0}</p>
                        </div>
                      </div>
                      {input.min_date && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(input.min_date)} - {formatDate(input.max_date)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Outputs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUpIcon className="w-5 h-5 text-green-500" />
                  Outputs ({outputs.length})
                </h2>
                <span className="text-sm text-gray-500">Recebidos</span>
              </div>
            </div>
            
            <div className="p-6">
              {!hasOutputs ? (
                <div className="text-center py-8">
                  <TrendingUpIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Nenhum output encontrado</p>
                  <p className="text-sm text-gray-400 mt-1">Este endereço não recebeu Bitcoin no período consultado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {outputs.map((output, index) => (
                    <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Valor Recebido</p>
                          <p className="font-semibold text-green-600">
                            +{formatBTC(output.value)} BTC
                          </p>
                          {output.value_usd && (
                            <p className="text-sm text-gray-500">
                              {formatCurrency(output.value_usd)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Transações</p>
                          <p className="font-medium text-gray-900">{output.count || 0}</p>
                        </div>
                      </div>
                      {output.min_date && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(output.min_date)} - {formatDate(output.max_date)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mt-8">
          <div className="flex items-start gap-3">
            <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Sobre o Cálculo do Balance</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• <strong>Balance = Total Outputs - Total Inputs</strong></p>
                <p>• Valores são mostrados em BTC diretamente da API BitQuery</p>
                <p>• Os dados são obtidos da blockchain Bitcoin através da API BitQuery</p>
                <p>• Filtros de data permitem análise de períodos específicos</p>
                <p>• Valores em USD são baseados na cotação histórica de cada transação</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinBalance;