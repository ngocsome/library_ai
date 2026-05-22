import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout'; // Will create a wrapper layout if needed, or just route directly

import Login from '../pages/Login';
import Register from '../pages/Register';
import Library from '../pages/Library';
import Forum from '../pages/Forum';
import Groups from '../pages/Groups';
import Profile from '../pages/Profile';
import AIChat from '../pages/AIChat';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Library />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai" element={<AIChat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
