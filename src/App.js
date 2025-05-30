import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from "./pages/Login"
import Register from "./pages/Register";
import ModeratorPage from './pages/ModeratorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/moderator" element={<ModeratorPage />} />
         </Routes>
    </Router>
  );
}

export default App;
