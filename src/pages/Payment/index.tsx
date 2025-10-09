import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import { API } from '../../config/api';

interface ServiceDetails {
  id: string;
  title: string;
  price: number;
  duration: string;
  type: 'subscription' | 'service';
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [selectedService, setSelectedService] = useState<ServiceDetails | null>(null);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    paymentMethod: 'card'
  });

  // Service data mapping
  const serviceDetails: Record<string, ServiceDetails> = {
    'monthly': {
      id: 'monthly',
      title: 'Abonnement Mensuel',
      price: 15000,
      duration: 'par mois',
      type: 'subscription'
    },
    'semester': {
      id: 'semester',
      title: 'Abonnement Semestriel',
      price: 75000,
      duration: 'pour 6 mois',
      type: 'subscription'
    },
    'annual': {
      id: 'annual',
      title: 'Abonnement Annuel',
      price: 120000,
      duration: 'pour 12 mois',
      type: 'subscription'
    },
    'daypass': {
      id: 'daypass',
      title: 'Day Pass',
      price: 2500,
      duration: 'pour 1 jour',
      type: 'subscription'
    },
    'group-classes': {
      id: 'group-classes',
      title: 'Cours Collectifs',
      price: 5000,
      duration: 'par séance',
      type: 'service'
    },
    'personal-coaching': {
      id: 'personal-coaching',
      title: 'Coaching Personnel',
      price: 15000,
      duration: 'par séance (1h)',
      type: 'service'
    },
    'nutrition-advice': {
      id: 'nutrition-advice',
      title: 'Conseil Nutritionnel',
      price: 10000,
      duration: 'par consultation',
      type: 'service'
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!token) {
      // Redirect to login with current service selection
      const serviceId = (location.state as { serviceId?: string })?.serviceId;
      if (serviceId) {
        sessionStorage.setItem('selectedService', serviceId);
        navigate('/login', { state: { from: '/payment', serviceId } });
      } else {
        navigate('/login', { state: { from: '/payment' } });
      }
      return;
    }

    const serviceId = (location.state as { serviceId?: string })?.serviceId;
    if (serviceId && serviceDetails[serviceId]) {
      setSelectedService(serviceDetails[serviceId]);
    } else {
      // Redirect back to services if no valid service selected
      navigate('/services');
    }
  }, [location.state, navigate, token]);

  // Update form data when user information becomes available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.first_name || prev.firstName,
        lastName: user.last_name || prev.lastName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    try {
      // Map frontend IDs to backend subscription type keys
      const typeMap: Record<string, string> = {
        'monthly': 'monthly',
        'semester': 'semestrial',
        'annual': 'annual',
        'daypass': 'day_pass',
        'group-classes': 'group_class',
        'personal-coaching': 'coaching',
        'nutrition-advice': 'nutrition',
      };

      const backendType = typeMap[selectedService.id] ?? 'monthly';

      // Map payment method to backend accepted values
      const paymentMethodMap: Record<string, string> = {
        'card': 'card',
        'mobile': 'mobile_money',
        'cash': 'cash',
      };

      const payload = {
        type: backendType,
        title: selectedService.title,
        amount: selectedService.price,
        currency: 'XOF',
        auto_renew: backendType === 'monthly' || backendType === 'semestrial' || backendType === 'annual',
        payment_method: paymentMethodMap[formData.paymentMethod] || 'card',
        metadata: {
          frontend_selection: selectedService,
          customer: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          },
        },
      };

      await apiClient.post(API.endpoints.subscriptions, payload);

      alert('Abonnement créé avec succès ! Vous recevrez un email de confirmation.');
      navigate('/member');
    } catch (err: any) {
      console.error('Erreur lors de la création de l\'abonnement', err);
      alert(err?.message || 'Une erreur est survenue lors de la création de l\'abonnement.');
    }
  };

  if (!selectedService) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="w-full bg-global-background8 min-h-screen">
      <Header />
      
      <div className="flex flex-col justify-start items-center w-full pt-[80px] pb-[40px]">
        {/* Page Header */}
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-[40px]">
          <div className="text-center">
            <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-bahnschrift font-bold leading-[34px] sm:leading-[42px] md:leading-[52px] text-center uppercase bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] bg-clip-text text-transparent mb-[16px]">
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
                    <div>
                      <h3 className="text-[16px] font-bahnschrift font-semibold text-global-text1">
                        {selectedService.title}
                      </h3>
                      <p className="text-[14px] font-bahnschrift font-light text-global-text3">
                        {selectedService.duration}
                      </p>
                    </div>
                    <span className="text-[18px] font-bahnschrift font-bold text-[#5dcd62]">
                      {formatPrice(selectedService.price)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[18px] font-bahnschrift font-bold text-global-text1">
                    Total
                  </span>
                  <span className="text-[24px] font-bahnschrift font-bold text-[#5dcd62]">
                    {formatPrice(selectedService.price)}
                  </span>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-global-background4 rounded-[8px] p-[20px]">
                <div className="flex items-center gap-[12px] mb-[12px]">
                  <svg className="w-[20px] h-[20px] text-[#5dcd62]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
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
              <form onSubmit={handleSubmit} className="bg-white rounded-[12px] shadow-lg p-[24px] sm:p-[32px]">
                <h2 className="text-[20px] sm:text-[24px] font-bahnschrift font-bold text-global-text1 mb-[16px]">
                  Informations personnelles
                </h2>
                
                {user && (user.first_name || user.last_name || user.email) && (
                  <div className="mb-[24px] p-[12px] bg-[#5dcd6219] border border-[#5dcd62] rounded-[6px]">
                    <div className="flex items-center gap-[8px]">
                      <svg className="w-[16px] h-[16px] text-[#5dcd62]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[12px] font-bahnschrift font-medium text-[#5dcd62]">
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
                      className={`w-full px-[16px] py-[12px] border rounded-[8px] text-[14px] font-bahnschrift focus:outline-none focus:ring-2 focus:ring-[#5dcd62] focus:border-transparent ${
                        user?.first_name ? 'border-[#5dcd62] bg-[#5dcd6208]' : 'border-gray-300'
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
                      className={`w-full px-[16px] py-[12px] border rounded-[8px] text-[14px] font-bahnschrift focus:outline-none focus:ring-2 focus:ring-[#5dcd62] focus:border-transparent ${
                        user?.last_name ? 'border-[#5dcd62] bg-[#5dcd6208]' : 'border-gray-300'
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
                    className={`w-full px-[16px] py-[12px] border rounded-[8px] text-[14px] font-bahnschrift focus:outline-none focus:ring-2 focus:ring-[#5dcd62] focus:border-transparent ${
                      user?.email ? 'border-[#5dcd62] bg-[#5dcd6208]' : 'border-gray-300'
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
                    className="w-full px-[16px] py-[12px] border border-gray-300 rounded-[8px] text-[14px] font-bahnschrift focus:outline-none focus:ring-2 focus:ring-[#5dcd62] focus:border-transparent"
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
                    className="w-full px-[16px] py-[12px] border border-gray-300 rounded-[8px] text-[14px] font-bahnschrift focus:outline-none focus:ring-2 focus:ring-[#5dcd62] focus:border-transparent"
                    placeholder="Votre adresse complète"
                  />
                </div>

                <div className="border-t border-gray-200 pt-[24px] mb-[24px]">
                  <h3 className="text-[18px] font-bahnschrift font-bold text-global-text1 mb-[16px]">
                    Mode de paiement
                  </h3>
                  
                  <div className="space-y-[12px]">
                    <label className="flex items-center gap-[12px] p-[16px] border border-gray-300 rounded-[8px] cursor-pointer hover:border-[#5dcd62] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="text-[#5dcd62] focus:ring-[#5dcd62]"
                      />
                      <div className="flex items-center gap-[8px]">
                        <svg className="w-[24px] h-[24px] text-[#5dcd62]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                        </svg>
                        <span className="text-[14px] font-bahnschrift font-medium text-global-text1">
                          Carte bancaire
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-[12px] p-[16px] border border-gray-300 rounded-[8px] cursor-pointer hover:border-[#5dcd62] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mobile"
                        checked={formData.paymentMethod === 'mobile'}
                        onChange={handleInputChange}
                        className="text-[#5dcd62] focus:ring-[#5dcd62]"
                      />
                      <div className="flex items-center gap-[8px]">
                        <svg className="w-[24px] h-[24px] text-[#5dcd62]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="text-[14px] font-bahnschrift font-medium text-global-text1">
                          Mobile Money (Orange Money, Wave)
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-[12px] p-[16px] border border-gray-300 rounded-[8px] cursor-pointer hover:border-[#5dcd62] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleInputChange}
                        className="text-[#5dcd62] focus:ring-[#5dcd62]"
                      />
                      <div className="flex items-center gap-[8px]">
                        <svg className="w-[24px] h-[24px] text-[#5dcd62]" fill="currentColor" viewBox="0 0 20 20">
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
                    className="flex-1 py-[14px] px-[24px] border-2 border-[#5dcd62] text-[#5dcd62] rounded-[8px] font-bahnschrift font-semibold text-[16px] hover:bg-[#5dcd62] hover:text-white transition-all duration-300"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-[14px] px-[24px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] text-white rounded-[8px] font-bahnschrift font-semibold text-[16px] hover:opacity-90 transition-all duration-300"
                  >
                    Finaliser la commande
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;
