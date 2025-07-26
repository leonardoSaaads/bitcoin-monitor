import { useState } from 'react';
import { ChevronRightIcon, KeyIcon, BitcoinIcon, TrendingUpIcon } from 'lucide-react';

const SideBar = ({ onPageChange, onTokenChange, currentPage }) => {
  const [token, setToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [balanceConfig, setBalanceConfig] = useState({
    limit: 10,
    offset: 0,
    network: 'bitcoin',
    address: '',
    from: null,
    till: null,
    dateFormat: '%Y-%m-%d'
  });

  const handleTokenSubmit = () => {
    if (token.trim()) {
      setIsTokenSet(true);
      setShowTokenInput(false);
      onTokenChange(token.trim());
    }
  };

  const handlePageSelect = (page, config = null) => {
    if (isTokenSet) {
      onPageChange(page, config);
    }
  };

  const handleBalanceConfigChange = (field, value) => {
    setBalanceConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBalanceSubmit = () => {
    if (balanceConfig.address.trim()) {
      handlePageSelect('balance', balanceConfig);
    }
  };

  return (
    <div className="w-80 bg-gray-900 text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BitcoinIcon className="w-6 h-6 text-orange-500" />
          Bitcoin Monitor
        </h1>
      </div>

      {/* Token Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-300">API Token</h2>
          <div className={`w-2 h-2 rounded-full ${isTokenSet ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        
        {!isTokenSet && (
          <button
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="w-full flex items-center gap-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
          >
            <KeyIcon className="w-4 h-4" />
            <span className="text-sm">Configurar Token</span>
            <ChevronRightIcon className={`w-4 h-4 ml-auto transition-transform ${showTokenInput ? 'rotate-90' : ''}`} />
          </button>
        )}

        {showTokenInput && (
          <div className="mt-3 space-y-3">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Bearer token..."
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleTokenSubmit}
              className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
            >
              Salvar Token
            </button>
          </div>
        )}

        {isTokenSet && (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Token configurado
            <button
              onClick={() => {
                setIsTokenSet(false);
                setToken('');
                setShowTokenInput(true);
              }}
              className="ml-auto text-gray-400 hover:text-white text-xs"
            >
              Alterar
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Páginas</h3>
        
        {/* Latest Bitcoin Price */}
        <button
          onClick={() => handlePageSelect('price')}
          disabled={!isTokenSet}
          className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors mb-3 ${
            currentPage === 'price' 
              ? 'bg-blue-600 text-white' 
              : isTokenSet 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          <TrendingUpIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Latest Bitcoin Price</span>
        </button>

        {/* Bitcoin Balance API */}
        <div className="space-y-3">
          <div className={`p-3 rounded-md ${
            currentPage === 'balance' ? 'bg-blue-600' : 'bg-gray-800'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <BitcoinIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Bitcoin Balance API</span>
            </div>
            
            {isTokenSet && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={balanceConfig.limit}
                    onChange={(e) => handleBalanceConfigChange('limit', parseInt(e.target.value) || 10)}
                    placeholder="Limit"
                    className="p-2 bg-gray-700 border border-gray-600 rounded text-xs focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={balanceConfig.offset}
                    onChange={(e) => handleBalanceConfigChange('offset', parseInt(e.target.value) || 0)}
                    placeholder="Offset"
                    className="p-2 bg-gray-700 border border-gray-600 rounded text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <input
                  type="text"
                  value={balanceConfig.network}
                  onChange={(e) => handleBalanceConfigChange('network', e.target.value)}
                  placeholder="Network"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-xs focus:outline-none focus:border-blue-500"
                />
                
                <input
                  type="text"
                  value={balanceConfig.address}
                  onChange={(e) => handleBalanceConfigChange('address', e.target.value)}
                  placeholder="Bitcoin Address"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-xs focus:outline-none focus:border-blue-500"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={balanceConfig.from || ''}
                    onChange={(e) => handleBalanceConfigChange('from', e.target.value || null)}
                    className="p-2 bg-gray-700 border border-gray-600 rounded text-xs focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={balanceConfig.till || ''}
                    onChange={(e) => handleBalanceConfigChange('till', e.target.value || null)}
                    className="p-2 bg-gray-700 border border-gray-600 rounded text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <button
                  onClick={handleBalanceSubmit}
                  disabled={!balanceConfig.address.trim()}
                  className="w-full p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-xs font-medium transition-colors"
                >
                  Consultar Balance
                </button>
              </div>
            )}
            
            {!isTokenSet && (
              <p className="text-xs text-gray-500">Configure o token primeiro</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;