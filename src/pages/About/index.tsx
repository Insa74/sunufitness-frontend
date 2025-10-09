import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleReservationClick = () => {
    navigate('/services');
  };

  // Gallery images using online placeholder images
  const galleryImages = [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&h=400&fit=crop',
  ];

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
    <div className="min-h-screen bg-white overflow-hidden">
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
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
          }
          50% {
            box-shadow:
              0 0 40px rgba(34, 197, 94, 0.6),
              0 0 60px rgba(34, 197, 94, 0.4);
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
      `}</style>

      <Header />

      {/* Hero Section with Crazy Animations */}
      <section
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        {/* Animated Floating Elements */}
        <div className="absolute top-10 left-10 animate-float">
          <div className="w-8 h-8 bg-green-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-20 right-20 animate-float delay-300">
          <div className="w-12 h-12 bg-green-300 rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float delay-500">
          <div className="w-6 h-6 bg-green-500 rounded-full opacity-70"></div>
        </div>

        <div className="relative flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-scale-in">
              A propos de nous
            </h1>
            <nav className="text-white text-lg animate-slide-in-up delay-300">
              <span className="opacity-80">Accueil</span>
              <span className="mx-3 opacity-60">›</span>
              <span className="text-green-400 font-semibold animate-pulse">A propos</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section ref={addToRefs} className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Founder Image with Animation */}
            <div className="lg:w-2/5">
              <div className="relative animate-slide-in-left">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=600&fit=crop&crop=face"
                  alt="Insa Gaye - Fondateur de SUNUFITNESS"
                  className="w-full h-[500px] object-cover rounded-2xl shadow-xl animate-glow hover:animate-shake cursor-pointer"
                />
                <div className="absolute -bottom-6 -right-6 bg-green-600 text-white p-6 rounded-xl shadow-2xl animate-bounce-in delay-400">
                  <p className="text-2xl font-bold">20+ ans</p>
                  <p className="text-sm opacity-90">d'expérience</p>
                </div>
              </div>
            </div>

            {/* Founder Info with Animations */}
            <div ref={addToRefs} className="lg:w-3/5">
              <div className="mb-8 animate-slide-in-right delay-200">
                <span className="text-green-600 font-semibold text-lg mb-2 block animate-scale-in">
                  Fondateur
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 animate-typewriter">
                  Insa Gaye
                </h2>
                <p className="text-xl text-green-600 font-semibold mb-8 border-l-4 border-green-500 pl-4 animate-slide-in-right delay-300">
                  Fondateur de SUNUFITNESS
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-8 animate-slide-in-up delay-400">
                  Depuis plus de 20 ans, je consacre ma vie au sport, à la santé et au bien-être.
                  Mon parcours m'a permis d'accompagner des centaines de personnes à atteindre leurs
                  objectifs, que ce soit en remise en forme, performance sportive, nutrition ou
                  coaching mental.
                </p>
              </div>

              {/* Contact Info with Animation */}
              <div
                ref={addToRefs}
                className="bg-green-50 p-8 rounded-2xl border-l-4 border-green-500 animate-scale-in delay-500"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 flex items-center animate-slide-in-left delay-600">
                    <span className="font-semibold w-24">Site web:</span>
                    <span className="text-green-600 animate-pulse">www.sunufitness.com</span>
                  </p>
                  <p className="text-gray-700 flex items-center animate-slide-in-left delay-700">
                    <span className="font-semibold w-24">Email:</span>
                    <span className="text-green-600 animate-pulse">info@sunufitness.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={addToRefs} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16 animate-scale-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Notre Mission</h2>
            <div className="w-32 h-1.5 bg-green-500 mx-auto rounded-full animate-glow"></div>
          </div>
          <div className="bg-white p-12 rounded-2xl shadow-lg text-center animate-slide-in-up delay-200 hover:animate-pulse-hover cursor-pointer">
            <p className="text-2xl text-gray-700 leading-relaxed font-light">
              Avec <span className="font-bold text-green-600 animate-pulse">SUNUFITNESS</span>,
              notre mission est simple : donner à chacun les moyens de prendre soin de son corps, de
              renforcer son mental et d'adopter un mode de vie{' '}
              <span className="text-green-600 font-semibold animate-pulse">
                sain, durable et équilibré
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section ref={addToRefs} className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 animate-slide-in-left">
                Notre Vision
              </h2>
              <p className="text-gray-600 text-xl mb-12 leading-relaxed animate-slide-in-left delay-100">
                Je crois que le sport n'est pas seulement une activité physique, mais un véritable
                outil de{' '}
                <span className="text-green-600 font-semibold animate-pulse">
                  transformation personnelle
                </span>
                .
              </p>
              <div className="space-y-6">
                {[
                  {
                    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                    title: 'Le Fitness',
                    desc: 'Pour un corps fort et en bonne santé',
                  },
                  {
                    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                    title: 'La Nutrition',
                    desc: "Comme fondement d'une énergie durable",
                  },
                  {
                    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                    title: 'Le Mental',
                    desc: 'Comme moteur pour atteindre ses rêves',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start group animate-slide-in-left"
                    style={{ animationDelay: `${200 + index * 100}ms` }}
                  >
                    <div className="bg-green-100 rounded-xl p-4 mr-6 group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300 animate-flip">
                      <svg
                        className="w-6 h-6 text-green-600 group-hover:text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={item.icon}
                        ></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 animate-slide-in-right delay-300">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=700&fit=crop"
                alt="Notre vision SUNUFITNESS"
                className="w-full h-[600px] object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section ref={addToRefs} className="py-20 bg-green-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-bounce-in">
            Notre Philosophie
          </h2>
          <div className="w-32 h-1.5 bg-white mx-auto mb-12 rounded-full animate-scale-in delay-200"></div>

          <div className="bg-white rounded-2xl p-12 shadow-2xl animate-slide-in-up delay-300 hover:animate-shake cursor-pointer">
            <p className="text-3xl text-green-600 font-bold mb-8 leading-tight animate-pulse">
              Discipline, équilibre et accompagnement personnalisé
            </p>
            <p className="text-gray-600 text-xl leading-relaxed">
              Chaque client est unique, et je m'engage à lui offrir un suivi adapté, motivant et
              efficace. Notre approche combine expertise technique et compréhension humaine pour
              vous accompagner dans votre transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section ref={addToRefs} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 animate-scale-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Notre Espace</h2>
            <div className="w-32 h-1.5 bg-green-500 mx-auto rounded-full mb-4 animate-glow"></div>
            <p className="text-gray-600 text-xl animate-slide-in-up delay-100">
              Découvrez l'environnement SUNUFITNESS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={image}
                  alt={`Salle SUNUFITNESS ${index + 1}`}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-lg font-semibold">Espace {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={addToRefs} className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-pulse">
            Prêt à Commencer Votre Transformation ?
          </h2>
          <p className="text-green-100 text-xl mb-12 leading-relaxed max-w-2xl mx-auto animate-slide-in-up delay-100">
            Rejoignez la communauté SUNUFITNESS et démarrez votre voyage vers une vie plus saine et
            équilibrée.
          </p>
          <button
            onClick={handleReservationClick}
            className="bg-white text-green-600 px-12 py-5 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:scale-105 transform animate-bounce-in delay-300 hover:animate-shake"
          >
            Commencer Maintenant
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
