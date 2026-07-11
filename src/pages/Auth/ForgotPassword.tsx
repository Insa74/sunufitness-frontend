import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { API } from '../../config/api';

type Step = 'email' | 'code' | 'password' | 'success';

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  // Step 1: Request reset code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post(API.endpoints.password.forgot, { email });
      setStep('code');
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de l\'envoi du code. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code (optional but recommended)
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code || code.length !== 6) {
      setError('Veuillez entrer un code à 6 chiffres.');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post(API.endpoints.password.verifyCode, { email, code });
      setStep('password');
    } catch (err: any) {
      setError(err?.message || 'Code invalide. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password || !passwordConfirmation) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post(API.endpoints.password.reset, {
        email,
        code,
        password,
        password_confirmation: passwordConfirmation,
      });
      setStep('success');
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la réinitialisation. Veuillez réessayer.');
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
            <h2 className="text-4xl font-bold mb-4">Récupération de compte</h2>
            <p className="text-white/80 text-lg opacity-90">
              Pas de souci ! Nous allons vous aider à récupérer l'accès à votre compte en quelques
              étapes simples.
            </p>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-white/80 text-sm">Sécurisé</div>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-white/80 text-sm">Rapide</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full -mr-32 -mb-32"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16"></div>
      </div>

      {/* Right Panel - Form */}
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
            <h2 className="text-3xl font-bold text-gray-900">
              {step === 'email' && 'Mot de passe oublié?'}
              {step === 'code' && 'Vérification du code'}
              {step === 'password' && 'Nouveau mot de passe'}
              {step === 'success' && 'Succès!'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 'email' && 'Entrez votre email pour recevoir un code de réinitialisation'}
              {step === 'code' && 'Entrez le code à 6 chiffres envoyé à votre email'}
              {step === 'password' && 'Créez un nouveau mot de passe sécurisé'}
              {step === 'success' && 'Votre mot de passe a été réinitialisé avec succès'}
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex justify-center items-center px-4 py-3 text-sm font-semibold text-white bg-[#05835e] hover:bg-[#3d6d4f] rounded-xl shadow-sm transition-all duration-200 hover:scale-[1.02]"
              >
                Retour à la connexion
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

            {/* Step 1: Email */}
            {step === 'email' && (
              <form onSubmit={handleRequestCode} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Adresse email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-[#05835e] focus:border-[#05835e] transition-all duration-200"
                      placeholder="vous@exemple.com"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#05835e] hover:bg-[#3d6d4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#05835e] disabled:opacity-60 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {loading ? 'Envoi en cours...' : 'Envoyer le code'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Code Verification */}
            {step === 'code' && (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    Code de vérification
                  </label>
                  <div className="mt-1">
                    <input
                      id="code"
                      name="code"
                      type="text"
                      maxLength={6}
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-[#05835e] focus:border-[#05835e] transition-all duration-200 text-center text-2xl tracking-widest"
                      placeholder="000000"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Code envoyé à {email}
                  </p>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#05835e] hover:bg-[#3d6d4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#05835e] disabled:opacity-60 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {loading ? 'Vérification...' : 'Vérifier le code'}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-sm text-[#05835e] hover:opacity-90 transition-colors"
                  >
                    Renvoyer le code
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 'password' && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Nouveau mot de passe
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-[#05835e] focus:border-[#05835e] transition-all duration-200"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password_confirmation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      required
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-[#05835e] focus:border-[#05835e] transition-all duration-200"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPasswordConfirmation ? (
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
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#05835e] hover:bg-[#3d6d4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#05835e] disabled:opacity-60 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600">
                  Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                </p>
                <Link
                  to="/login"
                  className="inline-flex justify-center items-center w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#05835e] hover:bg-[#3d6d4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#05835e] transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Se connecter
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;
