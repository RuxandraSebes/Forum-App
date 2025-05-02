import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* alte rute vor fi adăugate aici */}
      </Routes>
    </Router>
  );
}

export default App;
