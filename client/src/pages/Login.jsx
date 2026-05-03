import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoginLeftSide from '../components/LoginLeftSide';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'Admin') navigate('/admin');
      else navigate('/employee');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen flex-row">
      <LoginLeftSide />
      <main className="flex-1 bg-slate-50 flex items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="w-full max-w-md animate-fade-in-relative z-10">
            <h1 className="text-3xl font-semibold text-slate-900">Welcome Back</h1>
            <p className="mt-3 text-slate-500">Sign in to your portal to continue.</p>
          </div>
          {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="you@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full block rounded-2xl bg-indigo-600 px-6 py-4 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
              Sign In
            </button>
          </form>
          <div className="mt-8 text-sm text-slate-500 text-center">
            Don't have an account? <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Sign up</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
