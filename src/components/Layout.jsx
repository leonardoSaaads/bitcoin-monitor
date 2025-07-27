import SideBar from './SideBar';
import BitcoinPrice from './BitcoinPrice';
import BitcoinBalance from './BitcoinBalance';
import { useApp } from '../hooks/useAppContext';

const Layout = () => {
  const { currentPage, setPage, setToken } = useApp();

  const handlePageChange = (page, config) => {
    setPage(page, config);
  };

  const handleTokenChange = (token) => {
    setToken(token);
  };

  const renderMainContent = () => {
    switch (currentPage) {
      case 'price':
        return <BitcoinPrice />;
      case 'balance':
        return <BitcoinBalance />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">₿</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Bitcoin Monitor
              </h2>
              <p className="text-gray-600 mb-4">
                Configure seu token de acesso e selecione uma página para começar
              </p>
              <div className="text-sm text-gray-500">
                <p>• Configure o token da API BitQuery</p>
                <p>• Escolha entre Latest Bitcoin Price ou Bitcoin Balance API</p>
                <p>• Monitore dados em tempo real</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar
        onPageChange={handlePageChange}
        onTokenChange={handleTokenChange}
        currentPage={currentPage}
      />
      {renderMainContent()}
    </div>
  );
};

export default Layout;