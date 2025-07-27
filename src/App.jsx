import { AppProvider } from './AppProvider'; // Mudança aqui
import Layout from './components/Layout';

function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}

export default App;