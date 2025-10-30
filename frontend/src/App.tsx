import { Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Assuming this component exists in src/components/

// Import your page components
import MainPage from './pages/MainPage';
import SearchPage from './pages/SearchPage';
import SelectDatePage from './pages/SelectDatePage';
import SelectTimePage from './pages/SelectTimePage';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutWithDetailsPage from './pages/CheckoutWithDetailsPage';
import ConfirmationPage from './pages/ConfirmationPage';

// The Layout component renders the full-width Header, 
// and wraps the main content in a max-width container with padding.
const Layout = ({ children }: { children: React.ReactNode }) => (
  // The min-h-screen and overall background styles
  <div className="min-h-screen bg-gray-50">

    {/* 1. Header: Rendered outside the max-width container to span full width */}
    <Header />

    {/* 2. Main Content Wrapper: Contains the content of the current page, centered with padding */}
    <main className="max-w-6xl mx-auto p-4 space-y-8">
      {children}
    </main>
  </div>
);

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/date" element={<SelectDatePage />} />
        <Route path="/time" element={<SelectTimePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/details" element={<CheckoutWithDetailsPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />

        <Route path="*" element={<h2 className="text-xl text-red-500 text-center">404 - Page Not Found</h2>} />
      </Routes>
    </Layout>
  );
}