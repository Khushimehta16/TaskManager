import { Link } from 'react-router-dom'
import LoginLeftSide from "../components/LoginLeftSide"

const LoginLanding = () => {
  return (
    <div className="flex min-h-screen flex-row">
      <LoginLeftSide />
      <main className="flex-1 bg-slate-50 flex items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="w-full max-w-md animate-fade-in-relative z-10">
            <h1 className="text-3xl font-semibold text-slate-900">Welcome Back</h1>
            <p className="mt-3 text-slate-500">Choose your portal and sign in to continue.</p>
          </div>
          <div className="space-y-4 mt-6">
            <Link
              to="/login/admin"
              className="block rounded-2xl bg-indigo-600 px-6 py-4 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Admin Portal
            </Link>
            <Link
              to="/login/employee"
              className="block rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center text-sm font-semibold text-slate-900 hover:border-slate-300"
            >
              Employee Portal
            </Link>
          </div>
          <div className="mt-8 text-sm text-slate-500">
            If you already have credentials, use the portal links above.
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginLanding
