import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import Layout from './components/Layout';
import ToastContainer from './components/Toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';
import CreateUser from './pages/CreateUser';
import EditUser from './pages/EditUser';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin & Manager Routes */}
            <Route
              path="/users"
              element={
                <RoleGuard allowedRoles={['admin', 'manager']}>
                  <UserList />
                </RoleGuard>
              }
            />
            <Route
              path="/users/:id"
              element={
                <RoleGuard allowedRoles={['admin', 'manager']}>
                  <UserDetail />
                </RoleGuard>
              }
            />
            <Route
              path="/users/:id/edit"
              element={
                <RoleGuard allowedRoles={['admin', 'manager']}>
                  <EditUser />
                </RoleGuard>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="/users/create"
              element={
                <RoleGuard allowedRoles={['admin']}>
                  <CreateUser />
                </RoleGuard>
              }
            />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
