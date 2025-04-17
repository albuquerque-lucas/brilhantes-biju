import AppRoutes from './AppRoutes';
import { AppProvider } from './AppProviders';

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
