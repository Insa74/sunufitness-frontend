import React, { useState } from 'react';
import Header from '../../components/common/Header';

const ReservationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>('');
  const [sessionType, setSessionType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedCoach, setSelectedCoach] = useState<string>('');
  const [currentCoachSlide, setCurrentCoachSlide] = useState<number>(0);
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  
  // Step 3 form fields
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  // Step 4 payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

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

  // Payment methods data
  const paymentMethods = [
    {
      id: 'orange-money',
      name: 'Orange Money',
      image: '/images/reservation/Orange_Money-Logo.wine 1.png',
    },
    {
      id: 'paydunya',
      name: 'PayDunya',
      image: '/images/reservation/paydyuana.png',
    },
    {
      id: 'cinetpay',
      name: 'CinetPay',
      image: '/images/reservation/cinetpay.png',
    },
    {
      id: 'wave',
      name: 'Wave',
      image: '/images/reservation/wave.png',
    },
  ];

  // Calendar helper functions
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
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

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null); // Reset selected date when changing month
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null); // Reset selected date when changing month
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(day);
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else {
      // Handle final submission
      console.log('Final submission:', {
        selectedService,
        sessionType,
        selectedDate,
        selectedTime,
        selectedCoach,
        fullName,
        phoneNumber,
        email,
        location,
        password,
        selectedPaymentMethod,
      });
      alert('Réservation terminée avec succès!');
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
          <div className="flex items-center justify-between w-full max-w-2xl relative">
            {/* Step 01 */}
            <div className="flex flex-col items-center relative z-20">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-lg mb-3 transition-all duration-300 ${
                currentStep >= 1 
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                  : 'bg-gray-400 text-white shadow-md'
              }`}>
                01
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Step 01</span>
            </div>
            
            {/* Connecting Line 1-2 */}
            <div className={`flex-1 h-1 -mx-6 transition-all duration-500 relative z-10 ${
              currentStep >= 2 ? 'bg-green-500' : 'bg-gray-300'
            }`} style={{ marginTop: '-24px', marginBottom: '24px' }}></div>
            
            {/* Step 02 */}
            <div className="flex flex-col items-center relative z-20">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-lg mb-3 transition-all duration-300 ${
                currentStep >= 2 
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                  : 'bg-gray-400 text-white shadow-md'
              }`}>
                02
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Step 02</span>
            </div>
            
            {/* Connecting Line 2-3 */}
            <div className={`flex-1 h-1 -mx-6 transition-all duration-500 relative z-10 ${
              currentStep >= 3 ? 'bg-green-500' : 'bg-gray-300'
            }`} style={{ marginTop: '-24px', marginBottom: '24px' }}></div>
            
            {/* Step 03 */}
            <div className="flex flex-col items-center relative z-20">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-lg mb-3 transition-all duration-300 ${
                currentStep >= 3 
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                  : 'bg-gray-400 text-white shadow-md'
              }`}>
                03
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Step 03</span>
            </div>
            
            {/* Connecting Line 3-4 */}
            <div className={`flex-1 h-1 -mx-6 transition-all duration-500 relative z-10 ${
              currentStep >= 4 ? 'bg-green-500' : 'bg-gray-300'
            }`} style={{ marginTop: '-24px', marginBottom: '24px' }}></div>
            
            {/* Step 04 */}
            <div className="flex flex-col items-center relative z-20">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-lg mb-3 transition-all duration-300 ${
                currentStep >= 4 
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                  : 'bg-gray-400 text-white shadow-md'
              }`}>
                04
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Step 04</span>
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
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {/* Month Selector */}
                      <select 
                        value={currentMonth}
                        onChange={(e) => {
                          setCurrentMonth(parseInt(e.target.value));
                          setSelectedDate(null);
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-900 bg-white hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        {monthNames.map((month, index) => (
                          <option key={index} value={index}>
                            {month}
                          </option>
                        ))}
                      </select>
                      
                      {/* Year Selector */}
                      <select 
                        value={currentYear}
                        onChange={(e) => {
                          setCurrentYear(parseInt(e.target.value));
                          setSelectedDate(null);
                        }}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-900 bg-white hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        onClick={handlePrevMonth}
                        title="Mois précédent"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        onClick={handleNextMonth}
                        title="Mois suivant"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
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
                      {generateCalendarDays().map((day: number | null, index: number) => (
                        <button
                          key={index}
                          className={`h-10 w-10 text-sm rounded-lg transition-colors ${
                            day === null
                              ? 'invisible'
                              : day === selectedDate
                              ? 'bg-green-500 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => day && handleDateSelect(day)}
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

        {currentStep === 3 && (
          <>
            {/* Personal Information Form */}
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">Information Personnel</p>
                  <h3 className="text-2xl font-bold text-green-500">ENTRER VOS INFORMATIONS</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Entrez votre nom"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de telephone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Entrez votre numéro de telephone"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Entrez votre adresse mail"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Entrez votre localisation"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Entrez votre mot de passe"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmation Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="confirmation mot de passe"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showConfirmPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {currentStep === 4 && (
          <>
            {/* Payment Method Selection */}
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">Effectuez le paiement</p>
                  <h3 className="text-2xl font-bold text-green-500">CHOISIR LE MODE DE PAIEMENT</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`relative bg-white rounded-lg p-6 cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg ${
                      selectedPaymentMethod === method.id
                        ? 'border-2 border-green-500 shadow-lg'
                        : 'border border-gray-200'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    {/* Radio button */}
                    <div className="absolute top-4 left-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === method.id
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === method.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    
                    {/* Payment method logo */}
                    <div className="flex items-center justify-center h-20 mb-4 mt-6">
                      <img 
                        src={method.image} 
                        alt={method.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
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
