import React, { useState } from 'react';
import Header from '../../components/common/Header';

const ReservationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>('');
  const [sessionType, setSessionType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedCoach, setSelectedCoach] = useState<string>('');
  const [currentCoachSlide, setCurrentCoachSlide] = useState<number>(0);

  const services = [
    {
      id: 'musculation-cardio',
      title: 'MUSCULATION & CARDIO',
      icon: '/images/reservation/muscu.png',
    },
    {
      id: 'coaching-prive',
      title: 'COACHING PRIVÉ',
      icon: '/images/reservation/run.png',
    },
    {
      id: 'musculation-cardio-2',
      title: 'MUSCULATION & CARDIO',
      icon: '/images/reservation/muscu.png',
    },
    {
      id: 'yoga',
      title: 'YOGA',
      icon: '/images/reservation/iconoir_yoga.png',
    },
  ];

  // Coach data with alternating images
  const coaches = [
    {
      id: 'raphael-1',
      name: 'Coach Raphael',
      image: '/images/reservation/man1.png',
      description: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
    },
    {
      id: 'fatima',
      name: 'Coach Fatima',
      image: '/images/reservation/woman.png',
      description: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
    },
    {
      id: 'raphael-2',
      name: 'Coach Raphael',
      image: '/images/reservation/man1.png',
      description: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
    },
    {
      id: 'sarah',
      name: 'Coach Sarah',
      image: '/images/reservation/woman.png',
      description: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
    },
    {
      id: 'raphael-3',
      name: 'Coach Raphael',
      image: '/images/reservation/man1.png',
      description: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
    },
  ];

  const timeSlots = ['08:00', '10:00', '08:00', '08:00', '08:00', '08:00'];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      // Handle final submission
      console.log('Final submission:', {
        selectedService,
        sessionType,
        selectedDate,
        selectedTime,
        selectedCoach,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const nextCoachSlide = () => {
    setCurrentCoachSlide((prev) => (prev + 1) % Math.max(1, coaches.length - 2));
  };

  const prevCoachSlide = () => {
    setCurrentCoachSlide((prev) => (prev - 1 + Math.max(1, coaches.length - 2)) % Math.max(1, coaches.length - 2));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendar = () => {
    const year = 2025;
    const month = 7; // August (0-indexed)
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section - Only on step 1 */}
      {currentStep === 1 && (
        <section 
          className="relative h-80 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/reservation/bg.png')" }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-60" />
          
          {/* Top right ellipse */}
          <div className="absolute top-0 right-0">
            <img 
              src="/images/reservation/Ellipse 1.png" 
              alt="" 
              className="w-32 h-32 md:w-48 md:h-48 opacity-30"
            />
          </div>
          
          {/* Bottom left ellipse */}
          <div className="absolute bottom-0 left-0">
            <img 
              src="/images/reservation/Ellipse 2.png" 
              alt="" 
              className="w-24 h-24 md:w-36 md:h-36 opacity-40"
            />
          </div>
          
          {/* Content */}
          <div className="relative flex items-center justify-center h-full">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-wide">RESERVATION</h1>
              <nav className="text-white text-sm md:text-base">
                <span>Accueil</span>
                <span className="mx-3">›››</span>
                <span>Réservation</span>
              </nav>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button and Title */}
        <div className="flex items-center justify-center mb-8 relative">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="absolute left-0 p-2 text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Retour"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Effectuer une réservation
          </h2>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12 md:mb-16 px-4">
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 overflow-x-auto">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ${currentStep >= 1 ? 'bg-green-500' : 'bg-gray-400'} text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-lg mb-2 md:mb-3`}>
                01
              </div>
              <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">Step 01</span>
            </div>
            <div className={`w-8 sm:w-12 md:w-20 h-0.5 md:h-1 ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-300'} rounded flex-shrink-0`} />
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-400'} text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-lg mb-2 md:mb-3`}>
                02
              </div>
              <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">Step 02</span>
            </div>
            <div className={`w-8 sm:w-12 md:w-20 h-0.5 md:h-1 ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-300'} rounded flex-shrink-0`} />
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-400'} text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-lg mb-2 md:mb-3`}>
                03
              </div>
              <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">Step 03</span>
            </div>
            <div className={`w-8 sm:w-12 md:w-20 h-0.5 md:h-1 ${currentStep >= 4 ? 'bg-green-500' : 'bg-gray-300'} rounded flex-shrink-0`} />
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ${currentStep >= 4 ? 'bg-green-500' : 'bg-gray-400'} text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-lg mb-2 md:mb-3`}>
                04
              </div>
              <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">Step 04</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <>
            {/* Service Selection */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">NOS SERVICES</p>
                    <h3 className="text-2xl font-bold text-green-500">SÉLECTIONNER LE SERVICE</h3>
                  </div>
                  <div className="ml-6 flex-1 h-px bg-gray-300 max-w-xs"></div>
                </div>
                <div className="flex space-x-3">
                  <button className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`bg-white rounded-lg p-6 text-center cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg ${
                      selectedService === service.id
                        ? 'border-2 border-green-500 shadow-lg'
                        : 'border border-gray-100'
                    }`}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <img src={service.icon} alt={service.title} className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-xs mb-4 uppercase tracking-wide">{service.title}</h4>
                    <button className="bg-green-100 text-green-600 text-sm font-medium px-4 py-2 rounded-md hover:bg-green-200 transition-colors flex items-center justify-center mx-auto">
                      Choisir 
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Type Selection */}
            <div className="mb-12">
              <p className="text-sm text-gray-600 mb-2">Type de séance</p>
              <h3 className="text-2xl font-bold text-green-500 mb-6">SÉLECTIONNER LE TYPE DE SÉANCE</h3>
              <p className="text-sm text-gray-600 mb-4">Type de séance (Individuelle ou collective)</p>
              
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionner le type de séance</option>
                <option value="individuelle">Séance individuelle</option>
                <option value="collective">Séance collective</option>
              </select>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* Date and Time Selection */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">RENDEZ VOUS</p>
                  <h3 className="text-2xl font-bold text-green-500">SÉLECTIONNER JOUR ET HEURE</h3>
                </div>
                <div className="ml-6 flex-1 h-px bg-gray-300 max-w-xs"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">August</span>
                      <span className="font-medium text-gray-900">2025</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendar().map((day, index) => (
                        <button
                          key={index}
                          className={`h-10 w-10 text-sm rounded-lg transition-colors ${
                            day === null
                              ? 'invisible'
                              : day === 11
                              ? 'bg-blue-500 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => day && setSelectedDate(day.toString())}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">De combien de temps avez vous besoin ?</p>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-green-100 text-green-600 rounded-md text-sm font-medium">
                        30 min
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-sm font-medium">
                        1h
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-sm font-medium">
                        2h
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-sm font-medium">
                        à définir
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-4">Quelle heure vous convient le mieux?</p>
                    <div className="space-y-2">
                      {timeSlots.map((time, index) => (
                        <button
                          key={index}
                          className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coach Selection */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">Choisir un Coach</p>
                    <h3 className="text-2xl font-bold text-green-500">SÉLECTIONNER UN COACH</h3>
                  </div>
                  <div className="ml-6 flex-1 h-px bg-gray-300 max-w-xs"></div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={prevCoachSlide}
                    className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={nextCoachSlide}
                    className="w-12 h-12 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coaches.slice(currentCoachSlide, currentCoachSlide + 3).map((coach) => (
                  <div
                    key={coach.id}
                    className={`bg-white rounded-lg p-6 text-center cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg ${
                      selectedCoach === coach.id
                        ? 'border-2 border-green-500 shadow-lg'
                        : 'border border-gray-100'
                    }`}
                    onClick={() => setSelectedCoach(coach.id)}
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                      <img src={coach.image} alt={coach.name} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-lg mb-2">{coach.name}</h4>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{coach.description}</p>
                    <button className="bg-green-100 text-green-600 text-sm font-medium px-4 py-2 rounded-md hover:bg-green-200 transition-colors flex items-center justify-center mx-auto">
                      Choisir 
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Next Button */}
        <div className="text-center">
          <button
            onClick={handleNext}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-12 rounded-lg text-lg transition-colors duration-200 flex items-center justify-center mx-auto w-full"
          >
            Suivant
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
