import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const MemberPage: React.FC = () => {
  // Sample data for appointments
  const appointments = [
    {
      id: 1,
      title: 'Séance de Musculation 01',
      date: '26 - 2025',
      time: '10h00'
    },
    {
      id: 2,
      title: 'Séance de Musculation 01',
      date: '26 - 2025',
      time: '10h00'
    },
    {
      id: 3,
      title: 'Séance de Musculation 01',
      date: '26 - 2025',
      time: '10h00'
    },
    {
      id: 4,
      title: 'Séance de Musculation 01',
      date: '26 - 2025',
      time: '10h00'
    }
  ];

  // Sample data for payment history
  const paymentHistory = [
    {
      id: 1,
      description: 'paiement 12000Fcfa le 16 - 08 - 2025 à 15h',
      amount: '12000Fcfa',
      date: '16 - 08 - 2025',
      time: '15h'
    },
    {
      id: 2,
      description: 'paiement 12000Fcfa le 16 - 08 - 2025 à 15h',
      amount: '12000Fcfa',
      date: '16 - 08 - 2025',
      time: '15h'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="relative w-full h-[250px] sm:h-[280px] md:h-[320px] lg:h-[350px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/membre/member_bg.png')" }}
        >
          {/* Green Gradient Overlay - Strong left, fade right */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/90 via-green-400/60 to-transparent"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full text-white px-4 sm:px-6 lg:px-8">
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center">
                ESPACE MEMBRE
              </h1>
            </div>
            
          </div>
        </div>
        
        {/* User Profile Section - Avatar and Info side by side */}
        <div className="absolute bottom-0 left-4 sm:left-6 lg:left-8 transform translate-y-1/2 z-20 flex items-start gap-8">
          {/* User Avatar with Big White Background */}
          <div className="relative flex-shrink-0">
            {/* Large white background circle */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-white shadow-2xl flex items-center justify-center">
              {/* Inner avatar circle */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-green-400 flex items-center justify-center overflow-hidden">
                <img 
                  src="/images/membre/user.png" 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* User Info next to avatar - positioned higher and smaller */}
          <div className="text-left mt-4 sm:mt-6 lg:mt-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
              Hello , jules
            </h2>
            <p className="text-white/90 text-base sm:text-lg">
              Jules@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12 lg:pb-16">

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Mes Rendez-vous Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Mes Rendez-vous
              </h3>
            </div>
            
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              Consultez vos différents rendez-vous afin de les respecter
            </p>

            {/* Appointments List */}
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm sm:text-base">
                      {appointment.title} - {appointment.date} à {appointment.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historique de paiement Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Historique de paiement
              </h3>
            </div>
            
            <p className="text-gray-600 text-sm sm:text-base mb-6">
              Consultez votre historique de paiement
            </p>

            {/* Payment History List */}
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex-shrink-0 flex items-center justify-center">
                    <img 
                      src="/images/membre/Orange_Money-Logo.wine 3.png" 
                      alt="Orange Money" 
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm sm:text-base">
                      {payment.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reserve Button */}
        <div className="flex justify-center mt-12">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 sm:px-12 rounded-lg text-lg sm:text-xl transition-colors duration-200 flex items-center gap-3">
            Réservez une séance
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MemberPage;
