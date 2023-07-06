import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import Error from './components/Error';
import Lobby from './components/Lobby';
import Chat from './components/Chat';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import { ForgotPassword, ResetPassword } from './components/ForgotPassword';

function App() {
  return (
    <>
    <Router>
      <Routes>
      <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute/>}>
          <Route element={<Profile/>} path="/profile" />
          <Route element={<Lobby />} path="/" />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
    </>
  )
}

export default App