import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import LoadingScreen from "../components/LoadingScreen";

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);
  const [authData, setAuthData] = useState({ phoneNumber: null, confirmationResult: null });

  // Function to set phone authentication data
  const setPhoneAuthData = (phoneNumber, confirmationResult) => {
    setAuthData({ phoneNumber, confirmationResult });
  };

  // Effect to listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuthState(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  // Render LoadingScreen until auth state is loaded
  if (loadingAuthState) {
    return <LoadingScreen />;
  }

  // Context value
  const contextValue = {
    user,
    loadingAuthState,
    authData,
    setPhoneAuthData,
  };

  // Render AuthContext.Provider with context value and children
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export AuthProvider and AuthContext
export { AuthProvider, AuthContext };
