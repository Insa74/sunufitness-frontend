import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Button from '../../components/ui/Button';
import Footer from '../../components/common/Footer';
import { apiClient } from '../../services/apiClient';
import { API } from '../../config/api';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Carousel states
  const [currentServiceSlide, setCurrentServiceSlide] = useState(0);
  const [currentTestimonialSlide, setCurrentTestimonialSlide] = useState(0);

  // Contact form states
  const [contactForm, setContactForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  // Navigation function
  const handleReservationClick = () => {
    navigate('/services');
  };

  // Contact form handlers
  const handleContactInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (contactError) setContactError(null);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError(null);
    setContactSuccess(false);

    try {
      await apiClient.post(API.endpoints.contact, contactForm);
      setContactSuccess(true);
      // Reset form
      setContactForm({
        full_name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
      });
      // Clear success message after 5 seconds
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (err: any) {
      setContactError(
        err?.message || 'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setContactLoading(false);
    }
  };

  // Services data
  const services = [
    {
      id: 1,
      icon: (
        <svg className="w-full h-full text-[#05835e]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C10.9 2 10 2.9 10 4s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-2 18h4v-2h-4v2zm8-6c0-1.1-.9-2-2-2h-1V8c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v4H8c-1.1 0-2 .9-2 2v6h2v-2h8v2h2v-6z"/>
        </svg>
      ),
      image: '/images/img_rectangle_24.png',
      title: 'MUSCULATION & CARDIO',
      description:
        'Accédez à des machines performantes et des espaces dédiés pour sculpter votre corps et améliorer votre endurance.',
    },
    {
      id: 2,
      icon: (
        <svg className="w-full h-full text-[#05835e]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      image: '/images/r.jpeg',
      title: 'COURS COLLECTIFS',
      description:
        'Yoga, HIIT, Pilates, Zumba… Des séances dynamiques pour brûler des calories en groupe et en musique !',
    },
    {
      id: 3,
      icon: (
        <svg className="w-full h-full text-[#05835e]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C10.9 2 10 2.9 10 4s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-2 18h4v-2h-4v2zm8-6c0-1.1-.9-2-2-2h-1V8c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v4H8c-1.1 0-2 .9-2 2v6h2v-2h8v2h2v-6z"/>
        </svg>
      ),
      image: '/images/pt.jpeg',
      title: 'COACHING PERSONNEL',
      description:
        'Un accompagnement sur mesure avec nos coachs certifiés pour atteindre vos objectifs rapidement et efficacement.',
    },
    {
      id: 4,
      icon: (
        <svg className="w-full h-full text-[#05835e]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      ),
      image: '/images/cn.jpeg',
      title: 'NUTRITION & BIEN-ÊTRE',
      description:
        'Conseils nutritionnels personnalisés et programmes de relaxation pour un équilibre corps-esprit optimal.',
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Omar D',
      avatar: '/images/img_ellipse_24.png',
      rating: 5,
      comment:
        "Entre les réunions et les voyages, ma santé passait au dernier plan. Grâce aux cours express du matin et au suivi nutritionnel, j'ai perdu mon ventre de bureau et gagné en productivité. Aujourd'hui, même en déplacement, j'applique leurs conseils. Une révolution !",
    },
    {
      id: 2,
      name: 'Fatou K.',
      avatar: '/images/img_ellipse_24_120x120.png',
      rating: 5,
      comment:
        "Je n'osais même pas entrer dans une salle de sport avant... Ici, pas de regard moqueur, que des encouragements ! Mon premier cours de danse africaine-fit a tout changé. 6 mois plus tard, je participe à des compétitions locales. La team m'a révélée à moi-même !",
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      avatar: '/images/reservation/woman.png',
      rating: 5,
      comment:
        "Après ma grossesse, j'avais perdu confiance en moi. L'équipe m'a accompagnée avec bienveillance dans ma remise en forme. Les cours de yoga prénatal puis les séances de renforcement m'ont redonné énergie et estime de soi.",
    },
    {
      id: 4,
      name: 'Ahmed Ben Ali',
      avatar: '/images/reservation/man1.png',
      rating: 4,
      comment:
        "À 45 ans, je pensais qu'il était trop tard pour me remettre en forme. Grâce au programme adapté à mon âge et mes capacités, j'ai retrouvé la forme de mes 30 ans. L'ambiance conviviale m'a motivé à persévérer.",
    },
  ];

  // Carousel navigation functions
  const nextServiceSlide = () => {
    setCurrentServiceSlide((prev) => (prev + 1) % Math.ceil(services.length / 2));
  };

  const prevServiceSlide = () => {
    setCurrentServiceSlide(
      (prev) => (prev - 1 + Math.ceil(services.length / 2)) % Math.ceil(services.length / 2)
    );
  };

  const nextTestimonialSlide = () => {
    setCurrentTestimonialSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
  };

  const prevTestimonialSlide = () => {
    setCurrentTestimonialSlide(
      (prev) => (prev - 1 + Math.ceil(testimonials.length / 2)) % Math.ceil(testimonials.length / 2)
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="w-full bg-global-background8 overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(93, 205, 98, 0.3);
          }
          50% {
            box-shadow:
              0 0 40px rgba(93, 205, 98, 0.6),
              0 0 60px rgba(93, 205, 98, 0.4);
          }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes typewriter {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes flip {
          0% {
            transform: rotateY(0);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes fadeInUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-in-right {
          animation: slideInRight 1s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-in-up {
          animation: slideInUp 1s ease-out forwards;
          opacity: 0;
        }
        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-typewriter {
          animation: typewriter 2s steps(40) forwards;
          overflow: hidden;
          white-space: nowrap;
        }
        .animate-bounce-in {
          animation: bounceIn 1s ease-out forwards;
          opacity: 0;
        }
        .animate-shake:hover {
          animation: shake 0.5s ease-in-out;
        }
        .animate-pulse-hover:hover {
          animation: pulse 0.5s ease-in-out;
        }
        .animate-flip:hover {
          animation: flip 0.6s ease-in-out;
        }
        .animate-gradient {
          background: linear-gradient(90deg, #05835e, #05835e, #05835e);
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-rotate {
          animation: rotate 10s linear infinite;
        }

        .animate-visible {
          opacity: 1 !important;
        }

        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-400 {
          animation-delay: 400ms;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-600 {
          animation-delay: 600ms;
        }
        .delay-700 {
          animation-delay: 700ms;
        }

        /* Custom scroll animations */
        .service-card {
          transition: all 0.5s ease;
        }
        .service-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(93, 205, 98, 0.3);
        }

        .testimonial-card {
          transition: all 0.4s ease;
        }
        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <Header />
      <div className="flex flex-col justify-start items-center w-full pt-[60px]">
        {/* Hero Section */}
        <div className="relative w-full h-screen min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden">
          {/* Hero Background Image with Overlays */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat animate-scale-in"
            style={{ backgroundImage: "url('/images/home.jpeg')" }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-global-background1 opacity-60"></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(91deg,#05835e99_0%,_#00000099_100%)]"></div>

            {/* Additional Dark Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#0000007f_0%,_#0000007f_100%)]"></div>
          </div>

          {/* Animated Floating Elements */}
          <div className="absolute top-10 left-10 animate-float">
            <div className="w-8 h-8 bg-[#05835e] rounded-full opacity-60"></div>
          </div>
          <div className="absolute top-20 right-20 animate-float delay-300">
            <div className="w-12 h-12 bg-[#05835e] rounded-full opacity-40"></div>
          </div>
          <div className="absolute bottom-20 left-1/4 animate-float delay-500">
            <div className="w-6 h-6 bg-[#05835e] rounded-full opacity-70"></div>
          </div>

          {/* Decorative Circles - Hidden on mobile, visible on larger screens */}
          <div className="hidden md:block absolute top-0 right-[20px] md:right-[80px] lg:right-[150px] xl:right-[224px] w-[150px] md:w-[200px] lg:w-[300px] xl:w-[400px] h-[150px] md:h-[200px] lg:h-[300px] xl:h-[398px] z-10 animate-rotate">
            <img
              src="/images/img_ellipse_2.svg"
              alt="Decorative circle"
              className="w-full h-full object-contain opacity-80"
            />
          </div>

          <div className="hidden lg:block absolute top-[150px] lg:top-[250px] xl:top-[410px] left-0 w-[100px] lg:w-[180px] xl:w-[274px] h-[200px] lg:h-[400px] xl:h-[668px] z-10 animate-float">
            <img
              src="/images/img_ellipse_1_white_a700.png"
              alt="Decorative element"
              className="w-full h-full object-contain opacity-80"
            />
          </div>

          {/* Hero Content */}
          <div
            id="home"
            className="absolute inset-0 flex flex-col justify-center items-center z-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
          >
            <div className="flex flex-col gap-[20px] sm:gap-[28px] md:gap-[36px] lg:gap-[44px] xl:gap-[52px] justify-center items-center w-full max-w-[1200px] text-center">
              {/* Hero Text */}
              <div className="flex flex-col gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] xl:gap-[28px] justify-center items-center w-full">
                <h1 className="text-[18px] xs:text-[22px] sm:text-[28px] md:text-[36px] lg:text-[46px] xl:text-[56px] font-bahnschrift font-bold leading-[22px] xs:leading-[26px] sm:leading-[34px] md:leading-[44px] lg:leading-[56px] xl:leading-[68px] text-center text-global-text5 uppercase w-full max-w-[1100px]">
                  VOS OBJECTIFS, NOTRE STANDARD
                </h1>
                <p className="text-[12px] xs:text-[13px] sm:text-[14px] md:text-[16px] lg:text-[17px] xl:text-[18px] font-bahnschrift font-normal leading-[16px] xs:leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[24px] xl:leading-[26px] text-center text-global-text5 w-full max-w-[800px] px-2 animate-fade-in-up delay-300">
                  Bienvenue dans votre centre de fitness ultime, conçu pour vous accompagner dans
                  l'atteinte de vos objectifs sportifs. Que vous soyez débutant ou athlète confirmé,
                  nos coachs experts vous aideront à repousser vos limites.
                </p>
              </div>

              {/* Hero Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-[16px] sm:gap-[20px] md:gap-[24px] w-full max-w-[500px] sm:max-w-[600px] px-4 animate-slide-in-up delay-500">
                <button
                  onClick={handleReservationClick}
                  className="flex justify-center items-center gap-[8px] bg-global-background10 border border-global-text5 rounded-[5px] px-[20px] sm:px-[24px] md:px-[48px] py-[12px] sm:py-[14px] w-full sm:w-auto min-w-[140px] sm:min-w-[160px] hover:text-global-background10 transition-all duration-300 animate-pulse-hover"
                >
                  <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bahnschrift font-normal text-white text-current">
                    Réserver
                  </span>
                  <img
                    src="/images/img_basil_arrow_up_outline.svg"
                    alt="Arrow"
                    className="w-[16px] sm:w-[18px] md:w-[20px] h-[16px] sm:h-[18px] md:h-[20px] animate-bounce-in"
                  />
                </button>

                <button
                  onClick={() =>
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bahnschrift font-normal text-global-text5 bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] border border-[#05835e] rounded-[5px] px-[20px] sm:px-[24px] md:px-[60px] py-[12px] sm:py-[14px] w-full sm:w-auto min-w-[140px] sm:min-w-[160px] hover:opacity-90 transition-opacity duration-300 animate-glow"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>

          {/* Service Cards - Desktop only absolute positioning */}
        </div>

        {/* Service Cards - Positioned between Hero and About Sections */}
        <div className="hidden lg:block relative w-full bg-transparent -mt-[100px] mb-[100px] z-30">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex flex-row gap-[30px] w-full justify-center">
              {/* Excellence Card */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[378px] bg-white rounded-[20px] shadow-2xl p-[35px] min-h-[250px] service-card animate-slide-in-up delay-300 hover:transform hover:translate-y-[-15px] transition-all duration-500 group border border-[#05835e]/20 overflow-hidden">
                <div className="flex flex-col justify-center items-center w-[70px] h-[70px] bg-[linear-gradient(135deg,#05835e_0%,#05835e_100%)] rounded-[18px] p-[14px] mb-[25px] animate-bounce-in group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                  <img
                    src="/images/img_game_icons_sport_medal.svg"
                    alt="Sport medal"
                    className="w-[36px] h-[36px] filter brightness-0 invert"
                  />
                </div>
                <h3 className="text-[24px] font-bahnschrift font-bold leading-[30px] text-gray-800 mt-[20px] group-hover:text-[#05835e] transition-colors duration-300">
                  Excellence & Tradition Sportive
                </h3>
                <p className="text-[16px] font-bahnschrift font-light leading-[24px] text-gray-600 mt-[18px] w-full group-hover:text-gray-700 transition-colors duration-300">
                  Nous combinons les méthodes d'entraînement modernes avec l'énergie et la passion
                  pour vous offrir une expérience unique.
                </p>
                {/* Animated border bottom */}
                <div className="w-0 h-[4px] bg-gradient-to-r from-[#05835e] to-[#3d6d4f] mt-[25px] group-hover:w-full transition-all duration-500 delay-200 rounded-full"></div>
              </div>

              {/* Community Card */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[378px] rounded-[20px] shadow-2xl p-[35px] min-h-[250px] service-card animate-slide-in-up delay-500 hover:transform hover:translate-y-[-15px] transition-all duration-500 group border border-[#05835e] overflow-hidden relative">
                {/* Gradient background with proper rounding */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#05835e] to-[#3d6d4f] rounded-[20px] z-0"></div>
                <div className="relative z-10 w-full h-full">
                  <div className="flex flex-col justify-center items-center w-[70px] h-[70px] bg-white rounded-[18px] p-[14px] mb-[25px] animate-bounce-in delay-200 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                    <svg
                      className="w-[36px] h-[36px] text-[#05835e]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <h3 className="text-[24px] font-bahnschrift font-bold leading-[30px] text-white mt-[20px] group-hover:text-white/90 transition-colors duration-300">
                    Communauté & Solidarité
                  </h3>
                  <p className="text-[16px] font-bahnschrift font-light leading-[24px] text-white/80 mt-[18px] w-full group-hover:text-white transition-colors duration-300">
                    Plus qu'une salle de sport, nous sommes une famille ! Chez nous, l'entraide et
                    la bonne humeur sont aussi importantes que la performance.
                  </p>
                  {/* Animated border bottom */}
                  <div className="w-0 h-[4px] bg-white mt-[25px] group-hover:w-full transition-all duration-500 delay-200 rounded-full"></div>
                </div>
              </div>

              {/* Accessibility Card */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[378px] bg-white rounded-[20px] shadow-2xl p-[35px] min-h-[250px] service-card animate-slide-in-up delay-700 hover:transform hover:translate-y-[-15px] transition-all duration-500 group border border-[#05835e]/20 overflow-hidden">
                <div className="flex flex-col justify-center items-center w-[70px] h-[70px] bg-[linear-gradient(135deg,#05835e_0%,#05835e_100%)] rounded-[18px] p-[14px] mb-[25px] animate-bounce-in delay-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                  <img
                    src="/images/img_material_symbol.svg"
                    alt="Material symbol"
                    className="w-[36px] h-[36px] filter brightness-0 invert"
                  />
                </div>
                <h3 className="text-[24px] font-bahnschrift font-bold leading-[30px] text-gray-800 mt-[20px] group-hover:text-[#05835e] transition-colors duration-300">
                  Accessibilité & Bien-être pour Tous
                </h3>
                <p className="text-[16px] font-bahnschrift font-light leading-[24px] text-gray-600 mt-[18px] w-full group-hover:text-gray-700 transition-colors duration-300">
                  Nous croyons que le fitness doit être accessible à tous, quel que soit le niveau
                  ou le budget. Nos tarifs adaptés et nos programmes variés permettent à chacun de
                  progresser à son rythme.
                </p>
                {/* Animated border bottom */}
                <div className="w-0 h-[4px] bg-gradient-to-r from-[#05835e] to-[#3d6d4f] mt-[25px] group-hover:w-full transition-all duration-500 delay-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Cards - Mobile/Tablet Section */}
        <div
          ref={addToRefs}
          className="block lg:hidden w-full mt-[40px] sm:mt-[60px] md:mt-[80px] px-4 sm:px-6 md:px-8"
        >
          <div className="w-full max-w-[1200px] mx-auto">
            <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] w-full">
              {/* Excellence Card */}
              <div className="flex flex-col justify-start items-start w-full bg-white rounded-[15px] shadow-xl p-[25px] min-h-[200px] service-card animate-slide-in-left border border-[#05835e]/20 overflow-hidden">
                <div className="flex flex-col justify-center items-center w-[55px] h-[55px] bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] rounded-[12px] p-[10px] mb-[20px] animate-flip">
                  <img
                    src="/images/img_game_icons_sport_medal.svg"
                    alt="Sport medal"
                    className="w-[28px] h-[28px] filter brightness-0 invert"
                  />
                </div>
                <h3 className="text-[18px] font-bahnschrift font-bold leading-[24px] text-center text-gray-800 mt-[16px]">
                  Excellence & Tradition Sportive
                </h3>
                <p className="text-[14px] font-bahnschrift font-light leading-[20px] text-center text-gray-600 mt-[12px] w-full">
                  Nous combinons les méthodes d'entraînement modernes avec l'énergie et la passion
                  pour vous offrir une expérience unique.
                </p>
              </div>

              {/* Community Card */}
              <div className="flex flex-col justify-start items-start w-full rounded-[15px] shadow-xl p-[25px] min-h-[200px] service-card animate-slide-in-up delay-200 border border-[#05835e] overflow-hidden relative">
                {/* Gradient background with proper rounding */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#05835e] to-[#3d6d4f] rounded-[15px] z-0"></div>
                <div className="relative z-10 w-full h-full">
                  <div className="flex flex-col justify-center items-center w-[55px] h-[55px] bg-white rounded-[12px] p-[10px] mb-[20px] animate-flip">
                    <svg
                      className="w-[28px] h-[28px] text-[#05835e]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <h3 className="text-[18px] font-bahnschrift font-bold leading-[24px] text-center text-white mt-[16px]">
                    Communauté & Solidarité
                  </h3>
                  <p className="text-[14px] font-bahnschrift font-light leading-[20px] text-center text-white/80 mt-[12px] w-full">
                    Plus qu'une salle de sport, nous sommes une famille ! Chez nous, l'entraide et
                    la bonne humeur sont aussi importantes que la performance.
                  </p>
                </div>
              </div>

              {/* Accessibility Card */}
              <div className="flex flex-col justify-start items-start w-full bg-white rounded-[15px] shadow-xl p-[25px] min-h-[200px] service-card animate-slide-in-right delay-400 border border-[#05835e]/20 overflow-hidden">
                <div className="flex flex-col justify-center items-center w-[55px] h-[55px] bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] rounded-[12px] p-[10px] mb-[20px] animate-flip">
                  <img
                    src="/images/img_material_symbol.svg"
                    alt="Material symbol"
                    className="w-[28px] h-[28px] filter brightness-0 invert"
                  />
                </div>
                <h3 className="text-[18px] font-bahnschrift font-bold leading-[24px] text-center text-gray-800 mt-[16px]">
                  Accessibilité & Bien-être pour Tous
                </h3>
                <p className="text-[14px] font-bahnschrift font-light leading-[20px] text-center text-gray-600 mt-[12px] w-full">
                  Nous croyons que le fitness doit être accessible à tous, quel que soit le niveau
                  ou le budget. Nos tarifs adaptés et nos programmes variés permettent à chacun de
                  progresser à son rythme.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div ref={addToRefs} id="about" className="w-full bg-global-background4  ">
          <div className="w-full max-w-[1378px] mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-center py-[40px] sm:py-[50px] md:py-[60px] lg:py-[80px] gap-[32px] sm:gap-[40px] lg:gap-[60px]">
              {/* Left Image Section */}
              <div className="relative w-full lg:w-[45%] flex justify-center lg:justify-start mb-8 lg:mb-0 animate-slide-in-left">
                <div className="relative w-[280px] sm:w-[320px] md:w-[380px] lg:w-[480px] xl:w-[580px] h-[300px] sm:h-[350px] md:h-[420px] lg:h-[530px] xl:h-[670px]">
                  <img
                    src="/images/about.png"
                    alt="Fitness training"
                    className="absolute top-[8px] sm:top-[12px] md:top-[15px] lg:top-[18px] xl:top-[20px] left-[20px] sm:left-[25px] md:left-[30px] lg:left-[40px] xl:left-[62px] w-[240px] sm:w-[270px] md:w-[320px] lg:w-[400px] xl:w-[518px] h-[280px] sm:h-[320px] md:h-[380px] lg:h-[480px] xl:h-[630px] object-cover rounded-[5px] shadow-lg hover:scale-105 transition-transform duration-500 cursor-pointer"
                  />
                  <img
                    src="/images/img_cercle.png"
                    alt="Decorative circle"
                    className="absolute top-0 left-0 w-[32px] sm:w-[40px] md:w-[50px] lg:w-[65px] xl:w-[80px] h-[38px] sm:h-[48px] md:h-[60px] lg:h-[78px] xl:h-[98px] object-contain animate-float"
                  />
                </div>
              </div>

              {/* Right Content Section */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[50%] text-center lg:text-left animate-slide-in-right delay-300">
                <div className="flex flex-row justify-center lg:justify-start items-center w-full mb-[12px] sm:mb-[16px] md:mb-[18px] lg:mb-[20px]">
                  <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bahnschrift font-normal uppercase text-global-text1 animate-fade-in-up">
                    A PROPOS DE NOUS
                  </span>
                  <div className="h-[1px] w-[80px] sm:w-[100px] md:w-[140px] lg:w-[180px] xl:w-[222px] bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] ml-[8px] sm:ml-[12px] md:ml-[16px] lg:ml-[20px] mb-[2px] self-end animate-scale-in delay-400"></div>
                </div>

                <h2 className="text-[24px] sm:text-[28px] md:text-[36px] lg:text-[44px] xl:text-[50px] font-bahnschrift font-bold leading-[28px] sm:leading-[34px] md:leading-[42px] lg:leading-[52px] xl:leading-[61px] text-center lg:text-left uppercase bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] bg-clip-text text-transparent mt-[8px] sm:mt-[12px] md:mt-[16px] lg:mt-[20px] w-full animate-typewriter delay-500">
                  SUNUFITNESS
                </h2>

                <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-light leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] text-center lg:text-justify  text-global-text1 w-full mt-[16px] sm:mt-[20px] md:mt-[24px] lg:mt-[28px] px-2 lg:px-0 animate-fade-in-up delay-600">
                  Ici, chaque séance compte. Chez SUNUFITNESS, tu entres dans un espace motivant,
                  inclusif et 100 % dédié à tes objectifs. Nos coachs certifiés sont là pour
                  t’accompagner, t’encourager et te pousser à donner le meilleur de toi-même – que
                  tu sois débutant en quête de bases solides ou athlète confirmé visant des
                  performances optimisées. Chaque pas vers tes objectifs est célébré, et chaque défi
                  devient une occasion de progresser et de vivre plus sainement. Notre équipe
                  qualifiée t’accompagne avec expertise, bienveillance et exigence pour transformer
                  chaque entraînement en une étape vers une meilleure version de toi-même.
                </p>

                <div className="flex flex-row justify-start items-start w-full bg-[linear-gradient(90deg,#05835e19_0%,_#05835e19_100%)] mt-[24px] sm:mt-[28px] md:mt-[32px] lg:mt-[36px] p-[16px] sm:p-[18px] md:p-[20px] lg:p-[24px] rounded-[5px] animate-scale-in delay-700">
                  <div className="w-[4px] h-[60px] sm:h-[70px] md:h-[80px] lg:h-[90px] bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] flex-shrink-0 mt-[4px] animate-pulse"></div>
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-light leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] text-center lg:text-justify lowercase text-global-text1 ml-[12px] sm:ml-[16px] md:ml-[18px] lg:ml-[20px]">
                    Rejoignez-nous pour transformer votre entraînement en une expérience inspirante,
                    adaptée à vos besoins, votre rythme et vos rêves, et découvrez comment chaque
                    séance peut devenir une étape vers une meilleure version de vous-même.
                  </p>
                </div>

                <div className="flex justify-center lg:justify-start w-full mt-[32px] sm:mt-[36px] md:mt-[40px] lg:mt-[44px] animate-bounce-in delay-800">
                  <button
                    onClick={handleReservationClick}
                    className="flex justify-center items-center gap-[8px] text-[14px] sm:text-[16px] md:text-[18px] font-bahnschrift font-normal text-global-text5 bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] rounded-[3px] px-[24px] sm:px-[28px] md:px-[32px] py-[12px] sm:py-[14px] md:py-[16px] hover:opacity-90 transition-opacity duration-300 w-full sm:w-auto max-w-[280px] animate-pulse-hover"
                  >
                    Réserve ta séance maintenant
                    <img
                      src="/images/img_solararrowuplinear.svg"
                      alt="Arrow"
                      className="w-[16px] sm:w-[18px] md:w-[20px] h-[16px] sm:h-[18px] md:h-[20px] animate-bounce-in"
                    />
                  </button>
                </div>

                <img
                  src="/images/img_cercle.png"
                  alt="Decorative circle"
                  className="w-[44px] sm:w-[60px] md:w-[74px] lg:w-[88px] h-[54px] sm:h-[74px] md:h-[91px] lg:h-[108px] self-end mt-[20px] sm:mt-[24px] md:mt-[27px] lg:mt-[30px] object-contain animate-float delay-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div
          ref={addToRefs}
          id="services"
          className="w-full mt-[100px] sm:mt-[120px] md:mt-[140px] lg:mt-[96px]"
        >
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
            <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] justify-start items-center">
              {/* Services Header */}
              <div className="flex flex-col lg:flex-row justify-between items-center w-full gap-[24px] lg:gap-[40px] animate-slide-in-up">
                <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[28px] justify-start items-center lg:items-start w-full lg:w-[60%] text-center lg:text-left">
                  <div className="flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] lg:gap-[18px] justify-start items-center lg:items-start w-full">
                    <div className="flex flex-row justify-center lg:justify-start items-center w-full">
                      <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bahnschrift font-normal uppercase text-global-text1 animate-fade-in-up">
                        NOS SERVICES
                      </span>
                      <div className="h-[1px] w-[80px] sm:w-[100px] md:w-[140px] lg:w-[180px] xl:w-[222px] bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] ml-[8px] sm:ml-[12px] md:ml-[16px] lg:ml-[20px] mb-[2px] self-end animate-scale-in delay-200"></div>
                    </div>
                    <h2 className="text-[20px] sm:text-[26px] md:text-[32px] lg:text-[40px] xl:text-[50px] font-bahnschrift font-bold leading-[24px] sm:leading-[32px] md:leading-[38px] lg:leading-[48px] xl:leading-[61px] text-center lg:text-left uppercase bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] bg-clip-text text-transparent w-full animate-typewriter delay-400">
                      DÉCOUVREZ NOS SERVICES
                    </h2>
                  </div>
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-light leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] text-center lg:text-justify lowercase text-global-text1 w-full max-w-[600px] lg:max-w-none px-2 lg:px-0 animate-fade-in-up delay-600">
                    Nous proposons une variété de services pour répondre à tous vos besoins fitness
                    et bien-être, en adaptant chaque offre à votre style de vie et à vos objectifs
                    personnels afin de vous aider à progresser durablement: coaching personnalisé,
                    programmes d'entraînement sur mesure, séances collectives dynamiques.
                  </p>
                </div>

                {/* Navigation Arrows */}
                <div className="flex flex-row justify-center lg:justify-end items-center w-full lg:w-auto gap-[32px] sm:gap-[40px] md:gap-[48px] lg:gap-[56px] animate-bounce-in delay-800">
                  <button
                    onClick={prevServiceSlide}
                    className="w-[44px] sm:w-[50px] md:w-[56px] lg:w-[62px] h-[44px] sm:h-[50px] md:h-[56px] lg:h-[62px] bg-global-background3 rounded-[22px] sm:rounded-[25px] md:rounded-[28px] lg:rounded-[30px] p-[8px] sm:p-[10px] md:p-[12px] lg:p-[14px] hover:bg-global-background2 transition-colors duration-300 shadow-md animate-pulse-hover"
                  >
                    <svg
                      className="w-full h-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextServiceSlide}
                    className="w-[44px] sm:w-[50px] md:w-[56px] lg:w-[62px] h-[44px] sm:h-[50px] md:h-[56px] lg:h-[62px] bg-global-background3 rounded-[22px] sm:rounded-[25px] md:rounded-[28px] lg:rounded-[30px] p-[8px] sm:p-[10px] md:p-[12px] lg:p-[14px] hover:bg-global-background2 transition-colors duration-300 shadow-md animate-pulse-hover"
                  >
                    <svg
                      className="w-full h-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Services Cards */}
              <div className="flex flex-col justify-start items-center w-full lg:relative">
                {/* Mobile/Tablet Layout - Normal Flow */}
                <div className="flex flex-col gap-[24px] sm:gap-[32px] w-full max-w-[600px] sm:max-w-[700px] md:max-w-[800px] mx-auto px-4 sm:px-6 md:px-8 mt-[40px] sm:mt-[60px] md:mt-[80px] lg:hidden">
                  {services
                    .slice(currentServiceSlide * 2, currentServiceSlide * 2 + 2)
                    .map((service, index) => (
                      <div
                        key={service.id}
                        className="flex flex-col gap-[14px] sm:gap-[16px] justify-start items-center w-full animate-slide-in-up"
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        <div className="flex flex-row gap-[3px] sm:gap-[4px] justify-center items-center w-full">
                          <button className="w-[50px] sm:w-[58px] h-[50px] sm:h-[58px] bg-global-background2 rounded-[25px] sm:rounded-[29px] p-[8px] sm:p-[9px] animate-flip">
                            {service.icon}
                          </button>
                          <div className="h-[1px] w-full bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] animate-scale-in"></div>
                        </div>
                        <div className="flex flex-col justify-start items-center w-full bg-global-background6 rounded-[10px] shadow-[0px_4px_4px_#0000003f] p-[20px] sm:p-[24px] service-card">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-[180px] sm:h-[200px] object-cover rounded-[3px] hover:scale-105 transition-transform duration-500"
                          />
                          <h3 className="text-[16px] sm:text-[18px] font-bahnschrift font-bold leading-[20px] sm:leading-[22px] text-center uppercase text-global-text1 mt-[20px] sm:mt-[24px] w-full">
                            {service.title}
                          </h3>
                          <p className="text-[14px] sm:text-[16px] font-bahnschrift font-light leading-[17px] sm:leading-[19px] text-center text-global-text1 w-full mt-[6px] sm:mt-[8px] mb-[15px] sm:mb-[20px]">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    ))}

                  {/* Coaching Privé Card - Mobile/Tablet */}
                  <div className="flex flex-col gap-[14px] sm:gap-[16px] justify-start items-center w-full animate-slide-in-up delay-400">
                    <div className="flex flex-row gap-[3px] sm:gap-[4px] justify-center items-center w-full">
                      <button className="w-[50px] sm:w-[58px] h-[50px] sm:h-[58px] bg-global-background2 rounded-[25px] sm:rounded-[29px] p-[8px] sm:p-[9px] animate-flip">
                        <svg className="w-full h-full text-[#05835e]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
                        </svg>
                      </button>
                      <div className="h-[1px] w-full bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] animate-scale-in"></div>
                    </div>
                    <div className="flex flex-col justify-start items-center w-full bg-global-background6 rounded-[10px] shadow-[0px_4px_4px_#0000003f] p-[20px] sm:p-[24px] service-card">
                      <img
                        src="/images/img_rectangle_24_1.png"
                        alt="Private coaching session"
                        className="w-full h-[180px] sm:h-[200px] object-cover rounded-[3px] hover:scale-105 transition-transform duration-500"
                      />
                      <h3 className="text-[16px] sm:text-[18px] font-bahnschrift font-bold leading-[20px] sm:leading-[22px] text-center uppercase text-global-text1 mt-[20px] sm:mt-[24px] w-full">
                        COACHING PRIVÉ
                      </h3>
                      <p className="text-[14px] sm:text-[16px] font-bahnschrift font-light leading-[17px] sm:leading-[19px] text-center text-global-text1 w-full mt-[6px] sm:mt-[8px] mb-[15px] sm:mb-[20px]">
                        Un programme 100% personnalisé avec un expert pour maximiser vos résultats.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout - Absolute Positioning with Smooth Sliding */}
                <div className="hidden lg:block w-[1380px] px-[40px] absolute top-[280px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out gap-[90px]"
                    style={{ transform: `translateX(-${currentServiceSlide * 33.33}%)` }}
                  >
                    {/* All Service Cards with Uniform Height */}
                    {services.map((service, index) => (
                      <div
                        key={service.id}
                        className="flex flex-col gap-[14px] sm:gap-[16px] md:gap-[17px] lg:gap-[18px] justify-start items-center w-full lg:w-[360px] flex-shrink-0 animate-scale-in"
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        <div className="flex flex-row gap-[3px] sm:gap-[4px] md:gap-[5px] lg:gap-[6px] justify-center items-center w-full">
                          <button className="w-[50px] sm:w-[58px] md:w-[62px] lg:w-[66px] h-[50px] sm:h-[58px] md:h-[62px] lg:h-[66px] bg-global-background2 rounded-[25px] sm:rounded-[29px] md:rounded-[31px] lg:rounded-[32px] p-[8px] sm:p-[9px] md:p-[9px] lg:p-[10px] animate-flip">
                            {service.icon}
                          </button>
                          <div className="h-[1px] w-full bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] animate-scale-in"></div>
                        </div>
                        <div className="flex flex-col justify-between w-full bg-global-background6 rounded-[10px] shadow-[0px_4px_4px_#0000003f] p-[21px] sm:p-[24px] md:p-[26px] lg:p-[28px] pb-[32px] h-[380px] service-card">
                          <div className="flex flex-col">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-full h-[161px] sm:h-[185px] md:h-[200px] lg:h-[214px] object-cover rounded-[3px] hover:scale-105 transition-transform duration-500"
                            />
                            <h3 className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-bold leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-center uppercase text-global-text1 mt-[21px] sm:mt-[24px] md:mt-[26px] lg:mt-[28px] w-full">
                              {service.title}
                            </h3>
                          </div>
                          <p className="text-[13px] sm:text-[15px] md:text-[16px] lg:text-[16px] font-bahnschrift font-light leading-[16px] sm:leading-[18px] md:leading-[19px] lg:leading-[19px] text-center text-global-text1 w-full mt-[6px] sm:mt-[7px] md:mt-[7px] lg:mt-[8px]">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Coaching Privé Card with Same Height */}
                    <div className="flex flex-col gap-[14px] sm:gap-[16px] md:gap-[17px] lg:gap-[18px] justify-start items-center w-full lg:w-[426px] flex-shrink-0 animate-scale-in delay-600">
                      <div className="flex flex-row gap-[3px] sm:gap-[4px] md:gap-[5px] lg:gap-[6px] justify-center items-center w-full">
                        <button className="w-[50px] sm:w-[58px] md:w-[62px] lg:w-[66px] h-[50px] sm:h-[58px] md:h-[62px] lg:h-[66px] bg-global-background2 rounded-[25px] sm:rounded-[29px] md:rounded-[31px] lg:rounded-[32px] p-[8px] sm:p-[9px] md:p-[9px] lg:p-[10px] animate-flip">
                          <svg className="w-full h-full text-[#05835e]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
                          </svg>
                        </button>
                        <div className="h-[1px] w-full bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] animate-scale-in"></div>
                      </div>
                      <div className="flex flex-col justify-between w-full bg-global-background6 rounded-[10px] shadow-[0px_4px_4px_#0000003f] p-[21px] sm:p-[24px] md:p-[26px] lg:p-[28px] h-[380px] service-card">
                        <div className="flex flex-col">
                          <img
                            src="/images/img_rectangle_24_1.png"
                            alt="Private coaching session"
                            className="w-full h-[161px] sm:h-[185px] md:h-[200px] lg:h-[214px] object-cover rounded-[3px] hover:scale-105 transition-transform duration-500"
                          />
                          <h3 className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-bold leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-center uppercase text-global-text1 mt-[20px] sm:mt-[22px] md:mt-[24px] lg:mt-[26px]">
                            COACHING PRIVÉ
                          </h3>
                        </div>
                        <p className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-bahnschrift font-light leading-[17px] sm:leading-[19px] md:leading-[20px] lg:leading-[21px] text-center text-global-text1 w-full mt-[8px] sm:mt-[9px] md:mt-[9px] lg:mt-[10px]">
                          Un programme 100% personnalisé avec un expert pour maximiser vos
                          résultats.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Section with Background */}
                <div
                  className="w-full h-[229px] sm:h-[320px] md:h-[389px] lg:h-[458px] bg-cover bg-center relative mt-[150px] sm:mt-[200px] md:mt-[250px] lg:mt-[300px] animate-scale-in delay-800"
                  style={{ backgroundImage: "url('/images/img_rectangle_20.png')" }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(104deg,#05835ee5_0%,_#000000e5_100%)]"></div>
                  <div className="relative z-10 flex flex-col gap-[20px] sm:gap-[25px] md:gap-[28px] lg:gap-[30px] justify-center lg:justify-end items-center w-full h-full px-[20px] sm:px-[30px] md:px-[35px] lg:px-[40px] lg:pb-[60px]">
                    <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-comic-sans font-normal leading-[26px] sm:leading-[28px] md:leading-[30px] lg:leading-[32px] text-center text-global-text5 max-w-[320px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] mx-auto animate-fade-in-up">
                      Vous ne rejoignez pas seulement un centre de Fitness, vous intégrez une
                      seconde famille
                    </p>
                    <div className="flex justify-center items-center w-full animate-bounce-in delay-400">
                      <button
                        onClick={handleReservationClick}
                        className="flex gap-[6px] sm:gap-[7px] md:gap-[8px] lg:gap-[9px] justify-center items-center border border-[#05835e] rounded-[3px] bg-global-background9 px-[10px] sm:px-[12px] md:px-[14px] lg:px-[16px] py-[6px] sm:py-[7px] md:py-[8px] lg:py-[9px] hover:bg-[#05835e] hover:text-global-text1 transition-all animate-pulse-hover"
                      >
                        <span className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-normal leading-[18px] sm:leading-[19px] md:leading-[20px] lg:leading-[21px] text-global-text5">
                          Réservez maintenant
                        </span>
                        <img
                          src="/images/img_solararrowuplinear.svg"
                          alt="Arrow"
                          className="w-[24px] sm:w-[26px] md:w-[28px] lg:w-[30px] h-[24px] sm:h-[26px] md:h-[28px] lg:h-[30px] animate-bounce-in"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        {/* <div
          ref={addToRefs}
          className="w-full mt-[60px] sm:mt-[70px] md:mt-[80px] lg:mt-[96px] px-4 sm:px-6 md:px-8 lg:px-8"
        >
          <div className="w-full max-w-[1376px] mx-auto">
            <div className="flex flex-col justify-start items-start w-full">
              <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start w-full gap-[20px] lg:gap-[40px] animate-slide-in-up">
                <div className="flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] lg:gap-[18px] justify-start items-center lg:items-start w-full lg:w-auto text-center lg:text-left">
                  <div className="flex flex-row justify-center lg:justify-start items-center w-full">
                    <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bahnschrift font-normal uppercase text-global-text1 animate-fade-in-up">
                      TÉMOIGNAGE
                    </span>
                    <div className="h-[1px] w-[80px] sm:w-[100px] md:w-[140px] lg:w-[180px] xl:w-[222px] bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] ml-[8px] sm:ml-[12px] md:ml-[16px] lg:ml-[20px] mb-[2px] self-end animate-scale-in delay-200"></div>
                  </div>
                  <h2 className="text-[20px] sm:text-[26px] md:text-[32px] lg:text-[40px] xl:text-[50px] font-bahnschrift font-bold leading-[24px] sm:leading-[32px] md:leading-[38px] lg:leading-[48px] xl:leading-[61px] text-center lg:text-left uppercase bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] bg-clip-text text-transparent w-full animate-typewriter delay-400">
                    TÉMOIGNAGES CLIENTS
                  </h2>
                </div>

                <div className="flex flex-row justify-center lg:justify-end items-center gap-[32px] sm:gap-[40px] md:gap-[48px] lg:gap-[56px] w-full lg:w-auto animate-bounce-in delay-600">
                  <button
                    onClick={prevTestimonialSlide}
                    className="w-[44px] sm:w-[50px] md:w-[56px] lg:w-[62px] h-[44px] sm:h-[50px] md:h-[56px] lg:h-[62px] bg-global-background3 rounded-[22px] sm:rounded-[25px] md:rounded-[28px] lg:rounded-[30px] p-[8px] sm:p-[10px] md:p-[12px] lg:p-[14px] hover:bg-global-background2 transition-colors duration-300 shadow-md animate-pulse-hover"
                  >
                    <svg
                      className="w-full h-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextTestimonialSlide}
                    className="w-[44px] sm:w-[50px] md:w-[56px] lg:w-[62px] h-[44px] sm:h-[50px] md:h-[56px] lg:h-[62px] bg-global-background3 rounded-[22px] sm:rounded-[25px] md:rounded-[28px] lg:rounded-[30px] p-[8px] sm:p-[10px] md:p-[12px] lg:p-[14px] hover:bg-global-background2 transition-colors duration-300 shadow-md animate-pulse-hover"
                  >
                    <svg
                      className="w-full h-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-light leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] text-center lg:text-left text-global-text1 w-full lg:w-[60%] max-w-[600px] lg:max-w-none mt-[16px] sm:mt-[20px] md:mt-[24px] lg:mt-[28px] px-2 lg:px-0 animate-fade-in-up delay-600">
                Nos membres parlent mieux que nous ! Découvrez leurs parcours inspirants et
                laissez-vous motiver par leurs transformations.
              </p>

              <div className="flex flex-col lg:flex-row gap-[24px] sm:gap-[32px] md:gap-[40px] lg:gap-[48px] w-full mt-[32px] sm:mt-[40px] md:mt-[48px] lg:mt-[56px] px-2 sm:px-4 md:px-6 lg:px-8">
                {testimonials
                  .slice(currentTestimonialSlide * 2, currentTestimonialSlide * 2 + 2)
                  .map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className="flex flex-col w-full lg:w-1/2 relative bg-white rounded-[12px] p-[20px] sm:p-[24px] md:p-[28px] lg:p-[32px] shadow-lg testimonial-card animate-slide-in-up"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <div className="flex flex-row items-start gap-[12px] sm:gap-[16px] mb-[20px] sm:mb-[24px]">
                        <div className="relative flex-shrink-0">
                          <div className="w-[48px] sm:w-[56px] md:w-[64px] h-[48px] sm:h-[56px] md:h-[64px] rounded-full border-[3px] sm:border-[4px] border-[#05835e] overflow-hidden animate-glow">
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col flex-1">
                          <h3 className="text-[16px] sm:text-[18px] md:text-[20px] font-bold text-black mb-[4px] sm:mb-[6px] animate-fade-in-up">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-500 text-[12px] sm:text-[13px] md:text-[14px] mb-[8px] sm:mb-[10px] animate-fade-in-up delay-100">
                            Membres du Club Fitness
                          </p>

                          <div className="flex gap-[2px] sm:gap-[4px] animate-scale-in delay-200">
                            {[...Array(testimonial.rating)].map((_, starIndex) => (
                              <svg
                                key={starIndex}
                                className="w-[14px] sm:w-[16px] h-[14px] sm:h-[16px] text-[#05835e] fill-current animate-bounce-in"
                                style={{ animationDelay: `${starIndex * 100}ms` }}
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                        </div>

                        <div className="ml-auto flex-shrink-0 animate-float">
                          <div className="w-[40px] sm:w-[44px] md:w-[48px] h-[40px] sm:h-[44px] md:h-[48px] bg-[#05835e]/10 rounded-full flex items-center justify-center">
                            <svg
                              className="w-[20px] sm:w-[22px] md:w-[24px] h-[20px] sm:h-[22px] md:h-[24px] text-[#05835e]"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] text-gray-700 text-justify mt-[16px] sm:mt-[20px] animate-fade-in-up delay-300">
                        {testimonial.comment}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div> */}

        {/* Contact Section */}
        <div
          ref={addToRefs}
          id="contact"
          className="w-full bg-global-background5 border-b border-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] mt-[60px] sm:mt-[70px] md:mt-[80px] lg:mt-[96px] py-[32px] sm:py-[40px] md:py-[48px] lg:py-[56px] px-4 sm:px-6 md:px-8 lg:px-8"
        >
          <div className="w-full max-w-[1600px] mx-auto">
            <div className="flex flex-col gap-[32px] sm:gap-[40px] md:gap-[48px] lg:gap-[56px] justify-start items-center w-full">
              {/* Contact Header */}
              <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] justify-start items-center w-full text-center lg:text-left animate-slide-in-up">
                <div className="flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] lg:gap-[18px] justify-start items-center lg:items-start w-full">
                  <div className="flex flex-row justify-center lg:justify-start items-center w-full">
                    <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bahnschrift font-normal uppercase text-global-text1 animate-fade-in-up">
                      LAISSEZ NOUS UN MESSAGE
                    </span>
                    <div className="h-[1px] w-[80px] sm:w-[100px] md:w-[140px] lg:w-[180px] xl:w-[222px] bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] ml-[8px] sm:ml-[12px] md:ml-[16px] lg:ml-[20px] mb-[2px] self-end animate-scale-in delay-200"></div>
                  </div>
                  <h2 className="text-[20px] sm:text-[26px] md:text-[32px] lg:text-[40px] xl:text-[50px] font-bahnschrift font-bold leading-[24px] sm:leading-[32px] md:leading-[38px] lg:leading-[48px] xl:leading-[61px] text-center lg:text-left uppercase bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] bg-clip-text text-transparent w-full animate-typewriter delay-400">
                    NOUS CONTACTEZ
                  </h2>
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-light leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] text-center lg:text-justify lowercase text-global-text1 w-full lg:w-[60%] max-w-[600px] lg:max-w-none px-2 lg:px-0 animate-fade-in-up delay-600">
                    Notre équipe vous attend pour répondre à toutes vos questions et vous guider
                    vers la formule qui vous correspond.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center w-full gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[48px] animate-slide-in-up delay-700 max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-none mx-auto">
                  {/* Phone */}
                  <div className="flex flex-row justify-start items-start w-full lg:w-auto animate-slide-in-left">
                    <div className="flex flex-row justify-center items-center bg-global-background2 rounded-[5px] p-[10px] sm:p-[12px] md:p-[14px] lg:p-[18px] animate-flip flex-shrink-0">
                      <i className="fas fa-phone text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] text-[#05835e]"></i>
                    </div>
                    <div className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[17px] font-kanit font-light leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[24px] text-left text-global-text1 ml-[10px] sm:ml-[12px] md:ml-[14px] lg:ml-[20px] animate-fade-in-up delay-100 flex items-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px] lg:min-h-[76px]">
                      +221 789573842
                      <br />+221 710196868
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-row justify-start items-start w-full lg:w-auto animate-slide-in-up delay-300">
                    <div className="flex flex-row justify-center items-center bg-global-background2 rounded-[5px] p-[10px] sm:p-[12px] md:p-[14px] lg:p-[18px] animate-flip flex-shrink-0">
                      <i className="fas fa-envelope text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] text-[#05835e]"></i>
                    </div>
                    <span className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[17px] font-kanit font-light leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[24px] text-left text-global-text1 ml-[10px] sm:ml-[12px] md:ml-[14px] lg:ml-[20px] animate-fade-in-up delay-200 flex items-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px] lg:min-h-[76px]">
                      info@sunufitness.com
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex flex-row justify-start items-start w-full lg:w-auto animate-slide-in-right">
                    <div className="flex flex-row justify-center items-center bg-global-background2 rounded-[5px] p-[10px] sm:p-[12px] md:p-[14px] lg:p-[18px] animate-flip flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] text-[#05835e]"></i>
                    </div>
                    <div className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[17px] font-kanit font-light leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[24px] text-left text-global-text1 ml-[10px] sm:ml-[12px] md:ml-[14px] lg:ml-[20px] animate-fade-in-up delay-100 flex items-center min-h-[44px] sm:min-h-[52px] md:min-h-[60px] lg:min-h-[76px]">
                      Saly 10
                      <br />
                      Route de Ngaparou Saly Sénégal
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="flex flex-col justify-start items-center w-full animate-scale-in delay-800">
                {/* Success Message */}
                {contactSuccess && (
                  <div className="w-full mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fade-in">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-700 text-sm font-bahnschrift">Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.</span>
                  </div>
                )}

                {/* Error Message */}
                {contactError && (
                  <div className="w-full mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-fade-in">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 text-sm font-bahnschrift">{contactError}</span>
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="flex flex-col justify-start items-start w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] w-full">
                    {/* Name Field */}
                    <div className="flex flex-col gap-[8px] sm:gap-[10px] justify-start items-start w-full animate-slide-in-left">
                      <label className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-normal text-global-text1">
                        Nom complet
                      </label>
                      <input
                        required
                        type="text"
                        name="full_name"
                        value={contactForm.full_name}
                        onChange={handleContactInputChange}
                        placeholder="Entrez votre nom"
                        className="text-[14px] sm:text-[15px] md:text-[16px] font-bahnschrift font-normal text-global-text4 bg-global-background8 rounded-[5px] shadow-md px-[16px] sm:px-[18px] md:px-[20px] py-[12px] sm:py-[14px] md:py-[16px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#05835e] transition-all duration-300 animate-fade-in-up"
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="flex flex-col gap-[8px] sm:gap-[10px] justify-start items-start w-full animate-slide-in-right">
                      <label className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-normal text-global-text1">
                        Numéro de telephone
                      </label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleContactInputChange}
                        placeholder="Entrez votre numéro de telephone"
                        className="text-[14px] sm:text-[15px] md:text-[16px] font-bahnschrift font-normal text-global-text4 bg-global-background8 rounded-[5px] shadow-md px-[16px] sm:px-[18px] md:px-[20px] py-[12px] sm:py-[14px] md:py-[16px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#05835e] transition-all duration-300 animate-fade-in-up delay-100"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-[8px] sm:gap-[10px] justify-start items-start w-full animate-slide-in-left delay-200">
                      <label className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-normal text-global-text1">
                        Adresse mail
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactInputChange}
                        placeholder="Entrez votre Adresse mail"
                        className="text-[14px] sm:text-[15px] md:text-[16px] font-bahnschrift font-normal text-global-text4 bg-global-background8 rounded-[5px] shadow-md px-[16px] sm:px-[18px] md:px-[20px] py-[12px] sm:py-[14px] md:py-[16px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#05835e] transition-all duration-300 animate-fade-in-up delay-200"
                      />
                    </div>

                    {/* Subject Field */}
                    <div className="flex flex-col gap-[8px] sm:gap-[10px] justify-start items-start w-full animate-slide-in-right delay-200">
                      <label className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-normal text-global-text1">
                        Sujet
                      </label>
                      <input
                        required
                        type="text"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleContactInputChange}
                        placeholder="Entrez le sujet"
                        className="text-[14px] sm:text-[15px] md:text-[16px] font-bahnschrift font-normal text-global-text4 bg-global-background8 rounded-[5px] shadow-md px-[16px] sm:px-[18px] md:px-[20px] py-[12px] sm:py-[14px] md:py-[16px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#05835e] transition-all duration-300 animate-fade-in-up delay-300"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="flex flex-col gap-[8px] sm:gap-[10px] justify-start items-start w-full mt-[24px] sm:mt-[28px] md:mt-[32px] animate-slide-in-up delay-400">
                    <label className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-normal text-global-text1">
                      Message
                    </label>
                    <div className="flex flex-row justify-start items-start w-full bg-global-background8 rounded-[5px] shadow-md p-[16px] sm:p-[18px] md:p-[20px] animate-scale-in delay-500">
                      <textarea
                        required
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactInputChange}
                        placeholder="Entrez votre message"
                        rows={6}
                        className="text-[14px] sm:text-[15px] md:text-[16px] font-bahnschrift font-normal text-global-text4 w-full border-0 bg-transparent resize-none focus:outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-row justify-center w-full mt-[32px] sm:mt-[36px] md:mt-[40px] animate-bounce-in delay-600">
                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="text-[14px] sm:text-[16px] md:text-[18px] font-bahnschrift font-normal text-global-text5 bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] rounded-[3px] px-[24px] sm:px-[32px] md:px-[40px] py-[12px] sm:py-[16px] md:py-[18px] hover:opacity-90 transition-opacity duration-300 shadow-lg w-full animate-pulse-hover disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {contactLoading ? 'Envoi en cours...' : 'Envoyez votre Message'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => {
          const homeSection = document.getElementById('home');
          if (homeSection) {
            homeSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="fixed bottom-6 right-6 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] hover:bg-[linear-gradient(90deg,#05835e_0%,_#05835e_100%)] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group animate-bounce-in"
        title="Retour en haut"
        aria-label="Retour en haut de la page"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HomePage;
