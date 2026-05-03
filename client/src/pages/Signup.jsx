import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoginLeftSide from '../components/LoginLeftSide';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen flex-row font-sans">
      <LoginLeftSide />
      <main className="flex-1 bg-[#f8fafc] flex items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-md rounded-[32px] border border-gray-100 bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-full max-w-md z-10 mb-6">
            <h1 className="text-[32px] font-bold text-slate-900 tracking-tight">Create Account</h1>
            <p className="mt-2 text-[15px] text-slate-500 font-medium">Join the workspace to manage tasks.</p>
          </div>
          
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-[14px] border border-gray-200 px-5 py-3 text-slate-900 focus:border-[#5b45ff] focus:ring-1 focus:ring-[#5b45ff] outline-none transition-all sm:text-sm font-medium placeholder-slate-400" placeholder="Full Name" />
            </div>
            <div>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-[14px] border border-gray-200 px-5 py-3 text-slate-900 focus:border-[#5b45ff] focus:ring-1 focus:ring-[#5b45ff] outline-none transition-all sm:text-sm font-medium placeholder-slate-400" placeholder="Email Address" />
            </div>
            <div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-[14px] border border-gray-200 px-5 py-3 text-slate-900 focus:border-[#5b45ff] focus:ring-1 focus:ring-[#5b45ff] outline-none transition-all sm:text-sm font-medium placeholder-slate-400" placeholder="Password" />
            </div>
            <div>
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="block w-full rounded-[14px] border border-gray-200 px-5 py-3 text-slate-900 focus:border-[#5b45ff] focus:ring-1 focus:ring-[#5b45ff] outline-none transition-all sm:text-sm font-medium bg-white">
                <option value="Member">Member / Employee</option>
                <option value="Admin">Admin / Manager</option>
              </select>
            </div>
            
            <button type="submit" className="w-full mt-4 block rounded-[14px] bg-[#5b45ff] px-6 py-4 text-center text-[15px] font-semibold text-white shadow-sm hover:bg-[#4a35f0] transition-colors">
              Sign Up
            </button>
          </form>
          
          <div className="mt-6 text-[13px] text-slate-500 text-center font-medium">
            Already have an account? <Link to="/login" className="text-[#5b45ff] font-semibold hover:underline">Sign in</Link>.
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
