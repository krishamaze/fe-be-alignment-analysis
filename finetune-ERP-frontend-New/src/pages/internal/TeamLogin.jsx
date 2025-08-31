import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { loginUser, selectAuthStatus } from '@/redux/slice/authSlice';

function TeamLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await dispatch(loginUser({ username, password })).unwrap();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('TeamLogin: Login error:', err);
      setError(err || 'Login failed');
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Add this for development quick login
  const isDev = import.meta.env.DEV;

  const handleDevLogin = async (role = 'system_admin') => {
    try {
      const mockData = {
        username: `dev-${role}`,
        password: 'password',
      };
      await dispatch(loginUser(mockData)).unwrap();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Dev login error:', err);
      setError('Dev login failed');
    }
  };

  return (
    <div className="min-h-app flex items-center justify-center bg-gray-100 px-4 pt-safe-header">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-2 text-center">Team Login</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Sign in with your credentials
        </p>
        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 px-4 py-3 border border-gray-300 rounded text-sm shadow-sm focus:outline-none focus:ring"
            disabled={status === 'loading'}
            required
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded text-sm shadow-sm focus:outline-none focus:ring"
              disabled={status === 'loading'}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm mb-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-keyline mr-2"
              />
              Remember me
            </label>
            <a
              href="#"
              className="text-gray-700 hover:text-keyline hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={`w-full bg-black text-white text-sm font-bold uppercase px-4 py-3 rounded shadow hover:bg-gray-800 transition ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
      {/* Add dev login buttons if in development mode */}
      {isDev && (
        <div className="mt-4 border-t pt-4">
          <p className="text-center text-gray-500 mb-2 text-xs">
            Development Quick Login
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDevLogin('system_admin')}
              className="flex-1 bg-black text-white text-xs px-2 py-1 rounded"
            >
              System Admin
            </button>
            <button
              type="button"
              onClick={() => handleDevLogin('branch_head')}
              className="flex-1 bg-black text-white text-xs px-2 py-1 rounded"
            >
              Branch Head
            </button>
            <button
              type="button"
              onClick={() => handleDevLogin('advisor')}
              className="flex-1 bg-green-600 text-white text-xs px-2 py-1 rounded"
            >
              Advisor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamLogin;
