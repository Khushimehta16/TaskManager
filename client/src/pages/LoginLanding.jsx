import { Link } from 'react-router-dom';
import LoginLeftSide from '../components/LoginLeftSide';

const LoginLanding = () => {
  return (
    <div className="flex min-h-screen flex-row font-sans">
      <LoginLeftSide />
      <main className="flex-1 bg-[#f8fafc] flex items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-md rounded-[32px] border border-gray-100 bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-full max-w-md z-10 mb-6">
            <h1 className="text-[32px] font-bold text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-[15px] text-slate-500 font-medium">Choose your portal and sign in to continue.</p>
          </div>
          
          <div className="space-y-4">
            <Link
              to="/login"
              className="block w-full rounded-[14px] bg-[#5b45ff] px-6 py-4 text-center text-[15px] font-semibold text-white shadow-sm hover:bg-[#4a35f0] transition-colors"
            >
              Admin Portal
            </Link>
            <Link
              to="/login"
              className="block w-full rounded-[14px] border border-gray-200 bg-white px-6 py-4 text-center text-[15px] font-semibold text-slate-900 hover:border-gray-300 transition-colors"
            >
              Employee Portal
            </Link>
          </div>
          
          <div className="mt-8 text-[13px] text-slate-500 text-center font-medium">
            If you already have credentials, use the portal links above.
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginLanding;
