import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import { API } from '../../config/api';

interface ServiceOption {
  id: string | number;
  name?: string;
  title?: string;
  slug?: string;
  description?: string;
  subtitle?: string;
  price: number;
  currency?: string;
  duration: string;
  duration_value?: number;
  duration_unit?: string;
  formatted_duration?: string;
  features: string[];
  is_popular?: boolean;
  popular?: boolean;
  category: 'subscription' | 'additional';
  type?: string;
}

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<ServiceOption[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: any[] }>(
        API.endpoints.services
      );

      if (response.success && response.data) {
        // Debug: Log the first service to check data structure
        console.log('First service from API:', response.data[0]);

        // Separate subscriptions and additional services
        const subs = response.data
          .filter((s) => s.category === 'subscription')
          .map(mapServiceToOption);

        const additionalServices = response.data
          .filter((s) => s.category === 'additional')
          .map(mapServiceToOption);

        // Debug: Log mapped services
        console.log('Mapped subscriptions:', subs[0]);
        console.log('Mapped services:', additionalServices[0]);

        setSubscriptions(subs);
        setServices(additionalServices);
      }
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setError(err?.message || 'Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const mapServiceToOption = (service: any): ServiceOption => ({
    id: service.id || service.slug,
    name: service.name,
    title: service.name,
    slug: service.slug,
    description: service.description,
    subtitle: service.metadata?.subtitle,
    price: service.price,
    currency: service.currency || 'XOF',
    duration: service.duration || '',
    duration_value: service.duration_value,
    duration_unit: service.duration_unit,
    formatted_duration: service.formatted_duration,
    features: service.features || [],
    is_popular: service.is_popular,
    popular: service.is_popular,
    category: service.category,
    type: service.type,
  });

  // Removed static data - now fetched from API
  /* const subscriptions: ServiceOption[] = [
    {
      id: 'monthly',
      title: 'Abonnement Mensuel',
      subtitle: 'Parfait pour commencer',
      price: 15000,
      duration: 'par mois',
      type: 'subscription',
      features: [
        'Accès illimité à la salle',
        'Utilisation de tous les équipements',
        'Vestiaires et douches',
        'Suivi de progression',
        'Support client'
      ]
    },
    {
      id: 'semester',
      title: 'Abonnement Semestriel',
      subtitle: 'Le plus populaire',
      price: 75000,
      duration: 'pour 6 mois',
      type: 'subscription',
      popular: true,
      features: [
        'Accès illimité à la salle',
        'Utilisation de tous les équipements',
        'Vestiaires et douches',
        'Suivi de progression personnalisé',
        'Support client prioritaire',
        '1 séance de coaching offerte',
        'Programme nutritionnel de base'
      ]
    },
    {
      id: 'annual',
      title: 'Abonnement Annuel',
      subtitle: 'Meilleure valeur',
      price: 120000,
      duration: 'pour 12 mois',
      type: 'subscription',
      features: [
        'Accès illimité à la salle',
        'Utilisation de tous les équipements',
        'Vestiaires et douches',
        'Suivi de progression avancé',
        'Support client VIP',
        '3 séances de coaching offertes',
        'Programme nutritionnel complet',
        'Accès aux cours collectifs premium',
        'Réductions sur services additionnels'
      ]
    },
    {
      id: 'daypass',
      title: 'Day Pass',
      subtitle: 'Essayez avant de vous engager',
      price: 2500,
      duration: 'pour 1 jour',
      type: 'subscription',
      features: [
        'Accès à la salle pour 1 journée',
        'Utilisation de tous les équipements',
        'Vestiaires et douches',
        'Orientation gratuite'
      ]
    }
  ]; */

  const formatPrice = (price: number, currency: string = 'XOF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleServiceSelect = (serviceId: string | number) => {
    const idString = String(serviceId);
    setSelectedService(idString);

    // Find the full service object
    const allServices = [...subscriptions, ...services];
    const service = allServices.find((s) => String(s.id) === idString);

    // Check if user is authenticated
    if (!accessToken) {
      // Store the selected service in sessionStorage to retrieve after login
      sessionStorage.setItem('selectedService', idString);
      if (service) {
        sessionStorage.setItem('selectedServiceData', JSON.stringify(service));
      }
      // Redirect to login page
      navigate('/login', { state: { from: '/services', serviceId: idString } });
      return;
    }

    // User is authenticated, proceed to payment with full service object
    navigate('/payment', { state: { service, serviceId: idString } });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-global-background8">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="relative">
            {/* Animated Spinner */}
            <div className="w-20 h-20 border-4 border-[#05835e20] border-t-[#05835e] rounded-full animate-spin"></div>
            {/* Pulsing Circle */}
            <div className="absolute inset-0 w-20 h-20 border-4 border-[#05835e40] rounded-full animate-pulse"></div>
          </div>
          <p className="mt-6 text-[18px] font-bahnschrift font-semibold text-gray-700 animate-pulse">
            Chargement des services...
          </p>
          <p className="mt-2 text-[14px] font-bahnschrift text-gray-500">
            Veuillez patienter un instant
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-global-background8">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-red-600"
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
          </div>
          <p className="text-[20px] font-bahnschrift font-bold text-gray-800 mb-2">
            Erreur de chargement
          </p>
          <p className="text-[16px] font-bahnschrift text-gray-600 mb-6 text-center max-w-md">
            {error}
          </p>
          <button
            onClick={fetchServices}
            className="bg-[#05835e] hover:bg-[#05835e] text-white font-bahnschrift font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Réessayer
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full bg-global-background8 min-h-screen">
      <Header />

      <div className="flex flex-col justify-start items-center w-full pt-[80px] pb-[40px]">
        {/* Page Header */}
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-[60px]">
          <div className="text-center">
            <div className="flex flex-row justify-center items-center w-full mb-[20px]">
              <span className="text-[16px] sm:text-[18px] md:text-[20px] font-bahnschrift font-normal uppercase text-global-text1">
                NOS OFFRES
              </span>
              <div className="h-[1px] w-[100px] sm:w-[140px] md:w-[180px] bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] ml-[20px] mb-[2px] self-end"></div>
            </div>
            <h1 className="text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-bahnschrift font-bold leading-[34px] sm:leading-[42px] md:leading-[52px] lg:leading-[62px] text-center uppercase bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] bg-clip-text text-transparent mb-[24px]">
              CHOISISSEZ VOTRE FORMULE
            </h1>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] font-bahnschrift font-light leading-[22px] sm:leading-[24px] md:leading-[26px] text-center text-global-text1 max-w-[800px] mx-auto">
              Découvrez nos différentes formules d'abonnement et services pour atteindre vos
              objectifs fitness. Chaque option est conçue pour s'adapter à vos besoins et votre
              style de vie.
            </p>
          </div>
        </div>

        {/* Section Passes Vacanciers & Touristes */}
        {(() => {
          const touristIds = [4, 14, 15];
          const touristPasses = touristIds
            .map(id => subscriptions.find(s => Number(s.id) === id))
            .filter(Boolean) as ServiceOption[];
          const daypass = touristPasses.find(s => Number(s.id) === 4);
          const others = touristPasses.filter(s => Number(s.id) !== 4);

          if (touristPasses.length === 0) return null;

          const renderCard = (s: ServiceOption, isDaypass: boolean, forceBadge?: string) => (
            <div
              key={s.id}
              className={`relative flex flex-col rounded-[12px] shadow-lg hover:shadow-xl transition-all duration-300 p-[24px] sm:p-[28px] md:p-[32px] border-2 ${
                isDaypass
                  ? 'bg-gradient-to-br from-[#05835e] to-[#046b4e] border-[#05835e] text-white transform scale-105'
                  : s.popular || forceBadge
                  ? 'bg-white border-[#05835e] transform scale-105'
                  : 'bg-white border-gray-100 hover:border-[#05835e]'
              }`}
            >
              {isDaypass && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-amber-400 text-amber-900 px-[16px] py-[6px] rounded-full text-[12px] font-bahnschrift font-bold uppercase">
                    ⭐ COUP DE CŒUR
                  </span>
                </div>
              )}
              {!isDaypass && (s.popular || forceBadge) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#05835e] text-white px-[16px] py-[6px] rounded-full text-[12px] font-bahnschrift font-bold uppercase">
                    {forceBadge || 'Populaire'}
                  </span>
                </div>
              )}

              <div className="text-center mb-[24px]">
                {isDaypass && (
                  <div className="text-[32px] mb-[8px]">🌴</div>
                )}
                <h3 className={`text-[18px] sm:text-[20px] md:text-[22px] font-bahnschrift font-bold mb-[8px] ${isDaypass ? 'text-white' : 'text-global-text1'}`}>
                  {s.title || s.name}
                </h3>
                {(s.subtitle || s.description) && (
                  <p className={`text-[14px] font-bahnschrift font-light mb-[16px] ${isDaypass ? 'text-white/80' : 'text-global-text3'}`}>
                    {s.subtitle || s.description}
                  </p>
                )}
                <div className="mb-[20px]">
                  <span className={`text-[28px] sm:text-[32px] md:text-[36px] font-bahnschrift font-bold ${isDaypass ? 'text-white' : 'text-[#05835e]'}`}>
                    {formatPrice(s.price, s.currency)}
                  </span>
                  <span className={`text-[14px] font-bahnschrift font-light block ${isDaypass ? 'text-white/80' : 'text-global-text3'}`}>
                    {s.duration}
                  </span>
                  {s.formatted_duration && (
                    <span className={`text-[13px] font-bahnschrift font-semibold block mt-[8px] px-[12px] py-[4px] rounded-[6px] inline-block ${isDaypass ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-600'}`}>
                      Durée: {s.formatted_duration}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 mb-[24px]">
                <ul className="space-y-[12px]">
                  {s.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-[8px]">
                      <svg className={`w-[16px] h-[16px] mt-[2px] flex-shrink-0 ${isDaypass ? 'text-amber-300' : 'text-[#05835e]'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={`text-[14px] font-bahnschrift font-light ${isDaypass ? 'text-white/90' : 'text-global-text1'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleServiceSelect(s.id)}
                className={`w-full py-[12px] px-[24px] rounded-[8px] font-bahnschrift font-semibold text-[16px] transition-all duration-300 ${
                  isDaypass
                    ? 'bg-white text-[#05835e] hover:bg-amber-50'
                    : s.popular || forceBadge
                    ? 'bg-[#05835e] text-white hover:opacity-90'
                    : 'bg-white border-2 border-[#05835e] text-[#05835e] hover:bg-[#05835e] hover:text-white'
                }`}
              >
                {accessToken ? 'Choisir cette formule' : 'Se connecter pour choisir'}
              </button>
            </div>
          );

          return (
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-[80px]">
              <div className="text-center mb-[40px]">
                <div className="inline-flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-full px-6 py-2 mb-4">
                  <span className="text-[14px] font-bahnschrift font-semibold text-amber-700 uppercase tracking-wider">🌴 Idéal pour les visiteurs</span>
                </div>
                <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bahnschrift font-bold text-global-text1 mb-[16px]">
                  PASSES VACANCIERS & TOURISTES
                </h2>
                <p className="text-[14px] sm:text-[15px] md:text-[16px] font-bahnschrift font-light text-global-text3 max-w-[600px] mx-auto">
                  Profitez de la salle pendant votre séjour à Saly — sans engagement
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] sm:gap-[28px] md:gap-[32px] items-center">
                {daypass && renderCard(daypass, true)}
                {others.map(s => renderCard(s, false, Number(s.id) === 14 ? 'POPULAIRE' : undefined))}
              </div>
            </div>
          );
        })()}

        {/* Abonnements Longue Durée */}
        {(() => {
          const longIds = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13];
          const longSubs = subscriptions.filter(s => ![ 4, 14, 15].includes(Number(s.id)));

          return (
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-[80px]">
              <div className="text-center mb-[40px]">
                <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bahnschrift font-bold text-global-text1 mb-[16px]">
                  ABONNEMENTS LONGUE DURÉE
                </h2>
                <p className="text-[14px] sm:text-[15px] md:text-[16px] font-bahnschrift font-light text-global-text3 max-w-[600px] mx-auto">
                  Engagez-vous sur la durée et profitez des meilleurs tarifs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] sm:gap-[28px] md:gap-[32px]">
                {longSubs.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 font-bahnschrift">Aucun abonnement disponible pour le moment.</p>
                  </div>
                ) : (
                  longSubs.map((subscription) => (
                    <div
                      key={subscription.id}
                      className={`relative flex flex-col bg-white rounded-[12px] shadow-lg hover:shadow-xl transition-all duration-300 p-[24px] sm:p-[28px] md:p-[32px] border-2 ${
                        subscription.popular
                          ? 'border-[#05835e] transform scale-105'
                          : 'border-gray-100 hover:border-[#05835e]'
                      }`}
                    >
                      {subscription.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-[#05835e] text-white px-[16px] py-[6px] rounded-full text-[12px] font-bahnschrift font-bold uppercase">
                            Populaire
                          </span>
                        </div>
                      )}
                      <div className="text-center mb-[24px]">
                        <h3 className="text-[18px] sm:text-[20px] md:text-[22px] font-bahnschrift font-bold text-global-text1 mb-[8px]">
                          {subscription.title || subscription.name}
                        </h3>
                        {(subscription.subtitle || subscription.description) && (
                          <p className="text-[14px] font-bahnschrift font-light text-global-text3 mb-[16px]">
                            {subscription.subtitle || subscription.description}
                          </p>
                        )}
                        <div className="mb-[20px]">
                          <span className="text-[28px] sm:text-[32px] md:text-[36px] font-bahnschrift font-bold text-[#05835e]">
                            {formatPrice(subscription.price, subscription.currency)}
                          </span>
                          <span className="text-[14px] font-bahnschrift font-light text-global-text3 block">
                            {subscription.duration}
                          </span>
                          {subscription.formatted_duration && (
                            <span className="text-[13px] font-bahnschrift font-semibold text-gray-600 block mt-[8px] bg-gray-50 px-[12px] py-[4px] rounded-[6px] inline-block">
                              Durée: {subscription.formatted_duration}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 mb-[24px]">
                        <ul className="space-y-[12px]">
                          {subscription.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-[8px]">
                              <svg className="w-[16px] h-[16px] text-[#05835e] mt-[2px] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-[14px] font-bahnschrift font-light text-global-text1">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => handleServiceSelect(subscription.id)}
                        className={`w-full py-[12px] px-[24px] rounded-[8px] font-bahnschrift font-semibold text-[16px] transition-all duration-300 ${
                          subscription.popular
                            ? 'bg-[#05835e] text-white hover:opacity-90'
                            : 'bg-white border-2 border-[#05835e] text-[#05835e] hover:bg-[#05835e] hover:text-white'
                        }`}
                      >
                        {accessToken ? 'Choisir cette formule' : 'Se connecter pour choisir'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })()}

        {/* Services Section */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-[80px]">
          <div className="text-center mb-[40px]">
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bahnschrift font-bold text-global-text1 mb-[16px]">
              SERVICES ADDITIONNELS
            </h2>
            <p className="text-[14px] sm:text-[15px] md:text-[16px] font-bahnschrift font-light text-global-text3 max-w-[600px] mx-auto">
              Complétez votre expérience avec nos services spécialisés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] sm:gap-[28px] md:gap-[32px]">
            {services.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-gray-500 font-bahnschrift">
                  Aucun service additionnel disponible pour le moment.
                </p>
              </div>
            ) : (
              services.map((service) => (
                <div
                  key={service.id}
                  className={`relative flex flex-col bg-white rounded-[12px] shadow-lg hover:shadow-xl transition-all duration-300 p-[24px] sm:p-[28px] md:p-[32px] border-2 ${
                    service.popular
                      ? 'border-[#05835e] transform scale-105'
                      : 'border-gray-100 hover:border-[#05835e]'
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] text-white px-[16px] py-[6px] rounded-full text-[12px] font-bahnschrift font-bold uppercase">
                        Recommandé
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-[24px]">
                    <h3 className="text-[18px] sm:text-[20px] md:text-[22px] font-bahnschrift font-bold text-global-text1 mb-[8px]">
                      {service.title || service.name}
                    </h3>
                    {(service.subtitle || service.description) && (
                      <p className="text-[14px] font-bahnschrift font-light text-global-text3 mb-[16px]">
                        {service.subtitle || service.description}
                      </p>
                    )}
                    <div className="mb-[20px]">
                      <span className="text-[28px] sm:text-[32px] md:text-[36px] font-bahnschrift font-bold text-[#05835e]">
                        {formatPrice(service.price, service.currency)}
                      </span>
                      <span className="text-[14px] font-bahnschrift font-light text-global-text3 block">
                        {service.duration}
                      </span>
                      {service.formatted_duration && (
                        <span className="text-[13px] font-bahnschrift font-semibold text-gray-600 block mt-[8px] bg-gray-50 px-[12px] py-[4px] rounded-[6px] inline-block">
                          Durée: {service.formatted_duration}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 mb-[24px]">
                    <ul className="space-y-[12px]">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-[8px]">
                          <svg
                            className="w-[16px] h-[16px] text-[#05835e] mt-[2px] flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-[14px] font-bahnschrift font-light text-global-text1">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleServiceSelect(service.id)}
                    className={`w-full py-[12px] px-[24px] rounded-[8px] font-bahnschrift font-semibold text-[16px] transition-all duration-300 ${
                      service.popular
                        ? 'bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] text-white hover:opacity-90'
                        : 'bg-white border-2 border-[#05835e] text-[#05835e] hover:bg-[#05835e] hover:text-white'
                    }`}
                  >
                    {accessToken ? 'Réserver ce service' : 'Se connecter pour réserver'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full bg-global-background4 py-[60px] px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bahnschrift font-bold text-global-text1 mb-[16px]">
              BESOIN D'AIDE POUR CHOISIR ?
            </h2>
            <p className="text-[16px] font-bahnschrift font-light text-global-text3 mb-[32px]">
              Notre équipe est là pour vous conseiller et vous aider à trouver la formule parfaite
              selon vos objectifs et votre budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-[16px] justify-center items-center">
              <button
                onClick={() => {
                  navigate('/');
                  // Wait for navigation to complete, then scroll to contact
                  setTimeout(() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                className="bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] text-white px-[32px] py-[14px] rounded-[8px] font-bahnschrift font-semibold text-[16px] hover:opacity-90 transition-all duration-300"
              >
                Nous contacter
              </button>
              <button
                onClick={() => {
                  // Find the daypass service from all available services
                  const allServices = [...subscriptions, ...services];
                  const daypassService = allServices.find(
                    s => {
                      const slug = String(s.slug || '').toLowerCase();
                      const id = String(s.id || '').toLowerCase();
                      const name = String(s.name || s.title || '').toLowerCase();
                      
                      return slug === 'daypass' || 
                             slug === 'day-pass' ||
                             id === 'daypass' ||
                             name.includes('day pass') ||
                             name.includes('daypass');
                    }
                  );
                  
                  console.log('All services:', allServices);
                  console.log('Found daypass service:', daypassService);
                  
                  if (daypassService) {
                    // Use the found service
                    handleServiceSelect(daypassService.id);
                  } else {
                    // Fallback: try to navigate directly with 'daypass' as serviceId
                    console.warn('Daypass service not found in loaded services, using fallback');
                    if (!accessToken) {
                      navigate('/login', { state: { from: '/services', serviceId: 'daypass' } });
                    } else {
                      navigate('/payment', { state: { serviceId: 'daypass' } });
                    }
                  }
                }}
                className="bg-white border-2 border-[#05835e] text-[#05835e] px-[32px] py-[14px] rounded-[8px] font-bahnschrift font-semibold text-[16px] hover:bg-[#05835e] hover:text-white transition-all duration-300"
              >
                Essayer avec un Day Pass
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServicesPage;
