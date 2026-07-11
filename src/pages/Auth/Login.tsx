import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { API } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post<{
        access_token: string;
        refresh_token: string;
        token_type?: string;
        user: any;
      }>(API.endpoints.login, { email, password });
      if (!res?.access_token || !res?.refresh_token || !res?.user) {
        throw { message: 'Réponse invalide du serveur.' };
      }
      setAuth(res.access_token, res.refresh_token, res.user);

      // Check if user was trying to select a service before login
      const serviceId =
        (location.state as any)?.serviceId || sessionStorage.getItem('selectedService');
      if (serviceId) {
        // Clear the stored service selection
        sessionStorage.removeItem('selectedService');
        // Redirect to payment with the selected service
        navigate('/payment', { state: { serviceId }, replace: true });
        return;
      }

      // Default redirect behavior
      const from = (location.state as any)?.from || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err?.message || 'Identifiants invalides. Veuillez réessayer.';
      // Check if the error is about inactive account
      if (msg.toLowerCase().includes("n'est pas actif") || msg.toLowerCase().includes('pas actif')) {
        setShowInactiveModal(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand/Image Section */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-[#05835e] to-[#05835e] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"></div>
            <span className="text-xl font-bold">SUNUFITNESS</span>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4">Transformez votre potentiel en performance</h2>
            <p className="text-white/80 text-lg opacity-90">
              Rejoignez notre communauté de sportifs passionnés et accédez à des programmes
              d'entraînement personnalisés.
            </p>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              {/* <div className="text-2xl font-bold mb-1">5000+</div> */}
              <div className="text-white/80 text-sm">Membres actifs</div>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              {/* <div className="text-2xl font-bold mb-1">50+</div> */}
              <div className="text-white/80 text-sm">Coach experts</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full -mr-32 -mb-32"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16"></div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 lg:flex-none">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">SUNUFITNESS</span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900">Connectez-vous</h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{' '}
              <Link
                to="/register"
                className="font-medium text-[#05835e] hover:opacity-90 transition-colors"
              >
                créez un nouveau compte
              </Link>
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex justify-center items-center px-4 py-3 text-sm font-semibold text-white bg-[#05835e] hover:bg-[#3d6d4f] rounded-xl shadow-sm transition-all duration-200 hover:scale-[1.02]"
              >
                Découvrir la plateforme
              </Link>
            </div>
          </div>

          <div className="mt-8">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-3 animate-fade-in">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, email: true })}
                    onBlur={() => setIsFocused({ ...isFocused, email: false })}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-[#05835e] focus:border-[#05835e] transition-all duration-200"
                    placeholder="vous@exemple.com"
                  />
                  <div
                    className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-[#05835e] to-[#05835e] opacity-0 transition-opacity duration-300 pointer-events-none ${isFocused.email ? 'opacity-20' : ''}`}
                  ></div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, password: true })}
                    onBlur={() => setIsFocused({ ...isFocused, password: false })}
                    className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-[#05835e] focus:border-[#05835e] transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors z-10"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  <div
                    className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-[#05835e] to-[#05835e] opacity-0 transition-opacity duration-300 pointer-events-none ${isFocused.password ? 'opacity-20' : ''}`}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-[#05835e] hover:opacity-90 transition-colors"
                  >
                    Mot de passe oublié?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#05835e] hover:bg-[#3d6d4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#05835e] disabled:opacity-60 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Connexion...
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Inactive Account Modal */}
      {showInactiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-scale-in">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Compte non activé
            </h3>

            {/* Message */}
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                Votre compte n'est pas encore actif.
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-emerald-800 font-semibold mb-2">
                   Action requise
                </p>
                <p className="text-emerald-700 text-sm">
                  Veuillez vous rendre à la salle de sport pour effectuer votre paiement et activer votre compte.
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 text-center">
                Une fois le paiement effectué, votre compte sera activé immédiatement et vous pourrez accéder à tous nos services.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowInactiveModal(false)}
              className="w-full py-3 px-4 bg-[#05835e] hover:bg-[#3d6d4f] text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#05835e]"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
