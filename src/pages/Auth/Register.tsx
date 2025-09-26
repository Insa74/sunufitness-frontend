import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient, ApiError } from '../../services/apiClient';
import { API } from '../../config/api';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isFocused, setIsFocused] = useState<Record<string, boolean>>({});

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleFocus(fieldName: string) {
    setIsFocused(prev => ({ ...prev, [fieldName]: true }));
  }

  function handleBlur(fieldName: string) {
    setIsFocused(prev => ({ ...prev, [fieldName]: false }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post(API.endpoints.register, form);
      navigate('/login');
    } catch (err: any) {
      const apiErr = err as ApiError;
      if (apiErr?.errors) setFieldErrors(apiErr.errors);
      setError(apiErr?.message || 'Une erreur est survenue lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  }

  function renderFieldError(name: string) {
    const errs = fieldErrors[name];
    if (!errs || errs.length === 0) return null;
    return <div className="text-xs text-red-600 mt-1 flex items-center space-x-1">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{errs[0]}</span>
    </div>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand/Image Section */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-emerald-700 to-emerald-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center space-x-3">
           
            <span className="text-xl font-bold">SUNU FITNESS</span>
          </div>
          
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4">Commencez votre transformation</h2>
            <p className="text-emerald-100 text-lg opacity-90">
              Rejoignez notre communauté fitness et découvrez un nouveau mode de vie sain avec des coachs experts.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-emerald-100">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Programmes d'entraînement personnalisés</span>
            </div>
            <div className="flex items-center space-x-3 text-emerald-100">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Suivi de progression détaillé</span>
            </div>
            <div className="flex items-center space-x-3 text-emerald-100">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Communauté active et supportive</span>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full -mr-32 -mb-32"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16"></div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 lg:flex-none">
        <div className="mx-auto w-full max-w-2xl lg:w-96">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">Sunu Fitness</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Créer votre compte</h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{' '}
              <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                connectez-vous à votre compte existant
              </Link>
            </p>
          </div>

          <div className="mt-8">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-3 animate-fade-in">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      value={form.first_name}
                      onChange={e => update('first_name', e.target.value)}
                      onFocus={() => handleFocus('first_name')}
                      onBlur={() => handleBlur('first_name')}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400"
                      placeholder="Jean"
                    />
                    <div className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 transition-opacity duration-300 pointer-events-none ${isFocused.first_name ? 'opacity-20' : ''}`}></div>
                  </div>
                  {renderFieldError('first_name')}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      value={form.last_name}
                      onChange={e => update('last_name', e.target.value)}
                      onFocus={() => handleFocus('last_name')}
                      onBlur={() => handleBlur('last_name')}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400"
                      placeholder="Dupont"
                    />
                    <div className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 transition-opacity duration-300 pointer-events-none ${isFocused.last_name ? 'opacity-20' : ''}`}></div>
                  </div>
                  {renderFieldError('last_name')}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      onFocus={() => handleFocus('email')}
                      onBlur={() => handleBlur('email')}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400"
                      placeholder="vous@exemple.com"
                    />
                    <div className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 transition-opacity duration-300 pointer-events-none ${isFocused.email ? 'opacity-20' : ''}`}></div>
                  </div>
                  {renderFieldError('email')}
                </div>

                {/* Password */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      onFocus={() => handleFocus('password')}
                      onBlur={() => handleBlur('password')}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400"
                      placeholder="••••••••"
                    />
                    <div className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 transition-opacity duration-300 pointer-events-none ${isFocused.password ? 'opacity-20' : ''}`}></div>
                  </div>
                  {renderFieldError('password')}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <input
                      value={form.phone}
                      onChange={e => update('phone', e.target.value)}
                      onFocus={() => handleFocus('phone')}
                      onBlur={() => handleBlur('phone')}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400"
                      placeholder="+221 77 123 45 67"
                    />
                    <div className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 transition-opacity duration-300 pointer-events-none ${isFocused.phone ? 'opacity-20' : ''}`}></div>
                  </div>
                </div>

               

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <div className="relative">
                    <input
                      value={form.address}
                      onChange={e => update('address', e.target.value)}
                      onFocus={() => handleFocus('address')}
                      onBlur={() => handleBlur('address')}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400"
                      placeholder="Votre adresse complète"
                    />
                    <div className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 transition-opacity duration-300 pointer-events-none ${isFocused.address ? 'opacity-20' : ''}`}></div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-60 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Création du compte...
                    </div>
                  ) : (
                    'Créer mon compte'
                  )}
                </button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
              </div>
            </form>
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

export default RegisterPage;