import { useState, useCallback } from 'react';
import { 
  ChevronRightIcon, 
  KeyIcon, 
  BitcoinIcon, 
  TrendingUpIcon,
  EyeIcon,
  EyeOffIcon,
  CalendarIcon,
  WalletIcon
} from 'lucide-react';

const SideBar = ({ onPageChange, onTokenChange, currentPage }) => {
  const [token, setToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [showToken, setShowToken] = useState(false);
  
  // Configuração para Bitcoin Price
  const [priceConfig, setPriceConfig] = useState({
    date: new Date().toISOString().split('T')[0]
  });
  
  // Configuração para Bitcoin Balance
  const [balanceConfig, setBalanceConfig] = useState({
    limit: 10,
    offset: 0,
    network: 'bitcoin',
    address: '',
    from: '',
    till: '',
    dateFormat: '%Y-%m-%d'
  });

  const handleTokenSubmit = useCallback(() => {
    if (token.trim()) {
      setIsTokenSet(true);
      setShowTokenInput(false);
      onTokenChange(token.trim());
    }
  }, [token, onTokenChange]);

  const handlePageSelect = useCallback((page, config = null) => {
    if (isTokenSet) {
      onPageChange(page, config);
    }
  }, [isTokenSet, onPageChange]);

  const handlePriceConfigChange = useCallback((field, value) => {
    setPriceConfig(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleBalanceConfigChange = useCallback((field, value) => {
    setBalanceConfig(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handlePriceSubmit = useCallback(() => {
    handlePageSelect('price', priceConfig);
  }, [handlePageSelect, priceConfig]);

  const handleBalanceSubmit = useCallback(() => {
    if (balanceConfig.address.trim()) {
      handlePageSelect('balance', balanceConfig);
    }
  }, [handlePageSelect, balanceConfig]);

  const resetToken = useCallback(() => {
    setIsTokenSet(false);
    setToken('');
    setShowTokenInput(true);
    setShowToken(false);
  }, []);

  return (
    <div className="w-80 bg-gray-900 text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BitcoinIcon className="w-6 h-6 text-orange-500" />
          Bitcoin Monitor
        </h1>
        <p className="text-sm text-gray-400 mt-1">BitQuery API Monitor</p>
      </div>

      {/* Token Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <KeyIcon className="w-4 h-4" />
            API Token
          </h2>
          <div className={`w-2 h-2 rounded-full ${isTokenSet ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        
        {!isTokenSet && (
          <button
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="w-full flex items-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 group"
          >
            <KeyIcon className="w-4 h-4 group-hover:text-blue-400" />
            <span className="text-sm">Configurar Token</span>
            <ChevronRightIcon className={`w-4 h-4 ml-auto transition-transform duration-200 ${showTokenInput ? 'rotate-90' : ''}`} />
          </button>
        )}

        {showTokenInput && (
          <div className="mt-3 space-y-3 animate-in fade-in duration-200">
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Bearer token..."
                className="w-full p-3 pr-10 bg-gray-800 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showToken ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={handleTokenSubmit}
              disabled={!token.trim()}
              className="w-full p-3 bg-blue-400 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
            >
              Salvar Token
            </button>
          </div>
        )}

        {isTokenSet && (
          <div className="flex items-center gap-2 text-sm text-green-400 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="flex-1">Token configurado</span>
            <button
              onClick={resetToken}
              className="text-gray-400 hover:text-white text-xs px-2 py-1 hover:bg-gray-700 rounded transition-colors"
            >
              Alterar
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Consultas Disponíveis</h3>
        
        {/* Bitcoin Price Query */}
        <div className="mb-6">
          <div className={`p-4 rounded-lg transition-all duration-200 ${
            currentPage === 'price' 
              ? 'bg-blue-600 shadow-lg' 
              : 'bg-gray-800 hover:bg-gray-750'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUpIcon className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Bitcoin Price</span>
            </div>
            
            {isTokenSet && (
              <div className="space-y-3">
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={priceConfig.date}
                    onChange={(e) => handlePriceConfigChange('date', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <button
                  onClick={handlePriceSubmit}
                  className="w-full p-2 bg-blue-400 hover:bg-blue-600 rounded-lg text-xs font-medium transition-colors"
                >
                  Consultar Preço
                </button>
              </div>
            )}
            
            {!isTokenSet && (
              <p className="text-xs text-gray-500">Configure o token primeiro</p>
            )}
          </div>
        </div>

        {/* Bitcoin Balance Query */}
        <div className="mb-6">
          <div className={`p-4 rounded-lg transition-all duration-200 ${
            currentPage === 'balance' 
              ? 'bg-blue-600 shadow-lg' 
              : 'bg-gray-800 hover:bg-gray-750'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <WalletIcon className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Bitcoin Balance</span>
            </div>
            
            {isTokenSet && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={balanceConfig.limit}
                    onChange={(e) => handleBalanceConfigChange('limit', parseInt(e.target.value) || 10)}
                    placeholder="Limit"
                    min="1"
                    max="100"
                    className="p-2 bg-gray-700 border border-gray-600 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={balanceConfig.offset}
                    onChange={(e) => handleBalanceConfigChange('offset', parseInt(e.target.value) || 0)}
                    placeholder="Offset"
                    min="0"
                    className="p-2 bg-gray-700 border border-gray-600 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={balanceConfig.network}
                  onChange={(e) => handleBalanceConfigChange('network', e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="bitcoin">Bitcoin</option>
                  <option value="bitcoin_cash">Bitcoin Cash</option>
                  <option value="litecoin">Litecoin</option>
                </select>
                
                <input
                  type="text"
                  value={balanceConfig.address}
                  onChange={(e) => handleBalanceConfigChange('address', e.target.value)}
                  placeholder="Bitcoin Address (ex: bc1p...)"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Data Início</label>
                    <input
                      type="date"
                      value={balanceConfig.from}
                      onChange={(e) => handleBalanceConfigChange('from', e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Data Fim</label>
                    <input
                      type="date"
                      value={balanceConfig.till}
                      onChange={(e) => handleBalanceConfigChange('till', e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleBalanceSubmit}
                  disabled={!balanceConfig.address.trim()}
                  className="w-full p-2 bg-blue-400 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition-colors"
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

      {/* Footer */}
      <div className="p-6 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          Powered by BitQuery GraphQL API
        </p>
      </div>
    </div>
  );
};

export default SideBar;