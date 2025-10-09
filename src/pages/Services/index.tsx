import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';

interface ServiceOption {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  type: 'subscription' | 'service';
}

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const subscriptions: ServiceOption[] = [
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
  ];

  const services: ServiceOption[] = [
    {
      id: 'group-classes',
      title: 'Cours Collectifs',
      subtitle: 'Entraînez-vous en groupe',
      price: 5000,
      duration: 'par séance',
      type: 'service',
      features: [
        'Yoga, Pilates, HIIT, Zumba',
        'Instructeurs certifiés',
        'Ambiance motivante',
        'Tous niveaux acceptés',
        'Équipements fournis'
      ]
    },
    {
      id: 'personal-coaching',
      title: 'Coaching Personnel',
      subtitle: 'Accompagnement sur mesure',
      price: 15000,
      duration: 'par séance (1h)',
      type: 'service',
      popular: true,
      features: [
        'Programme personnalisé',
        'Coach dédié certifié',
        'Suivi de progression détaillé',
        'Conseils techniques',
        'Motivation et encouragement',
        'Flexibilité des horaires'
      ]
    },
    {
      id: 'nutrition-advice',
      title: 'Conseil Nutritionnel',
      subtitle: 'Optimisez votre alimentation',
      price: 10000,
      duration: 'par consultation',
      type: 'service',
      features: [
        'Bilan nutritionnel complet',
        'Plan alimentaire personnalisé',
        'Conseils de nutritionniste',
        'Suivi et ajustements',
        'Recettes adaptées',
        'Support continu'
      ]
    }
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    
    // Check if user is authenticated
    if (!token) {
      // Store the selected service in sessionStorage to retrieve after login
      sessionStorage.setItem('selectedService', serviceId);
      // Redirect to login page
      navigate('/login', { state: { from: '/services', serviceId } });
      return;
    }
    
    // User is authenticated, proceed to payment
    navigate('/payment', { state: { serviceId } });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

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
              <div className="h-[1px] w-[100px] sm:w-[140px] md:w-[180px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] ml-[20px] mb-[2px] self-end"></div>
            </div>
            <h1 className="text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-bahnschrift font-bold leading-[34px] sm:leading-[42px] md:leading-[52px] lg:leading-[62px] text-center uppercase bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] bg-clip-text text-transparent mb-[24px]">
              CHOISISSEZ VOTRE FORMULE
            </h1>
            <p className="text-[16px] sm:text-[17px] md:text-[18px] font-bahnschrift font-light leading-[22px] sm:leading-[24px] md:leading-[26px] text-center text-global-text1 max-w-[800px] mx-auto">
              Découvrez nos différentes formules d'abonnement et services pour atteindre vos objectifs fitness. 
              Chaque option est conçue pour s'adapter à vos besoins et votre style de vie.
            </p>
            
            {!token && (
              <div className="mt-[24px] mx-auto max-w-[600px] bg-[#5dcd6219] border border-[#5dcd62] rounded-[8px] p-[16px] text-center">
                <div className="flex items-center justify-center gap-[8px] mb-[8px]">
                  <svg className="w-[20px] h-[20px] text-[#5dcd62]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[14px] font-bahnschrift font-semibold text-[#5dcd62]">
                    Connexion requise
                  </span>
                </div>
                <p className="text-[13px] font-bahnschrift font-light text-global-text3">
                  Vous devez vous connecter ou créer un compte pour souscrire à nos services.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Subscriptions Section */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mb-[80px]">
          <div className="text-center mb-[40px]">
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bahnschrift font-bold text-global-text1 mb-[16px]">
              ABONNEMENTS
            </h2>
            <p className="text-[14px] sm:text-[15px] md:text-[16px] font-bahnschrift font-light text-global-text3 max-w-[600px] mx-auto">
              Choisissez la durée qui vous convient le mieux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] sm:gap-[28px] md:gap-[32px]">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className={`relative flex flex-col bg-white rounded-[12px] shadow-lg hover:shadow-xl transition-all duration-300 p-[24px] sm:p-[28px] md:p-[32px] border-2 ${
                  subscription.popular 
                    ? 'border-[#5dcd62] transform scale-105' 
                    : 'border-gray-100 hover:border-[#5dcd62]'
                }`}
              >
                {subscription.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] text-white px-[16px] py-[6px] rounded-full text-[12px] font-bahnschrift font-bold uppercase">
                      Populaire
                    </span>
                  </div>
                )}

                <div className="text-center mb-[24px]">
                  <h3 className="text-[18px] sm:text-[20px] md:text-[22px] font-bahnschrift font-bold text-global-text1 mb-[8px]">
                    {subscription.title}
                  </h3>
                  {subscription.subtitle && (
                    <p className="text-[14px] font-bahnschrift font-light text-global-text3 mb-[16px]">
                      {subscription.subtitle}
                    </p>
                  )}
                  <div className="mb-[20px]">
                    <span className="text-[28px] sm:text-[32px] md:text-[36px] font-bahnschrift font-bold text-[#5dcd62]">
                      {formatPrice(subscription.price)}
                    </span>
                    <span className="text-[14px] font-bahnschrift font-light text-global-text3 block">
                      {subscription.duration}
                    </span>
                  </div>
                </div>

                <div className="flex-1 mb-[24px]">
                  <ul className="space-y-[12px]">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-[8px]">
                        <svg className="w-[16px] h-[16px] text-[#5dcd62] mt-[2px] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[14px] font-bahnschrift font-light text-global-text1">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleServiceSelect(subscription.id)}
                  className={`w-full py-[12px] px-[24px] rounded-[8px] font-bahnschrift font-semibold text-[16px] transition-all duration-300 ${
                    subscription.popular
                      ? 'bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] text-white hover:opacity-90'
                      : 'bg-white border-2 border-[#5dcd62] text-[#5dcd62] hover:bg-[#5dcd62] hover:text-white'
                  }`}
                >
                  {token ? 'Choisir cette formule' : 'Se connecter pour choisir'}
                </button>
              </div>
            ))}
          </div>
        </div>

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
            {services.map((service) => (
              <div
                key={service.id}
                className={`relative flex flex-col bg-white rounded-[12px] shadow-lg hover:shadow-xl transition-all duration-300 p-[24px] sm:p-[28px] md:p-[32px] border-2 ${
                  service.popular 
                    ? 'border-[#5dcd62] transform scale-105' 
                    : 'border-gray-100 hover:border-[#5dcd62]'
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] text-white px-[16px] py-[6px] rounded-full text-[12px] font-bahnschrift font-bold uppercase">
                      Recommandé
                    </span>
                  </div>
                )}

                <div className="text-center mb-[24px]">
                  <h3 className="text-[18px] sm:text-[20px] md:text-[22px] font-bahnschrift font-bold text-global-text1 mb-[8px]">
                    {service.title}
                  </h3>
                  {service.subtitle && (
                    <p className="text-[14px] font-bahnschrift font-light text-global-text3 mb-[16px]">
                      {service.subtitle}
                    </p>
                  )}
                  <div className="mb-[20px]">
                    <span className="text-[28px] sm:text-[32px] md:text-[36px] font-bahnschrift font-bold text-[#5dcd62]">
                      {formatPrice(service.price)}
                    </span>
                    <span className="text-[14px] font-bahnschrift font-light text-global-text3 block">
                      {service.duration}
                    </span>
                  </div>
                </div>

                <div className="flex-1 mb-[24px]">
                  <ul className="space-y-[12px]">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-[8px]">
                        <svg className="w-[16px] h-[16px] text-[#5dcd62] mt-[2px] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
                      ? 'bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] text-white hover:opacity-90'
                      : 'bg-white border-2 border-[#5dcd62] text-[#5dcd62] hover:bg-[#5dcd62] hover:text-white'
                  }`}
                >
                  {token ? 'Réserver ce service' : 'Se connecter pour réserver'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full bg-global-background4 py-[60px] px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bahnschrift font-bold text-global-text1 mb-[16px]">
              BESOIN D'AIDE POUR CHOISIR ?
            </h2>
            <p className="text-[16px] font-bahnschrift font-light text-global-text3 mb-[32px]">
              Notre équipe est là pour vous conseiller et vous aider à trouver la formule parfaite selon vos objectifs et votre budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-[16px] justify-center items-center">
              <a
                href="#contact"
                className="bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] text-white px-[32px] py-[14px] rounded-[8px] font-bahnschrift font-semibold text-[16px] hover:opacity-90 transition-all duration-300"
              >
                Nous contacter
              </a>
              <button
                onClick={() => handleServiceSelect('daypass')}
                className="bg-white border-2 border-[#5dcd62] text-[#5dcd62] px-[32px] py-[14px] rounded-[8px] font-bahnschrift font-semibold text-[16px] hover:bg-[#5dcd62] hover:text-white transition-all duration-300"
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
