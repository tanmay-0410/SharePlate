import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Donate from './pages/Donate';
import Donations from './pages/Donations';
import DonationDetail from './pages/DonationDetail';
import NGODashboard from './pages/NGODashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import Impact from './pages/Impact';
import Rewards from './pages/Rewards';
import Map from './pages/MapPage';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import About from './pages/About';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={user ? <Dashboard /> : <Login />} />
      <Route path="/register" element={user ? <Dashboard /> : <Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/donate"
        element={
          <ProtectedRoute>
            <Layout>
              <Donate />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/donations"
        element={
          <ProtectedRoute>
            <Layout>
              <Donations />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/donations/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <DonationDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo"
        element={
          <ProtectedRoute allowedRoles={['ngo', 'admin']}>
            <Layout>
              <NGODashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/delivery"
        element={
          <ProtectedRoute allowedRoles={['delivery_partner', 'admin']}>
            <Layout>
              <DeliveryDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/impact"
        element={
          <ProtectedRoute>
            <Layout>
              <Impact />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rewards"
        element={
          <ProtectedRoute>
            <Layout>
              <Rewards />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <Layout>
              <Map />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Development-only route to view the Food Map without authentication */}
      <Route
        path="/map-dev"
        element={
          <Layout>
            <Map />
          </Layout>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <Admin />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
