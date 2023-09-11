import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./views/home";
import LoginViews from "./views/login";
import RegisterViews from "./views/register";
function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem("authorization");
    return !!token; // Returns true if token exists, false otherwise
  };

  const renderLoginOrDashboard = () => {
    if (!isAuthenticated()) {
   
      return <LoginViews />;
    } else {
  
      return <Home />;
    }
  };
  return (
    <Routes>
      <Route Route path="/" element={renderLoginOrDashboard()} />
      <Route Route path="/dashboard" element={<Home />} />
      <Route Route path="/login" element={<LoginViews />} />
      <Route Route path="/register" element={<RegisterViews />} />
    </Routes>
  );
}

export default App;
