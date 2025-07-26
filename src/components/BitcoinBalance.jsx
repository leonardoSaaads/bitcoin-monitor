import { useEffect } from 'react';
import { RefreshCwIcon, WalletIcon, ExternalLinkIcon } from 'lucide-react';
import { useApp } from '../AppContext';
import { useApi } from '../hooks/useApi';

const BitcoinBalance = () => {
  const { data, isLoading, error, pageConfig } = useApp();
  const { fetchBitcoinBalance } = useApi();

  useEffect(() => {
    if (pageConfig) {
      fetchBitcoinBalance(pageConfig);
    }
  }, [fetchBitcoinBalance, pageConfig]);

  const handleRefresh = () => {
    if (pageConfig) {
      fetchBitcoinBalance(pageConfig);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <RefreshCwIcon className="w-6 h-6 animate-spin" />
          <span>Carregando dados do endereço...</span>
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

  const outputs = data?.Bitcoin?.Outputs || [];
  const totalValue = outputs.reduce((sum, output) => sum + (output.Value || 0), 0);

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <WalletIcon className="w-6 h-6 text-orange-500" />
          Bitcoin Balance
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

      {/* Informações do Endereço */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Endereço</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-600 text-sm">Endereço:</span>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
              {pageConfig?.address}
            </p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Network:</span>
            <p className="font-medium capitalize">{pageConfig?.network}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Total de Outputs:</span>
            <p className="font-medium">{outputs.length}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Valor Total:</span>
            <p className="font-medium text-green-600">
              {(totalValue / 100000000).toFixed(8)} BTC
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Últimas Transações</h2>
        </div>
        
        {outputs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <WalletIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma transação encontrada para este endereço.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hash da Transação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bloco
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor (BTC)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Índice
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {outputs.map((output, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-mono text-sm text-blue-600 truncate max-w-xs">
                          {output.Transaction.Hash}
                        </span>
                        <a
                          href={`https://blockstream.info/block/${output.Block.Height}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-gray-400 hover:text-blue-600"
                        >
                          <ExternalLinkIcon className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {(output.Value / 100000000).toFixed(8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {output.Index}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginação */}
      {outputs.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {pageConfig?.offset + 1} até {pageConfig?.offset + outputs.length} resultados
            </div>
            <div className="text-sm text-gray-600">
              Limite por página: {pageConfig?.limit}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Nota:</strong> Os valores são mostrados em satoshis convertidos para BTC (1 BTC = 100,000,000 satoshis). 
          Os dados são obtidos da blockchain Bitcoin através da API BitQuery.
        </p>
      </div>
    </div>
  );
};

export default BitcoinBalance