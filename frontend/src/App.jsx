import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import CarDetails from './pages/CarDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Feedback from './pages/Feedback';
import Favorites from './pages/Favorites';
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/admin/Dashboard';
import CreateCar from './pages/admin/CreateCar';
import LegalPage from './pages/LegalPage';
import TermsPage from './pages/TermsPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 relative overflow-hidden">
        {/* Global Ambient Background for Light Mode */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Sporty Red/Black Ambient Glow */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-600/10 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gray-900/5 blur-[120px]"></div>
        </div>
        <Navbar />
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/:id" element={<PublicProfile />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/favorites" element={<Favorites />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/admin/create-car" element={<AdminRoute><CreateCar /></AdminRoute>} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
