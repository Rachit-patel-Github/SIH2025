import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import PatientDashboard from "./components/PatientDashboard";
import PractitionerDashboard from "./components/PractitionerDashboard";
import TherapyScheduling from "./components/TherapyScheduling";
import Notifications from "./components/Notifications";
import Progress from "./components/Progress";
import FloatingActionButton from "./components/FloatingActionButton";
import Footer from "./components/Footer";
import AuthContainer from "./components/auth/AuthContainer";
import LandingPage from "./components/LandingPage";
import PractitionerHomePage from "./components/PractitionerHomePage";
import { useAppData } from "./hooks/useAppData";
import ChatbotWidget from "./components/Dashboard/ChatbotWidget"; // ✅ import chatbot

const App = () => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [isMenuSticky, setIsMenuSticky] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Effect to persist authentication state
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("isAuthenticated", "true");
    } else {
      localStorage.removeItem("isAuthenticated");
    }
  }, [isAuthenticated]);

  // Effect to persist user data
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const {
    notifications,
    setNotifications,
    therapySessions,
    patientProgress,
    feedbackData,
  } = useAppData();

  // ✅ Called after login/signup success
  const handleAuthSuccess = (userData) => {
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      userType: userData.userType,
    });
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  // ✅ Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ✅ Utility: Get current role
  const getUserRole = () => {
    return user?.userType || "patient";
  };

  // Redirect to login if not authenticated
  const PrivateRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" state={{ from: location.pathname }} />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && (
        <Header
          userRole={getUserRole()}
          notifications={notifications}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {isAuthenticated && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Navigation />
        </div>
      )}

      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth"
            element={
              !isAuthenticated ? (
                <AuthContainer
                  onAuthSuccess={handleAuthSuccess}
                  onBackToLanding={() => navigate("/")}
                />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                {getUserRole() === "practitioner" ? (
                  <PractitionerDashboard user={user} />
                ) : (
                  <PatientDashboard user={user} />
                )}
              </PrivateRoute>
            }
          />

          <Route
            path="/scheduling"
            element={
              <PrivateRoute>
                <TherapyScheduling
                  userRole={getUserRole()}
                  user={user}
                  therapySessions={therapySessions}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications
                  notifications={notifications}
                  setNotifications={setNotifications}
                  currentUserId={user?._id}
                  currentUserEmail={user?.email}
                  userType={user?.userType}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/progress"
            element={
              <PrivateRoute>
                <Progress
                  patientProgress={patientProgress}
                  feedbackData={feedbackData}
                />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      {isAuthenticated && (
        <>
          <div className="fixed bottom-6 right-6 z-50">
            <ChatbotWidget />
          </div>

          <FloatingActionButton
            showQuickMenu={showQuickMenu}
            setShowQuickMenu={setShowQuickMenu}
            isMenuSticky={isMenuSticky}
            setIsMenuSticky={setIsMenuSticky}
          />
        </>
      )}

      <Footer />
    </div>
  );
};

export default App;
