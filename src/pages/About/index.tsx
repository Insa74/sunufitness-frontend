import Footer from '../../components/common/Footer';
import Header from '../../components/common/Header';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const handleReservationClick = () => {
    navigate('/services');
  };

  // Certifications data
  const certifications = [
    {
      id: 1,
      title: 'Personal Trainer',
      subtitle: 'Certification Professionnelle',
      description: 'Formation complète en coaching personnel et accompagnement individuel',
      pdfUrl: '/pdfs/Personal Trainer Zertifikat .pdf',
      icon: '👤',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
    },
    {
      id: 2,
      title: 'Fitnesstrainer A-Lizenz',
      subtitle: 'Licence Professionnelle A',
      description: 'Expertise avancée en entraînement fitness et préparation physique',
      pdfUrl: '/pdfs/Fitnesstrainer A-Lizenz.pdf',
      icon: '💪',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
    },
    {
      id: 3,
      title: 'Ernährungstrainer B-Lizenz',
      subtitle: 'Licence Nutrition B',
      description: 'Spécialisation en nutrition sportive et conseil alimentaire',
      pdfUrl: '/pdfs/Ernährugstrainer B-Lizenz.pdf',
      icon: '🥗',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
    },
    {
      id: 4,
      title: 'Certification Avancée',
      subtitle: 'Formation Spécialisée',
      description: 'Certification en techniques avancées de coaching et performance',
      pdfUrl: '/pdfs/20251031081628.pdf',
      icon: '🏆',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500',
    },
  ];

  // Gallery images using online placeholder images
  const galleryImages = [
    '/images/espace/WhatsApp Image 2025-11-07 at 11.03.50 (1).jpeg',
    '/images/espace/WhatsApp Image 2025-11-07 at 11.03.50 (2).jpeg',
    '/images/espace/WhatsApp Image 2025-11-07 at 11.03.50 (3).jpeg',
    '/images/espace/WhatsApp Image 2025-11-07 at 11.03.50.jpeg',
    '/images/espace/WhatsApp Image 2025-11-07 at 11.03.51 (1).jpeg',
    '/images/espace/WhatsApp Image 2025-11-07 at 11.03.50 (2).jpeg',
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
      <style>{`
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
            box-shadow: 0 0 20px rgba(74, 133, 97, 0.3);
          }
          50% {
            box-shadow:
              0 0 40px rgba(74, 133, 97, 0.6),
              0 0 60px rgba(74, 133, 97, 0.4);
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
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
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
        className="relative h-[30rem] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/img_rectangle_20.png')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />

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

        <div className="relative flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-scale-in">
              A propos de nous
            </h1>
            <nav className="text-white text-lg animate-slide-in-up delay-300">
              {/* <span className="text-[#05835e] font-semibold animate-pulse">A propos</span> */}
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
                  src="/images/pf.png"
                  alt="Insa Gaye - Fondateur de SUNUFITNESS"
                  className="w-full h-[500px] object-cover rounded-2xl shadow-xl animate-glow hover:animate-shake cursor-pointer"
                />
                <div className="absolute -bottom-6 -right-6 bg-[#05835e] text-white p-6 rounded-xl shadow-2xl animate-bounce-in delay-400">
                  <p className="text-2xl font-bold">20+ ans</p>
                  <p className="text-sm opacity-90">d'expérience</p>
                </div>
              </div>
            </div>

            {/* Founder Info with Animations */}
            <div ref={addToRefs} className="lg:w-3/5">
              <div className="mb-8 animate-slide-in-right delay-200">
                <span className="text-[#05835e] font-semibold text-lg mb-2 block animate-scale-in">
                  Fondateur
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 animate-typewriter">
                  Insa Gaye
                </h2>
                <p className="text-xl text-[#05835e] font-semibold mb-8 border-l-4 border-[#05835e] pl-4 animate-slide-in-right delay-300">
                  Fondateur de SUNUFITNESS
                </p>
                <p className="text-gray-600 text-lg leading-relaxed text-justify mb-8 animate-slide-in-up delay-400">
                  Depuis plus de 20 ans, je consacre ma vie au sport, à la santé et au bien-être.
                  Mon parcours est le fruit d’une passion profonde pour l’activité physique,
                  soutenue par des diplômes et certifications en préparation physique, nutrition et
                  coaching mental. Mon histoire commence au Sénégal, où le sport m’a très tôt forgé
                  discipline et détermination. En arrivant en Europe, j’ai dû tout recommencer : me
                  former, apprendre, observer, et travailler dur pour transformer cette passion en
                  expertise. J’ai passé des années à perfectionner mes connaissances et mes
                  méthodes, en combinant la rigueur de la science du sport et l’expérience pratique
                  du terrain. Au fil du temps, j’ai eu le privilège d’accompagner des centaines de
                  personnes – hommes, femmes, débutants ou athlètes confirmés – à atteindre leurs
                  objectifs : retrouver la forme, améliorer leurs performances, rééquilibrer leur
                  alimentation et développer une force mentale solide. Aujourd’hui, avec SUNU
                  Fitness, je veux transmettre cette expérience et cette vision : créer un espace
                  unique, professionnel et bienveillant, où chaque individu peut progresser
                  durablement et révéler la meilleure version de lui-même.
                </p>
              </div>

              {/* Contact Info with Animation */}
              <div
                ref={addToRefs}
                className="bg-[#05835e10] p-8 rounded-2xl border-l-4 border-[#05835e] animate-scale-in delay-500"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 flex items-center animate-slide-in-left delay-600">
                    <span className="font-semibold w-24">Site web:</span>
                    <span className="text-[#05835e] animate-pulse">www.sunufitness.com</span>
                  </p>
                  <p className="text-gray-700 flex items-center animate-slide-in-left delay-700">
                    <span className="font-semibold w-24">Email:</span>
                    <span className="text-[#05835e] animate-pulse">info@sunufitness.com</span>
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
            <div className="w-32 h-1.5 bg-[#05835e] mx-auto rounded-full animate-glow"></div>
          </div>
          <div className="bg-white p-12 rounded-2xl shadow-lg text-center animate-slide-in-up delay-200 hover:animate-pulse-hover cursor-pointer">
            <p className="text-2xl text-gray-700 leading-relaxed font-light">
              Avec <span className="font-bold text-[#05835e] animate-pulse">SUNUFITNESS</span>,
              notre mission est simple : donner à chacun les moyens de prendre soin de son corps, de
              renforcer son mental et d'adopter un mode de vie{' '}
              <span className="text-[#05835e] font-semibold animate-pulse">
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
              <p className="text-gray-600 text-justify text-xl mb-12 leading-relaxed animate-slide-in-left delay-100">
                Je crois que le sport n'est pas seulement une activité physique, mais un véritable
                outil de{' '}
                <span className="text-[#05835e] font-semibold animate-pulse">
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
                    <div className="bg-[#05835e20] rounded-xl p-4 mr-6 group-hover:bg-[#05835e] group-hover:scale-110 transition-all duration-300 animate-flip">
                      <svg
                        className="w-6 h-6 text-[#05835e] group-hover:text-white"
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
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#05835e] transition-colors duration-300">
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
                src="/images/nv.jpeg"
                alt="Notre vision SUNUFITNESS"
                className="w-full h-[600px] object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section ref={addToRefs} className="py-20 bg-[#05835e]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-bounce-in">
            Notre Philosophie
          </h2>
          <div className="w-32 h-1.5 bg-white mx-auto mb-12 rounded-full animate-scale-in delay-200"></div>

          <div className="bg-white rounded-2xl p-12 shadow-2xl animate-slide-in-up delay-300 hover:animate-shake cursor-pointer">
            <p className="text-3xl text-[#05835e] font-bold mb-8 leading-tight animate-pulse">
              Discipline, équilibre et accompagnement personnalisé
            </p>
            <p className="text-gray-600 text-xl leading-relaxed">
              Chaque client est unique, et Nous nous engageons à vous offrir un suivi adapté,
              motivant et efficace. Notre approche combine expertise technique et compréhension
              humaine pour vous accompagner dans votre transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section
        ref={addToRefs}
        className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#05835e] rounded-full opacity-5 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full opacity-5 animate-float delay-300"></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-16 animate-scale-in">
            <div className="inline-block mb-4">
              <span className="text-6xl animate-bounce-in">🎓</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Certifications & Qualifications
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#05835e] to-blue-500 mx-auto rounded-full mb-6 animate-glow"></div>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-slide-in-up delay-100">
              Plus de 20 ans d'expérience soutenus par des certifications professionnelles reconnues
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {certifications.map((cert, index) => (
              <div
                key={cert.id}
                className="group relative animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className={`relative h-full ${cert.bgColor} border-2 ${cert.borderColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer overflow-hidden`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>

                  <div className="relative z-10">
                    <div
                      className="text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-bounce-in"
                      style={{ animationDelay: `${index * 150 + 200}ms` }}
                    >
                      {cert.icon}
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#05835e] transition-colors duration-300">
                      {cert.title}
                    </h3>

                    <p className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                      {cert.subtitle}
                    </p>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[60px]">
                      {cert.description}
                    </p>

                    <button
                      onClick={() => setSelectedCert(cert.pdfUrl)}
                      className={`w-full bg-gradient-to-r ${cert.color} text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group/btn`}
                    >
                      <svg
                        className="w-5 h-5 transform group-hover/btn:rotate-12 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                      <span>Voir le certificat</span>
                    </button>
                  </div>

                  <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transform group-hover:rotate-180 transition-transform duration-500">
                    <svg className="w-6 h-6 text-[#05835e]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center animate-slide-in-up delay-500">
            <div className="inline-block bg-gradient-to-r from-[#05835e] to-blue-500 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
              <p className="text-white text-lg md:text-xl font-semibold mb-2">
                ✨ Expertise Certifiée & Reconnue
              </p>
              <p className="text-white/90 text-sm md:text-base">
                Des qualifications professionnelles pour un accompagnement de qualité
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-scale-in"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#05835e] to-blue-500 text-white p-4 flex items-center justify-between z-10 shadow-lg">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                Certificat Professionnel
              </h3>
              <button
                onClick={() => setSelectedCert(null)}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <iframe
              src={selectedCert}
              className="w-full h-full pt-16"
              title="Certification PDF"
            ></iframe>
          </div>
        </div>
      )}

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
      <section ref={addToRefs} className="py-20 bg-gradient-to-r from-[#05835e] to-[#3d6d4f]">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-pulse">
            Prêt à Commencer Votre Transformation ?
          </h2>
          <p className="text-white/80 text-xl mb-12 leading-relaxed max-w-2xl mx-auto animate-slide-in-up delay-100">
            Rejoignez la communauté SUNUFITNESS et démarrez votre voyage vers une vie plus saine et
            équilibrée.
          </p>
          <button
            onClick={handleReservationClick}
            className="bg-white text-[#05835e] px-12 py-5 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:scale-105 transform animate-bounce-in delay-300 hover:animate-shake"
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
