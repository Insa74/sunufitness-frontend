import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import { API } from '../../config/api';

interface ServiceDetails {
  id: string | number;
  name?: string;
  title?: string;
  slug?: string;
  price: number;
  currency?: string;
  duration: string;
  duration_value?: number;
  duration_unit?: string;
  formatted_duration?: string;
  category?: 'subscription' | 'additional';
  type?: 'subscription' | 'service' | string;
  features?: string[];
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken, user, logout } = useAuth();
  const [selectedService, setSelectedService] = useState<ServiceDetails | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [showOrangeMoneyModal, setShowOrangeMoneyModal] = useState(false);

  const WAVE_BASE_URL = 'https://pay.wave.com/m/M_sn_FSX4Hmt6QfQq/c/sn/?amount=';
  const WAVE_AMOUNTS: Record<number, number> = {
    4: 5000,
    14: 15000,
    15: 22000,
    1: 30000,
    2: 150000,
    3: 300000,
    9: 55000,
  };
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    paymentMethod: 'cash',
  });

  // Fetch service details from API if needed
  const fetchServiceById = async (serviceId: string) => {
    try {
      const response = await apiClient.get<{ success: boolean; data: any }>(
        `${API.endpoints.services}/${serviceId}`
      );
      if (response.success && response.data) {
        return {
          id: response.data.id,
          name: response.data.name,
          title: response.data.name,
          slug: response.data.slug,
          price: response.data.price,
          currency: response.data.currency || 'XOF',
          duration: response.data.duration || 'par mois',
          duration_value: response.data.duration_value,
          duration_unit: response.data.duration_unit,
          formatted_duration: response.data.formatted_duration,
          category: response.data.category,
          type: response.data.type,
          features: response.data.features || [],
        } as ServiceDetails;
      }
    } catch (err) {
      console.error('Error fetching service:', err);
    }
    return null;
  };

  useEffect(() => {
    const loadService = async () => {
      // Check if user is authenticated
      if (!accessToken) {
        // Redirect to login with current service selection
        const serviceId = (location.state as any)?.serviceId;
        if (serviceId) {
          sessionStorage.setItem('selectedService', String(serviceId));
          navigate('/login', { state: { from: '/payment', serviceId } });
        } else {
          navigate('/login', { state: { from: '/payment' } });
        }
        return;
      }

      const stateData = location.state as any;

      // Check if full service object was passed
      if (stateData?.service) {
        setSelectedService(stateData.service);
        setLoading(false);
      }
      // Otherwise, fetch by serviceId
      else if (stateData?.serviceId) {
        const serviceId = String(stateData.serviceId);
        const service = await fetchServiceById(serviceId);
        if (service) {
          setSelectedService(service);
        } else {
          // Redirect back to services if service not found
          navigate('/services');
        }
        setLoading(false);
      } else {
        // No service data provided, redirect to services
        navigate('/services');
      }
    };

    loadService();
  }, [location.state, navigate, accessToken]);

  // Update form data when user information becomes available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.first_name || prev.firstName,
        lastName: user.last_name || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  const formatPrice = (price: number, currency: string = 'XOF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Only card is unavailable
    if (name === 'paymentMethod' && value === 'card') {
      setShowWarningModal(true);
      return; // Don't update the form data
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    
    // Wave payment: register subscription then open Wave link
    if (formData.paymentMethod === 'wave') {
      const serviceId = Number(selectedService.id);
      const amount = WAVE_AMOUNTS[serviceId] ?? selectedService.price;
      setSubmitting(true);
      try {
        const isSubscription = selectedService.category === 'subscription';
        const subscriptionTypes = ['monthly', 'semestrial', 'annual'];
        const serviceType = selectedService.type || selectedService.slug || String(selectedService.id);
        const shouldAutoRenew = isSubscription && subscriptionTypes.includes(serviceType);
        await apiClient.post(API.endpoints.subscriptions, {
          service_id: selectedService.id,
          start_date: new Date().toISOString().split('T')[0],
          auto_renew: shouldAutoRenew,
          payment_method: 'wave',
          payment_reference: null,
          metadata: {
            customer: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
            },
            service_slug: selectedService.slug,
            service_title: selectedService.title || selectedService.name,
            wave_amount: amount,
          },
        });
      } catch (err: any) {
        const msg = err?.message || '';
        if (msg.toLowerCase().includes("n'est pas actif") || msg.toLowerCase().includes('pas actif')) {
          setShowInactiveModal(true);
          setSubmitting(false);
          return;
        }
        // Continue even if API fails — open Wave anyway
      } finally {
        setSubmitting(false);
      }
      window.open(WAVE_BASE_URL + amount, '_blank');
      return;
    }

    // Orange Money modal
    if (formData.paymentMethod === 'orange') {
      setShowOrangeMoneyModal(true);
      return;
    }

    // Only allow cash payment (card not yet available)
    if (formData.paymentMethod !== 'cash') {
      setShowWarningModal(true);
      return;
    }

    setSubmitting(true);
    try {
      // Determine if it's a subscription type for auto_renew
      const isSubscription = selectedService.category === 'subscription';
      const subscriptionTypes = ['monthly', 'semestrial', 'annual'];
      const serviceType =
        selectedService.type || selectedService.slug || String(selectedService.id);
      const shouldAutoRenew = isSubscription && subscriptionTypes.includes(serviceType);

      // Map payment method to backend accepted values (card, mobile_money, cash)
      const paymentMethodMap: Record<string, string> = {
        card: 'card',
        mobile: 'mobile_money',
        cash: 'cash',
      };

      // Build payload according to API requirements
      const payload = {
        service_id: selectedService.id, // Required: service ID
        start_date: new Date().toISOString().split('T')[0], // Optional: start date (YYYY-MM-DD)
        auto_renew: shouldAutoRenew, // Optional: boolean for auto-renewal
        payment_method: paymentMethodMap[formData.paymentMethod] || 'card', // Optional: card, mobile_money, or cash
        payment_reference: null, // Optional: payment reference string
        metadata: {
          // Optional: additional metadata
          customer: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          },
          service_slug: selectedService.slug,
          service_title: selectedService.title || selectedService.name,
        },
      };

      await apiClient.post(API.endpoints.subscriptions, payload);

      // Show success modal instead of alert
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Erreur lors de la création de l'abonnement", err);
      const msg = err?.message || "Une erreur est survenue lors de la création de l'abonnement.";
      // Check if the error is about inactive account
      if (msg.toLowerCase().includes("n'est pas actif") || msg.toLowerCase().includes('pas actif')) {
        setShowInactiveModal(true);
      } else {
        alert(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !selectedService) {
    return (
      <div className="min-h-screen bg-global-background8">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#05835e20] border-t-[#05835e] rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-[#05835e40] rounded-full animate-pulse"></div>
          </div>
          <p className="mt-6 text-[18px] font-bahnschrift font-semibold text-gray-700 animate-pulse">
            Chargement du service...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-global-background8 min-h-screen">
      <Header />

      <div className="flex flex-col justify-start items-center w-full pt-[80px] pb-[40px]">
        {/* Page Header */}
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-[40px]">
          <div className="text-center">
            <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-bahnschrift font-bold leading-[34px] sm:leading-[42px] md:leading-[52px] text-center uppercase bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] bg-clip-text text-transparent mb-[16px]">
              FINALISER VOTRE COMMANDE
            </h1>
            <p className="text-[16px] font-bahnschrift font-light text-global-text3 max-w-[600px] mx-auto">
              Complétez vos informations pour finaliser votre inscription
            </p>
          </div>
        </div>

        <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px]">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-[12px] shadow-lg p-[24px] sm:p-[32px] mb-[24px]">
                <h2 className="text-[20px] sm:text-[24px] font-bahnschrift font-bold text-global-text1 mb-[20px]">
                  Résumé de la commande
                </h2>

                <div className="border-b border-gray-200 pb-[20px] mb-[20px]">
                  <div className="flex justify-between items-start mb-[12px]">
                    <div className="flex-1">
                      <h3 className="text-[16px] font-bahnschrift font-semibold text-global-text1">
                        {selectedService.title || selectedService.name}
                      </h3>
                      <p className="text-[14px] font-bahnschrift font-light text-global-text3">
                        {selectedService.duration}
                      </p>
                      {selectedService.formatted_duration && (
                        <p className="text-[13px] font-bahnschrift font-semibold text-gray-600 mt-[6px] bg-gray-50 px-[10px] py-[3px] rounded-[6px] inline-block">
                          Durée: {selectedService.formatted_duration}
                        </p>
                      )}
                    </div>
                    <span className="text-[18px] font-bahnschrift font-bold text-[#05835e] ml-[12px]">
                      {formatPrice(selectedService.price, selectedService.currency)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[18px] font-bahnschrift font-bold text-global-text1">
                    Total
                  </span>
                  <span className="text-[24px] font-bahnschrift font-bold text-[#05835e]">
                    {formatPrice(selectedService.price, selectedService.currency)}
                  </span>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-global-background4 rounded-[8px] p-[20px]">
                <div className="flex items-center gap-[12px] mb-[12px]">
                  <svg
                    className="w-[20px] h-[20px] text-[#05835e]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[14px] font-bahnschrift font-semibold text-global-text1">
                    Paiement sécurisé
                  </span>
                </div>
                <p className="text-[12px] font-bahnschrift font-light text-global-text3">
                  Vos informations de paiement sont protégées par un cryptage SSL 256 bits.
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="order-1 lg:order-2">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-[12px] shadow-lg p-[24px] sm:p-[32px]"
              >
                <h2 className="text-[20px] sm:text-[24px] font-bahnschrift font-bold text-global-text1 mb-[16px]">
                  Informations personnelles
                </h2>

                {user && (user.first_name || user.last_name || user.email || user.phone || user.address) && (
                  <div className="mb-[24px] p-[12px] bg-[#05835e19] border border-[#05835e] rounded-[6px]">
                    <div className="flex items-center gap-[8px]">
                      <svg
                        className="w-[16px] h-[16px] text-[#05835e]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-[12px] font-bahnschrift font-medium text-[#05835e]">
                        Informations pré-remplies depuis votre compte
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] mb-[20px]">
                  <div>
                    <label className="block text-[14px] font-bahnschrift font-medium text-global-text1 mb-[8px]">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-[16px] py-[12px] border rounded-[8px] text-[14px] font-bahnschrift focus:outline-none focus:ring-2 focus:ring-[#05835e] focus:border-transparent ${
                        user?.first_name ? 'border-[#05835e] bg-[#05835e08]' : 'border-gray-300'
                      }`}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-bahnschrift font-medium text-global-text1 mb-[8px]">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-[16px] py-[12px] border rounded-[8px] text-[14px] font-bahnschrift focus:outline-none focus:ring-2 focus:ring-[#05835e] focus:border-transparent ${
                        user?.last_name ? 'border-[#05835e] bg-[#05835e08]' : 'border-gray-300'
                      }`}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="mb-[20px]">
                  <label className="block text-[14px] font-bahnschrift font-medium text-global-text1 mb-[8px]">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-[16px] py-[12px] border rounded-[8px] text-[14px] font-bahnschrift focus:outline-none focus:ring-2 focus:ring-[#05835e] focus:border-transparent ${
                      user?.email ? 'border-[#05835e] bg-[#05835e08]' : 'border-gray-300'
                    }`}
                    placeholder="votre.email@exemple.com"
                  />
                </div>

                <div className="mb-[20px]">
                  <label className="block text-[14px] font-bahnschrift font-medium text-global-text1 mb-[8px]">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-[16px] py-[12px] border rounded-[8px] text-[14px] font-bahnschrift focus:outline-none focus:ring-2 focus:ring-[#05835e] focus:border-transparent ${
                      user?.phone ? 'border-[#05835e] bg-[#05835e08]' : 'border-gray-300'
                    }`}
                    placeholder="+221 XX XXX XX XX"
                  />
                </div>

                <div className="mb-[24px]">
                  <label className="block text-[14px] font-bahnschrift font-medium text-global-text1 mb-[8px]">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-[16px] py-[12px] border rounded-[8px] text-[14px] font-bahnschrift focus:outline-none focus:ring-2 focus:ring-[#05835e] focus:border-transparent ${
                      user?.address ? 'border-[#05835e] bg-[#05835e08]' : 'border-gray-300'
                    }`}
                    placeholder="Votre adresse complète"
                  />
                </div>

                <div className="border-t border-gray-200 pt-[24px] mb-[24px]">
                  <h3 className="text-[18px] font-bahnschrift font-bold text-global-text1 mb-[16px]">
                    Mode de paiement
                  </h3>

                  <div className="space-y-[12px]">
                    <label className="flex items-center gap-[12px] p-[16px] border border-gray-300 rounded-[8px] cursor-pointer hover:border-[#05835e] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="text-[#05835e] focus:ring-[#05835e]"
                      />
                      <div className="flex items-center gap-[8px]">
                        <svg
                          className="w-[24px] h-[24px] text-[#05835e]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                        </svg>
                        <span className="text-[14px] font-bahnschrift font-medium text-global-text1">
                          Carte bancaire
                        </span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-[12px] p-[16px] border rounded-[8px] cursor-pointer transition-colors ${formData.paymentMethod === 'wave' ? 'border-[#05835e] bg-[#05835e08]' : 'border-gray-300 hover:border-[#05835e]'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="wave"
                        checked={formData.paymentMethod === 'wave'}
                        onChange={handleInputChange}
                        className="text-[#05835e] focus:ring-[#05835e]"
                      />
                      <div className="flex items-center gap-[8px]">
                        <svg className="w-[24px] h-[24px] text-[#1E90FF]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                        </svg>
                        <div>
                          <span className="text-[14px] font-bahnschrift font-medium text-global-text1">
                            Wave
                          </span>
                          <span className="ml-[8px] text-[12px] font-bahnschrift text-[#05835e] font-semibold bg-[#05835e15] px-[6px] py-[2px] rounded-full">
                            Disponible
                          </span>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-[12px] p-[16px] border rounded-[8px] cursor-pointer transition-colors ${formData.paymentMethod === 'orange' ? 'border-[#05835e] bg-[#05835e08]' : 'border-gray-300 hover:border-[#05835e]'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="orange"
                        checked={formData.paymentMethod === 'orange'}
                        onChange={handleInputChange}
                        className="text-[#05835e] focus:ring-[#05835e]"
                      />
                      <div className="flex items-center gap-[8px]">
                        <svg
                          className="w-[24px] h-[24px] text-orange-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <div>
                          <span className="text-[14px] font-bahnschrift font-medium text-global-text1">
                            Orange Money
                          </span>
                          <span className="ml-[8px] text-[12px] font-bahnschrift text-[#05835e] font-semibold bg-[#05835e15] px-[6px] py-[2px] rounded-full">
                            Disponible
                          </span>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-[12px] p-[16px] border border-gray-300 rounded-[8px] cursor-pointer hover:border-[#05835e] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleInputChange}
                        className="text-[#05835e] focus:ring-[#05835e]"
                      />
                      <div className="flex items-center gap-[8px]">
                        <svg
                          className="w-[24px] h-[24px] text-[#05835e]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                        </svg>
                        <span className="text-[14px] font-bahnschrift font-medium text-global-text1">
                          Paiement en espèces (à la salle)
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-[16px]">
                  <button
                    type="button"
                    onClick={() => navigate('/services')}
                    disabled={submitting}
                    className="flex-1 py-[14px] px-[24px] border-2 border-[#05835e] text-[#05835e] rounded-[8px] font-bahnschrift font-semibold text-[16px] hover:bg-[#05835e] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-[14px] px-[24px] bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] text-white rounded-[8px] font-bahnschrift font-semibold text-[16px] hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Traitement en cours...</span>
                      </>
                    ) : formData.paymentMethod === 'wave' ? (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                        </svg>
                        Payer avec Wave
                      </>
                    ) : (
                      'Finaliser la commande'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[24px] shadow-2xl max-w-[500px] w-full overflow-hidden animate-scaleIn">
            {/* Warning Icon Header */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center animate-pulse">
                  <svg
                    className="w-10 h-10 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-[28px] font-bahnschrift font-bold text-white mb-2">
                  Méthode Non Disponible
                </h2>
                <p className="text-white/90 text-[16px] font-bahnschrift">
                  Cette option de paiement n'est pas encore active
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-[15px] font-bahnschrift font-semibold text-gray-800 mb-2">
                        Seul le paiement en espèces est disponible pour le moment
                      </p>
                      <p className="text-[14px] font-bahnschrift text-gray-700">
                        Veuillez sélectionner l'option <span className="font-bold text-[#05835e]">"Paiement en espèces (à la salle)"</span> pour continuer votre inscription.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-[14px] font-bahnschrift text-gray-700">
                        Les autres méthodes de paiement (carte bancaire et mobile money) seront bientôt disponibles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full bg-gradient-to-r from-[#05835e] to-[#05835e] text-white py-3 px-6 rounded-[12px] font-bahnschrift font-semibold text-[16px] hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[24px] shadow-2xl max-w-[500px] w-full overflow-hidden animate-scaleIn">
            {/* Success Icon Header */}
            <div className="bg-gradient-to-br from-[#05835e] to-[#05835e] p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center animate-bounce">
                  <svg
                    className="w-10 h-10 text-[#05835e]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-[28px] font-bahnschrift font-bold text-white mb-2">
                  Demande envoyée !
                </h2>
                <p className="text-white/90 text-[16px] font-bahnschrift">
                  Notre équipe vous contactera pour finaliser votre inscription
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[15px] font-bahnschrift font-semibold text-gray-800">
                      Email de confirmation envoyé
                    </p>
                    <p className="text-[13px] font-bahnschrift text-gray-600">
                      Vérifiez votre boîte mail pour les détails
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[15px] font-bahnschrift font-semibold text-gray-800">
                      Accès immédiat à votre espace membre
                    </p>
                    <p className="text-[13px] font-bahnschrift text-gray-600">
                      Consultez vos séances et programmes
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[15px] font-bahnschrift font-semibold text-gray-800">
                      Abonnement: {selectedService?.title || selectedService?.name}
                    </p>
                    <p className="text-[13px] font-bahnschrift text-gray-600">
                      {formatPrice(selectedService?.price || 0, selectedService?.currency)} -{' '}
                      {selectedService?.duration}
                    </p>
                    {selectedService?.formatted_duration && (
                      <p className="text-[12px] font-bahnschrift font-semibold text-gray-500 mt-[4px]">
                        Durée: {selectedService.formatted_duration}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/member')}
                  className="flex-1 bg-gradient-to-r from-[#05835e] to-[#05835e] text-white py-3 px-6 rounded-[12px] font-bahnschrift font-semibold text-[16px] hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  Voir mon espace membre
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-[12px] font-bahnschrift font-semibold text-[16px] hover:bg-gray-200 transition-all duration-300"
                >
                  Retour à l'accueil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inactive Account Modal */}
      {showInactiveModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 transform animate-scaleIn">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-amber-600"
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
            <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
              Compte non activé
            </h3>

            {/* Message */}
            <div className="text-center mb-4">
              <p className="text-gray-700 mb-3 leading-relaxed text-sm">
                Votre compte a bien été créé.
              </p>
              <p className="text-gray-600 mb-3 leading-relaxed text-sm">
                Après vérification de vos informations, votre compte sera approuvé par un administrateur. Une fois validé, vous pourrez accéder facilement à votre espace membre.
              </p>
              <p className="text-gray-600 mb-3 leading-relaxed text-sm">
                Merci de votre compréhension.
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-gray-800 mb-2 text-center">
                Pour toute question ou information complémentaire, veuillez nous contacter ou vous rendre à la salle :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-700">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#05835e] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <span className="font-medium">Tél :</span> 789573842 et 710196868
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#05835e] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <span className="font-medium">E-mail :</span> contact@sunufitness.com
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#05835e] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <span className="font-medium">Adresse :</span> 10 Route de Ngaparou Saly Sénégal
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full py-3 px-4 bg-[#05835e] hover:bg-[#3d6d4f] text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#05835e]"
              >
                Se déconnecter
              </button>
              <button
                onClick={() => setShowInactiveModal(false)}
                className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orange Money Modal */}
      {showOrangeMoneyModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[24px] shadow-2xl max-w-[500px] w-full overflow-hidden animate-scaleIn">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <h2 className="text-[28px] font-bahnschrift font-bold text-white mb-2">
                  Payer par Orange Money
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mb-6">
                <ol className="space-y-2 text-[15px] font-bahnschrift text-gray-800">
                  <li>1. Composez <span className="font-bold">#144#</span> sur votre téléphone</li>
                  <li>2. Sélectionnez <span className="font-bold">Payer marchand</span></li>
                  <li>3. Entrez le numéro <span className="font-bold">710196868</span></li>
                  <li>4. Entrez le montant <span className="font-bold">{selectedService?.price?.toLocaleString('fr-FR')} FCFA</span></li>
                  <li>5. Confirmez avec votre <span className="font-bold">code secret</span></li>
                </ol>
              </div>
              <button
                onClick={() => {
                  setShowOrangeMoneyModal(false);
                  setShowSuccessModal(true);
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-[12px] font-bahnschrift font-semibold text-[16px] hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                J'ai effectué le paiement
              </button>
              <button
                onClick={() => setShowOrangeMoneyModal(false)}
                className="w-full mt-3 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-[12px] font-bahnschrift font-semibold text-[16px] hover:bg-gray-50 transition-all duration-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;
