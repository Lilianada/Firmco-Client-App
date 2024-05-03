import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Auth/Register";
import LoadingScreen from "./components/LoadingScreen";
import { useAuth } from "./context/authContext";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ChangePassword from "./pages/Auth/ChangePassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import AuthAction from "./pages/Auth/AuthAction";
import KycForm from "./pages/Auth/KYC";
import Skeleton from "./components/Skeleton";
import WelcomePage from "./pages/Auth/WelcomePage";
import ProtectedRoute from "./protectedRoute";
import Dashboard from "./components/Dashboard";
import AccountsOverview from "./pages/Accounts";
import BondCards from "./pages/Bonds";
import IposCards from "./pages/Ipos";
import FixedTerms from "./pages/FixedTerm";
import MarketAnalysis from "./pages/MarketAnalysis";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";

function App() {
  const { loadingAuthState } = useAuth();
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route index path="/sign-up" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth-action" element={<AuthAction />} />
          <Route path="/onboard" element={<WelcomePage />} />
          <Route path="/kyc-form" element={<KycForm />} />
          <Route path="/dashboard/" element={<Skeleton />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-accounts"
              element={
                <ProtectedRoute>
                  <AccountsOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="bonds"
              element={
                <ProtectedRoute>
                  <BondCards />
                </ProtectedRoute>
              }
            />
            <Route
              path="ipos"
              element={
                <ProtectedRoute>
                  <IposCards />
                </ProtectedRoute>
              }
            />
            <Route
              path="fixed-terms"
              element={
                <ProtectedRoute>
                  <FixedTerms />
                </ProtectedRoute>
              }
            />
            <Route
              path="market-analysis"
              element={
                <ProtectedRoute>
                  <MarketAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
      {loadingAuthState && <LoadingScreen />}
    </div>
  );
}

export default App;
