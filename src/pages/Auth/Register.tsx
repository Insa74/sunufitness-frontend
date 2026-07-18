import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient, ApiError } from '../../services/apiClient';
import { API } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const PHONE_CONFIGS = {
  DZ: { countryName: 'Algeria', countryCode: '+213', nsnLength: '8-9', regex: '^\\d{8,9}$' },
  EG: { countryName: 'Egypt', countryCode: '+20', nsnLength: '9-10', regex: '^\\d{9,10}$' },
  LY: { countryName: 'Libya', countryCode: '+218', nsnLength: '8-9', regex: '^\\d{8,9}$' },
  MA: { countryName: 'Morocco', countryCode: '+212', nsnLength: '9', regex: '^\\d{9}$' },
  SD: { countryName: 'Sudan', countryCode: '+249', nsnLength: '9', regex: '^\\d{9}$' },
  TN: { countryName: 'Tunisia', countryCode: '+216', nsnLength: '8', regex: '^\\d{8}$' },
  EH: { countryName: 'Western Sahara', countryCode: '+212', nsnLength: '9', regex: '^\\d{9}$' },
  BJ: { countryName: 'Benin', countryCode: '+229', nsnLength: '8', regex: '^\\d{8}$' },
  BF: { countryName: 'Burkina Faso', countryCode: '+226', nsnLength: '8', regex: '^\\d{8}$' },
  CV: { countryName: 'Cape Verde', countryCode: '+238', nsnLength: '7', regex: '^\\d{7}$' },
  CI: { countryName: 'Côte d’Ivoire', countryCode: '+225', nsnLength: '10', regex: '^\\d{10}$' },
  GM: { countryName: 'Gambia', countryCode: '+220', nsnLength: '7', regex: '^\\d{7}$' },
  GH: { countryName: 'Ghana', countryCode: '+233', nsnLength: '9', regex: '^\\d{9}$' },
  GN: { countryName: 'Guinea', countryCode: '+224', nsnLength: '8', regex: '^\\d{8}$' },
  GW: { countryName: 'Guinea-Bissau', countryCode: '+245', nsnLength: '7', regex: '^\\d{7}$' },
  LR: { countryName: 'Liberia', countryCode: '+231', nsnLength: '7-8', regex: '^\\d{7,8}$' },
  ML: { countryName: 'Mali', countryCode: '+223', nsnLength: '8', regex: '^\\d{8}$' },
  MR: { countryName: 'Mauritania', countryCode: '+222', nsnLength: '8', regex: '^\\d{8}$' },
  NE: { countryName: 'Niger', countryCode: '+227', nsnLength: '8', regex: '^\\d{8}$' },
  NG: { countryName: 'Nigeria', countryCode: '+234', nsnLength: '7-10', regex: '^\\d{7,10}$' },
  SN: { countryName: 'Senegal', countryCode: '+221', nsnLength: '9', regex: '^\\d{9}$' },
  SL: { countryName: 'Sierra Leone', countryCode: '+232', nsnLength: '8', regex: '^\\d{8}$' },
  TG: { countryName: 'Togo', countryCode: '+228', nsnLength: '8', regex: '^\\d{8}$' },
  CM: { countryName: 'Cameroon', countryCode: '+237', nsnLength: '9', regex: '^\\d{9}$' },
  CF: { countryName: 'Central African Republic', countryCode: '+236', nsnLength: '8', regex: '^\\d{8}$' },
  TD: { countryName: 'Chad', countryCode: '+235', nsnLength: '8', regex: '^\\d{8}$' },
  CG: { countryName: 'Congo', countryCode: '+242', nsnLength: '9', regex: '^\\d{9}$' },
  CD: { countryName: 'DR Congo', countryCode: '+243', nsnLength: '9', regex: '^\\d{9}$' },
  GQ: { countryName: 'Equatorial Guinea', countryCode: '+240', nsnLength: '9', regex: '^\\d{9}$' },
  GA: { countryName: 'Gabon', countryCode: '+241', nsnLength: '8', regex: '^\\d{8}$' },
  ST: { countryName: 'São Tomé and Príncipe', countryCode: '+239', nsnLength: '7', regex: '^\\d{7}$' },
  BI: { countryName: 'Burundi', countryCode: '+257', nsnLength: '8', regex: '^\\d{8}$' },
  KM: { countryName: 'Comoros', countryCode: '+269', nsnLength: '7', regex: '^\\d{7}$' },
  DJ: { countryName: 'Djibouti', countryCode: '+253', nsnLength: '8', regex: '^\\d{8}$' },
  ER: { countryName: 'Eritrea', countryCode: '+291', nsnLength: '7', regex: '^\\d{7}$' },
  ET: { countryName: 'Ethiopia', countryCode: '+251', nsnLength: '9', regex: '^\\d{9}$' },
  KE: { countryName: 'Kenya', countryCode: '+254', nsnLength: '9', regex: '^\\d{9}$' },
  MG: { countryName: 'Madagascar', countryCode: '+261', nsnLength: '9', regex: '^\\d{9}$' },
  MW: { countryName: 'Malawi', countryCode: '+265', nsnLength: '7-9', regex: '^\\d{7,9}$' },
  MU: { countryName: 'Mauritius', countryCode: '+230', nsnLength: '7-8', regex: '^\\d{7,8}$' },
  MZ: { countryName: 'Mozambique', countryCode: '+258', nsnLength: '8-9', regex: '^\\d{8,9}$' },
  RW: { countryName: 'Rwanda', countryCode: '+250', nsnLength: '9', regex: '^\\d{9}$' },
  SC: { countryName: 'Seychelles', countryCode: '+248', nsnLength: '7', regex: '^\\d{7}$' },
  SO: { countryName: 'Somalia', countryCode: '+252', nsnLength: '7-9', regex: '^\\d{7,9}$' },
  SS: { countryName: 'South Sudan', countryCode: '+211', nsnLength: '9', regex: '^\\d{9}$' },
  TZ: { countryName: 'Tanzania', countryCode: '+255', nsnLength: '9', regex: '^\\d{9}$' },
  UG: { countryName: 'Uganda', countryCode: '+256', nsnLength: '9', regex: '^\\d{9}$' },
  AO: { countryName: 'Angola', countryCode: '+244', nsnLength: '9', regex: '^\\d{9}$' },
  BW: { countryName: 'Botswana', countryCode: '+267', nsnLength: '7-8', regex: '^\\d{7,8}$' },
  SZ: { countryName: 'Eswatini', countryCode: '+268', nsnLength: '8', regex: '^\\d{8}$' },
  LS: { countryName: 'Lesotho', countryCode: '+266', nsnLength: '8', regex: '^\\d{8}$' },
  NA: { countryName: 'Namibia', countryCode: '+264', nsnLength: '8-9', regex: '^\\d{8,9}$' },
  ZA: { countryName: 'South Africa', countryCode: '+27', nsnLength: '9', regex: '^\\d{9}$' },
  ZM: { countryName: 'Zambia', countryCode: '+260', nsnLength: '9', regex: '^\\d{9}$' },
  ZW: { countryName: 'Zimbabwe', countryCode: '+263', nsnLength: '8-9', regex: '^\\d{8,9}$' },
} as const;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
  });
  const [phoneCountry, setPhoneCountry] = useState('+221');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isFocused, setIsFocused] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFocus(fieldName: string) {
    setIsFocused((prev) => ({ ...prev, [fieldName]: true }));
  }

  function handleBlur(fieldName: string) {
    setIsFocused((prev) => ({ ...prev, [fieldName]: false }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const newFieldErrors: Record<string, string[]> = {};
    if (phoneNumber) {
      const digits = phoneNumber.replace(/\D/g, '');
      const config = Object.values(PHONE_CONFIGS).find(
        (c) => c.countryCode === phoneCountry
      );
      if (config) {
        const pattern = new RegExp(config.regex);
        if (!pattern.test(digits)) {
          newFieldErrors.phone = ['Numéro de téléphone invalide.'];
        }
      }
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.password ||
      !form.password_confirmation
    ) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (form.password !== form.password_confirmation) {
      setFieldErrors({ password_confirmation: ['Les mots de passe ne correspondent pas.'] });
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post<{
        access_token: string;
        refresh_token: string;
        token_type?: string;
        user: any;
        message?: string;
      }>(API.endpoints.register, form);

      // Auto-login after successful registration
      if (res?.access_token && res?.refresh_token && res?.user) {
        setAuth(res.access_token, res.refresh_token, res.user);
        navigate('/', { replace: true });
      } else {
        // Fallback to login page if tokens not returned
        navigate('/login');
      }
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
    return (
      <div className="text-xs text-red-600 mt-1 flex items-center space-x-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{errs[0]}</span>
      </div>
    );
  }

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
            <span className="text-xl font-bold">SUNUFITNESS</span>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4">Commencez votre transformation</h2>
            <p className="text-white/80 text-lg opacity-90">
              Rejoignez notre communauté fitness et découvrez un nouveau mode de vie sain avec des
              coachs experts.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white/80">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Programmes d'entraînement personnalisés</span>
            </div>
            <div className="flex items-center space-x-3 text-white/80">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Suivi de progression détaillé</span>
            </div>
            <div className="flex items-center space-x-3 text-white/80">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Communauté active et supportive</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#05835e]/20 rounded-full -mr-32 -mb-32"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16"></div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 lg:flex-none">
        <div className="mx-auto w-full max-w-2xl lg:w-96">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-[#05835e] rounded-xl flex items-center justify-center">
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
            <h2 className="text-3xl font-bold text-gray-900">Créer votre compte</h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{' '}
              <Link
                to="/login"
                className="font-medium text-[#05835e] hover:opacity-90 transition-colors"
              >
                connectez-vous à votre compte existant
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      value={form.first_name}
                      onChange={(e) => update('first_name', e.target.value)}
                      onFocus={() => handleFocus('first_name')}
                      onBlur={() => handleBlur('first_name')}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#05835e] focus:border-[#05835e] transition-all duration-200 placeholder-gray-400"
                      placeholder="Jean"
                    />
                    <div
                      className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-[#05835e] to-[#05835e] opacity-0 transition-opacity duration-300 pointer-events-none ${isFocused.first_name ? 'opacity-20' : ''}`}
                    ></div>
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
                      onChange={(e) => update('last_name', e.target.value)}
                      onFocus={() => handleFocus('last_name')}
                      onBlur={() => handleBlur('last_name')}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#05835e] focus:border-[#05835e] transition-all duration-200 placeholder-gray-400"
                      placeholder="Dupont"
                    />
                    <div
                      className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-[#05835e] to-[#05835e] opacity-0 transition-opacity duration-300 pointer-events-none ${isFocused.last_name ? 'opacity-20' : ''}`}
                    ></div>
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
                      onChange={(e) => update('email', e.target.value)}
                      onFocus={() => handleFocus('email')}
                      onBlur={() => handleBlur('email')}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#05835e] focus:border-[#05835e] transition-all duration-200 placeholder-gray-400"
                      placeholder="vous@exemple.com"
                    />
                    <div
                      className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-[#05835e] to-[#05835e] opacity-0 transition-opacity duration-300 pointer-events-none ${isFocused.email ? 'opacity-20' : ''}`}
                    ></div>
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
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      onFocus={() => handleFocus('password')}
                      onBlur={() => handleBlur('password')}
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#05835e] focus:border-[#05835e] transition-all duration-200 placeholder-gray-400"
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
                  {renderFieldError('password')}
                </div>

                {/* Password Confirmation */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      value={form.password_confirmation}
                      onChange={(e) => update('password_confirmation', e.target.value)}
                      onFocus={() => handleFocus('password_confirmation')}
                      onBlur={() => handleBlur('password_confirmation')}
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#05835e] focus:border-[#05835e] transition-all duration-200 placeholder-gray-400"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors z-10"
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
                    <div
                      className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-[#05835e] to-[#05835e] opacity-0 transition-opacity duration-300 pointer-events-none ${isFocused.password_confirmation ? 'opacity-20' : ''}`}
                    ></div>
                  </div>
                  {renderFieldError('password_confirmation')}
                </div>

                {/* Phone */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <div className="relative flex">
                    <div className="relative w-32 flex-shrink-0">
                      <select
                        value={phoneCountry}
                        onChange={(e) => {
                          const newCountry = e.target.value;
                          setPhoneCountry(newCountry);
                          const digits = phoneNumber.replace(/\D/g, '');
                          const full = digits ? `${newCountry}${digits}` : '';
                          update('phone', full);
                        }}
                        onFocus={() => handleFocus('phone')}
                        onBlur={() => handleBlur('phone')}
                        className="h-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-l-xl focus:ring-2 focus:ring-[#05835e] focus:border-[#05835e] transition-all duration-200 text-sm text-gray-700 pr-6"
                      >
                        {Object.entries(PHONE_CONFIGS).map(([code, cfg]) => (
                          <option key={code} value={cfg.countryCode}>
                            {cfg.countryName} {cfg.countryCode}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="relative flex-1">
                      <input
                        value={phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value;
                          setPhoneNumber(value);
                          const digits = value.replace(/\D/g, '');
                          const full = digits ? `${phoneCountry}${digits}` : '';
                          update('phone', full);
                        }}
                        onFocus={() => handleFocus('phone')}
                        onBlur={() => handleBlur('phone')}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-l-0 border-gray-200 rounded-r-xl focus:ring-2 focus:ring-[#05835e] focus:border-[#05835e] transition-all duration-200 placeholder-gray-400"
                        placeholder="77 123 45 67"
                      />
                      <div
                        className={`absolute inset-0 rounded-r-xl border-2 border-transparent bg-gradient-to-r from-[#05835e] to-[#05835e] opacity-0 transition-opacity duration-300 pointer-events-none ${isFocused.phone ? 'opacity-20' : ''}`}
                      ></div>
                    </div>
                  </div>
                  {renderFieldError('phone')}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <div className="relative">
                    <input
                      value={form.address}
                      onChange={(e) => update('address', e.target.value)}
                      onFocus={() => handleFocus('address')}
                      onBlur={() => handleBlur('address')}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#05835e] focus:border-[#05835e] transition-all duration-200 placeholder-gray-400"
                      placeholder="Votre adresse complète"
                    />
                    <div
                      className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-[#05835e] to-[#05835e] opacity-0 transition-opacity duration-300 pointer-events-none ${isFocused.address ? 'opacity-20' : ''}`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
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
                      Création du compte...
                    </div>
                  ) : (
                    'Créer mon compte'
                  )}
                </button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                En créant un compte, vous acceptez nos conditions d'utilisation et notre politique
                de confidentialité.
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
