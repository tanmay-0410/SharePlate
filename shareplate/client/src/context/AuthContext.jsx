import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI
        .getMe()
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    toast.success('Welcome back!');
    return res.data;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    toast.success('Account created successfully!');
    return res.data;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const res = await authAPI.firebaseAuth({
      firebaseUid: result.user.uid,
      name: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
    });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    toast.success('Welcome!');
    return res.data;
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    try {
      await firebaseSignOut(auth);
    } catch {}
    toast.success('Logged out');
  };

  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, loginWithGoogle, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
