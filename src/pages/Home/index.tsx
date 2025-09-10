import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Button from '../../components/ui/Button';
import Footer from '../../components/common/Footer';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Carousel states
  const [currentServiceSlide, setCurrentServiceSlide] = useState(0);
  const [currentTestimonialSlide, setCurrentTestimonialSlide] = useState(0);

  // Navigation function
  const handleReservationClick = () => {
    navigate('/reservation');
  };

  // Services data
  const services = [
    {
      id: 1,
      icon: '/images/img_game_icons_muscular_torso.png',
      image: '/images/img_rectangle_24.png',
      title: 'MUSCULATION & CARDIO',
      description:
        'Accédez à des machines performantes et des espaces dédiés pour sculpter votre corps et améliorer votre endurance.',
    },
    {
      id: 2,
      icon: '/images/img_fa_users.png',
      image: '/images/img_rectangle_24_214x358.png',
      title: 'COURS COLLECTIFS',
      description:
        'Yoga, HIIT, Pilates, Zumba… Des séances dynamiques pour brûler des calories en groupe et en musique !',
    },
    {
      id: 3,
      icon: '/images/img_game_icons_muscular_torso.png',
      image: '/images/img_rectangle_24.png',
      title: 'COACHING PERSONNEL',
      description:
        'Un accompagnement sur mesure avec nos coachs certifiés pour atteindre vos objectifs rapidement et efficacement.',
    },
    {
      id: 4,
      icon: '/images/img_fa_users.png',
      image: '/images/img_rectangle_24_214x358.png',
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
  return (
    <div className="w-full bg-global-background8">
      <Header />
      <div className="flex flex-col justify-start items-center w-full pt-[60px]">
        {/* Hero Section */}
        <div className="relative w-full h-screen min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
          {/* Hero Background Image with Overlays */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/img_rectangle_4.png')" }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-global-background1 opacity-60"></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(91deg,#21ac2899_0%,_#00000099_100%)]"></div>

            {/* Additional Dark Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#0000007f_0%,_#0000007f_100%)]"></div>
          </div>

          {/* Decorative Circles - Hidden on mobile, visible on larger screens */}
          <div className="hidden md:block absolute top-0 right-[20px] md:right-[80px] lg:right-[150px] xl:right-[224px] w-[150px] md:w-[200px] lg:w-[300px] xl:w-[400px] h-[150px] md:h-[200px] lg:h-[300px] xl:h-[398px] z-10">
            <img
              src="/images/img_ellipse_2.svg"
              alt="Decorative circle"
              className="w-full h-full object-contain opacity-80"
            />
          </div>

          <div className="hidden lg:block absolute top-[150px] lg:top-[250px] xl:top-[410px] left-0 w-[100px] lg:w-[180px] xl:w-[274px] h-[200px] lg:h-[400px] xl:h-[668px] z-10">
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
                <h1 className="text-[20px] xs:text-[24px] sm:text-[32px] md:text-[42px] lg:text-[56px] xl:text-[68px] font-bahnschrift font-bold leading-[24px] xs:leading-[28px] sm:leading-[38px] md:leading-[50px] lg:leading-[66px] xl:leading-[82px] text-center text-global-text5 uppercase w-full max-w-[900px]">
                  SUNU FITNESS AND MORE
                </h1>
                <p className="text-[12px] xs:text-[13px] sm:text-[14px] md:text-[16px] lg:text-[17px] xl:text-[18px] font-bahnschrift font-normal leading-[16px] xs:leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[24px] xl:leading-[26px] text-center text-global-text5 w-full max-w-[800px] px-2">
                  Bienvenue dans votre centre de fitness ultime, conçu pour vous accompagner dans
                  l'atteinte de vos objectifs sportifs. Que vous soyez débutant ou athlète confirmé,
                  nos coachs experts vous aideront à repousser vos limites.
                </p>
              </div>

              {/* Hero Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-[16px] sm:gap-[20px] md:gap-[24px] w-full max-w-[500px] sm:max-w-[600px] px-4">
                <button
                  onClick={handleReservationClick}
                  className="flex justify-center items-center gap-[8px] bg-global-background10 border border-global-text5 rounded-[5px] px-[20px] sm:px-[24px] md:px-[48px] py-[12px] sm:py-[14px] w-full sm:w-auto min-w-[140px] sm:min-w-[160px]  hover:text-global-background10 transition-all duration-300"
                >
                  <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bahnschrift font-normal text-white text-current">
                    Réservez
                  </span>
                  <img
                    src="/images/img_basil_arrow_up_outline.svg"
                    alt="Arrow"
                    className="w-[16px] sm:w-[18px] md:w-[20px] h-[16px] sm:h-[18px] md:h-[20px]"
                  />
                </button>

                <button className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bahnschrift font-normal text-global-text5 bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] border border-[#5dcd62] rounded-[5px] px-[20px] sm:px-[24px] md:px-[60px] py-[12px] sm:py-[14px] w-full sm:w-auto min-w-[140px] sm:min-w-[160px] hover:opacity-90 transition-opacity duration-300">
                  Contact
                </button>
              </div>
            </div>
          </div>

          {/* Service Cards - Desktop only absolute positioning */}
          <div className="hidden lg:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-[1200px] px-4 sm:px-6 md:px-8 z-20">
            <div className="flex flex-row gap-[30px] w-full">
              {/* Excellence Card */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[378px] bg-global-background8 rounded-[3px] shadow-[0px_4px_4px_#0000003f] p-[24px] min-h-[200px]">
                <div className="flex flex-col justify-center items-center w-auto bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[3px] p-[8px]">
                  <img
                    src="/images/img_game_icons_sport_medal.svg"
                    alt="Sport medal"
                    className="w-[40px] h-[40px]"
                  />
                </div>
                <h3 className="text-[18px] font-bahnschrift font-semibold leading-[22px] text-justify text-global-text1 mt-[20px]">
                  Excellence & Tradition Sportive
                </h3>
                <p className="text-[14px] font-bahnschrift font-light leading-[18px] text-justify text-global-text1 mt-[12px] w-full">
                  Nous combinons les méthodes d'entraînement modernes avec l'énergie et la passion
                  pour vous offrir une expérience unique.
                </p>
              </div>

              {/* Community Card */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[378px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[3px] shadow-[0px_4px_4px_#0000003f] p-[24px] min-h-[200px]">
                <div className="flex flex-col justify-center items-center w-[50px] bg-global-background8 rounded-[3px] p-[8px]">
                  <img
                    src="/images/img_fa_solid_users.png"
                    alt="Users"
                    className="w-full h-[30px]"
                  />
                </div>
                <h3 className="text-[18px] font-bahnschrift font-semibold leading-[22px] text-justify text-global-text5 mt-[20px]">
                  Communauté & Solidarité
                </h3>
                <p className="text-[14px] font-bahnschrift font-light leading-[18px] text-justify text-global-text5 mt-[12px] w-full">
                  Plus qu'une salle de sport, nous sommes une famille ! Chez nous, l'entraide et la
                  bonne humeur sont aussi importantes que la performance.
                </p>
              </div>

              {/* Accessibility Card */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[378px] bg-global-background8 rounded-[3px] shadow-[0px_4px_4px_#0000003f] p-[24px] min-h-[200px]">
                <div className="flex flex-col justify-center items-center w-auto bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[3px] p-[8px]">
                  <img
                    src="/images/img_material_symbol.svg"
                    alt="Material symbol"
                    className="w-[40px] h-[40px]"
                  />
                </div>
                <h3 className="text-[18px] font-bahnschrift font-semibold leading-[22px] text-justify text-global-text1 mt-[20px]">
                  Accessibilité & Bien-être pour Tous
                </h3>
                <p className="text-[14px] font-bahnschrift font-light leading-[18px] text-justify text-global-text1 mt-[12px] w-full">
                  Nous croyons que le fitness doit être accessible à tous, quel que soit le niveau
                  ou le budget. Nos tarifs adaptés et nos programmes variés permettent à chacun de
                  progresser à son rythme.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Cards - Mobile/Tablet Section */}
        <div className="block lg:hidden w-full mt-[40px] sm:mt-[60px] md:mt-[80px] px-4 sm:px-6 md:px-8">
          <div className="w-full max-w-[1200px] mx-auto">
            <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] w-full">
              {/* Excellence Card */}
              <div className="flex flex-col justify-start items-start w-full bg-global-background8 rounded-[5px] shadow-lg p-[20px] sm:p-[24px] min-h-[180px] sm:min-h-[200px]">
                <div className="flex flex-col justify-center items-center w-[44px] sm:w-[50px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] p-[8px] sm:p-[10px]">
                  <img
                    src="/images/img_game_icons_sport_medal.svg"
                    alt="Sport medal"
                    className="w-[28px] sm:w-[32px] md:w-[36px] h-[28px] sm:h-[32px] md:h-[36px]"
                  />
                </div>
                <h3 className="text-[16px] sm:text-[17px] md:text-[18px] font-bahnschrift font-semibold leading-[20px] sm:leading-[21px] md:leading-[22px] text-center text-global-text1 mt-[16px] sm:mt-[18px] md:mt-[20px]">
                  Excellence & Tradition Sportive
                </h3>
                <p className="text-[13px] sm:text-[14px] md:text-[15px] font-bahnschrift font-light leading-[17px] sm:leading-[18px] md:leading-[19px] text-center text-global-text1 mt-[10px] sm:mt-[12px] w-full">
                  Nous combinons les méthodes d'entraînement modernes avec l'énergie et la passion
                  pour vous offrir une expérience unique.
                </p>
              </div>

              {/* Community Card */}
              <div className="flex flex-col justify-start items-start w-full bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] shadow-lg p-[20px] sm:p-[24px] min-h-[180px] sm:min-h-[200px]">
                <div className="flex flex-col justify-center items-center w-[44px] sm:w-[50px] bg-global-background8 rounded-[5px] p-[8px] sm:p-[10px]">
                  <img
                    src="/images/img_fa_solid_users.png"
                    alt="Users"
                    className="w-full h-[24px] sm:h-[26px] md:h-[30px]"
                  />
                </div>
                <h3 className="text-[16px] sm:text-[17px] md:text-[18px] font-bahnschrift font-semibold leading-[20px] sm:leading-[21px] md:leading-[22px] text-center text-global-text5 mt-[16px] sm:mt-[18px] md:mt-[20px]">
                  Communauté & Solidarité
                </h3>
                <p className="text-[13px] sm:text-[14px] md:text-[15px] font-bahnschrift font-light leading-[17px] sm:leading-[18px] md:leading-[19px] text-center text-global-text5 mt-[10px] sm:mt-[12px] w-full">
                  Plus qu'une salle de sport, nous sommes une famille ! Chez nous, l'entraide et la
                  bonne humeur sont aussi importantes que la performance.
                </p>
              </div>

              {/* Accessibility Card */}
              <div className="flex flex-col justify-start items-start w-full bg-global-background8 rounded-[5px] shadow-lg p-[20px] sm:p-[24px] min-h-[180px] sm:min-h-[200px]">
                <div className="flex flex-col justify-center items-center w-[44px] sm:w-[50px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] p-[8px] sm:p-[10px]">
                  <img
                    src="/images/img_material_symbol.svg"
                    alt="Material symbol"
                    className="w-[28px] sm:w-[32px] md:w-[36px] h-[28px] sm:h-[32px] md:h-[36px]"
                  />
                </div>
                <h3 className="text-[16px] sm:text-[17px] md:text-[18px] font-bahnschrift font-semibold leading-[20px] sm:leading-[21px] md:leading-[22px] text-center text-global-text1 mt-[16px] sm:mt-[18px] md:mt-[20px]">
                  Accessibilité & Bien-être pour Tous
                </h3>
                <p className="text-[13px] sm:text-[14px] md:text-[15px] font-bahnschrift font-light leading-[17px] sm:leading-[18px] md:leading-[19px] text-center text-global-text1 mt-[10px] sm:mt-[12px] w-full">
                  Nous croyons que le fitness doit être accessible à tous, quel que soit le niveau
                  ou le budget. Nos tarifs adaptés et nos programmes variés permettent à chacun de
                  progresser à son rythme.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div
          id="about"
          className="w-full bg-global-background4 mt-[60px] sm:mt-[80px] md:mt-[100px] lg:mt-[180px]"
        >
          <div className="w-full max-w-[1378px] mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-center py-[40px] sm:py-[50px] md:py-[60px] lg:py-[80px] gap-[32px] sm:gap-[40px] lg:gap-[60px]">
              {/* Left Image Section */}
              <div className="relative w-full lg:w-[45%] flex justify-center lg:justify-start mb-8 lg:mb-0">
                <div className="relative w-[280px] sm:w-[320px] md:w-[380px] lg:w-[480px] xl:w-[580px] h-[300px] sm:h-[350px] md:h-[420px] lg:h-[530px] xl:h-[670px]">
                  <img
                    src="/images/img_02_1.png"
                    alt="Fitness training"
                    className="absolute top-[8px] sm:top-[12px] md:top-[15px] lg:top-[18px] xl:top-[20px] left-[20px] sm:left-[25px] md:left-[30px] lg:left-[40px] xl:left-[62px] w-[240px] sm:w-[270px] md:w-[320px] lg:w-[400px] xl:w-[518px] h-[280px] sm:h-[320px] md:h-[380px] lg:h-[480px] xl:h-[630px] object-cover rounded-[5px] shadow-lg"
                  />
                  <img
                    src="/images/img_cercle.png"
                    alt="Decorative circle"
                    className="absolute top-0 left-0 w-[32px] sm:w-[40px] md:w-[50px] lg:w-[65px] xl:w-[80px] h-[38px] sm:h-[48px] md:h-[60px] lg:h-[78px] xl:h-[98px] object-contain"
                  />
                </div>
              </div>

              {/* Right Content Section */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[50%] text-center lg:text-left">
                <div className="flex flex-row justify-center lg:justify-start items-center w-full mb-[12px] sm:mb-[16px] md:mb-[18px] lg:mb-[20px]">
                  <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bahnschrift font-normal uppercase text-global-text1">
                    A PROPOS DE NOUS
                  </span>
                  <div className="h-[1px] w-[80px] sm:w-[100px] md:w-[140px] lg:w-[180px] xl:w-[222px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] ml-[8px] sm:ml-[12px] md:ml-[16px] lg:ml-[20px] mb-[2px] self-end"></div>
                </div>

                <h2 className="text-[24px] sm:text-[28px] md:text-[36px] lg:text-[44px] xl:text-[50px] font-bahnschrift font-bold leading-[28px] sm:leading-[34px] md:leading-[42px] lg:leading-[52px] xl:leading-[61px] text-center lg:text-left uppercase bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] bg-clip-text text-transparent mt-[8px] sm:mt-[12px] md:mt-[16px] lg:mt-[20px] w-full">
                  SUNU FITNESS
                </h2>

                <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-light leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] text-center lg:text-justify lowercase text-global-text1 w-full mt-[16px] sm:mt-[20px] md:mt-[24px] lg:mt-[28px] px-2 lg:px-0">
                  Depuis notre création, nous nous engageons à offrir un environnement motivant et
                  inclusif pour tous les passionnés de fitness, où chaque pas vers vos objectifs est
                  célébré et chaque défi devient une occasion de grandir. Notre équipe de coachs
                  certifiés est là pour vous guider avec expertise, vous challenger avec
                  bienveillance et vous faire progresser durablement, quel que soit votre niveau,
                  que vous soyez débutant cherchant les bases solides ou athlète confirmé visant des
                  performances optimisées.
                </p>

                <div className="flex flex-row justify-start items-start w-full bg-[linear-gradient(90deg,#5dcd6219_0%,_#21ac2819_100%)] mt-[24px] sm:mt-[28px] md:mt-[32px] lg:mt-[36px] p-[16px] sm:p-[18px] md:p-[20px] lg:p-[24px] rounded-[5px]">
                  <div className="w-[4px] h-[60px] sm:h-[70px] md:h-[80px] lg:h-[90px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] flex-shrink-0 mt-[4px]"></div>
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-light leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] text-center lg:text-justify lowercase text-global-text1 ml-[12px] sm:ml-[16px] md:ml-[18px] lg:ml-[20px]">
                    Rejoignez-nous pour transformer votre entraînement en une expérience inspirante,
                    adaptée à vos besoins, votre rythme et vos rêves, et découvrez comment chaque
                    séance peut devenir une étape vers une meilleure version de vous-même.
                  </p>
                </div>

                <div className="flex justify-center lg:justify-start w-full mt-[32px] sm:mt-[36px] md:mt-[40px] lg:mt-[44px]">
                  <button
                    onClick={handleReservationClick}
                    className="flex justify-center items-center gap-[8px] text-[14px] sm:text-[16px] md:text-[18px] font-bahnschrift font-normal text-global-text5 bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[3px] px-[24px] sm:px-[28px] md:px-[32px] py-[12px] sm:py-[14px] md:py-[16px] hover:opacity-90 transition-opacity duration-300 w-full sm:w-auto max-w-[280px]"
                  >
                    Réservez maintenant
                    <img
                      src="/images/img_solararrowuplinear.svg"
                      alt="Arrow"
                      className="w-[16px] sm:w-[18px] md:w-[20px] h-[16px] sm:h-[18px] md:h-[20px]"
                    />
                  </button>
                </div>

                <img
                  src="/images/img_cercle.png"
                  alt="Decorative circle"
                  className="w-[44px] sm:w-[60px] md:w-[74px] lg:w-[88px] h-[54px] sm:h-[74px] md:h-[91px] lg:h-[108px] self-end mt-[20px] sm:mt-[24px] md:mt-[27px] lg:mt-[30px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div id="services" className="w-full mt-[100px] sm:mt-[120px] md:mt-[140px] lg:mt-[96px]">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
            <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] justify-start items-center">
              {/* Services Header */}
              <div className="flex flex-col lg:flex-row justify-between items-center w-full gap-[24px] lg:gap-[40px]">
                <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[28px] justify-start items-center lg:items-start w-full lg:w-[60%] text-center lg:text-left">
                  <div className="flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] lg:gap-[18px] justify-start items-center lg:items-start w-full">
                    <div className="flex flex-row justify-center lg:justify-start items-center w-full">
                      <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bahnschrift font-normal uppercase text-global-text1">
                        NOS SERVICES
                      </span>
                      <div className="h-[1px] w-[80px] sm:w-[100px] md:w-[140px] lg:w-[180px] xl:w-[222px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] ml-[8px] sm:ml-[12px] md:ml-[16px] lg:ml-[20px] mb-[2px] self-end"></div>
                    </div>
                    <h2 className="text-[20px] sm:text-[26px] md:text-[32px] lg:text-[40px] xl:text-[50px] font-bahnschrift font-bold leading-[24px] sm:leading-[32px] md:leading-[38px] lg:leading-[48px] xl:leading-[61px] text-center lg:text-left uppercase bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] bg-clip-text text-transparent w-full">
                      DÉCOUVREZ NOS SERVICES
                    </h2>
                  </div>
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-light leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] text-center lg:text-justify lowercase text-global-text1 w-full max-w-[600px] lg:max-w-none px-2 lg:px-0">
                    Nous proposons une variété de services pour répondre à tous vos besoins fitness
                    et bien-être, en adaptant chaque offre à votre style de vie et à vos objectifs
                    personnels afin de vous aider à progresser durablement: coaching personnalisé,
                    programmes d'entraînement sur mesure, séances collectives dynamiques.
                  </p>
                </div>

                {/* Navigation Arrows */}
                <div className="flex flex-row justify-center lg:justify-end items-center w-full lg:w-auto gap-[32px] sm:gap-[40px] md:gap-[48px] lg:gap-[56px]">
                  <button
                    onClick={prevServiceSlide}
                    className="w-[44px] sm:w-[50px] md:w-[56px] lg:w-[62px] h-[44px] sm:h-[50px] md:h-[56px] lg:h-[62px] bg-global-background3 rounded-[22px] sm:rounded-[25px] md:rounded-[28px] lg:rounded-[30px] p-[8px] sm:p-[10px] md:p-[12px] lg:p-[14px] hover:bg-global-background2 transition-colors duration-300 shadow-md"
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
                    className="w-[44px] sm:w-[50px] md:w-[56px] lg:w-[62px] h-[44px] sm:h-[50px] md:h-[56px] lg:h-[62px] bg-global-background3 rounded-[22px] sm:rounded-[25px] md:rounded-[28px] lg:rounded-[30px] p-[8px] sm:p-[10px] md:p-[12px] lg:p-[14px] hover:bg-global-background2 transition-colors duration-300 shadow-md"
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
                    .map((service) => (
                      <div
                        key={service.id}
                        className="flex flex-col gap-[14px] sm:gap-[16px] justify-start items-center w-full"
                      >
                        <div className="flex flex-row gap-[3px] sm:gap-[4px] justify-center items-center w-full">
                          <button className="w-[50px] sm:w-[58px] h-[50px] sm:h-[58px] bg-global-background2 rounded-[25px] sm:rounded-[29px] p-[8px] sm:p-[9px]">
                            <img
                              src={service.icon}
                              alt={service.title}
                              className="w-full h-full object-contain"
                            />
                          </button>
                          <div className="h-[1px] w-full bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)]"></div>
                        </div>
                        <div className="flex flex-col justify-start items-center w-full bg-global-background6 rounded-[10px] shadow-[0px_4px_4px_#0000003f] p-[20px] sm:p-[24px]">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-[180px] sm:h-[200px] object-cover rounded-[3px]"
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
                  <div className="flex flex-col gap-[14px] sm:gap-[16px] justify-start items-center w-full">
                    <div className="flex flex-row gap-[3px] sm:gap-[4px] justify-center items-center w-full">
                      <button className="w-[50px] sm:w-[58px] h-[50px] sm:h-[58px] bg-global-background2 rounded-[25px] sm:rounded-[29px] p-[8px] sm:p-[9px]">
                        <img
                          src="/images/img_icon_park_solid_sport.png"
                          alt="Private coaching"
                          className="w-full h-full object-contain"
                        />
                      </button>
                      <div className="h-[1px] w-full bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)]"></div>
                    </div>
                    <div className="flex flex-col justify-start items-center w-full bg-global-background6 rounded-[10px] shadow-[0px_4px_4px_#0000003f] p-[20px] sm:p-[24px]">
                      <img
                        src="/images/img_rectangle_24_1.png"
                        alt="Private coaching session"
                        className="w-full h-[180px] sm:h-[200px] object-cover rounded-[3px]"
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
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex flex-col gap-[14px] sm:gap-[16px] md:gap-[17px] lg:gap-[18px] justify-start items-center w-full lg:w-[360px] flex-shrink-0"
                      >
                        <div className="flex flex-row gap-[3px] sm:gap-[4px] md:gap-[5px] lg:gap-[6px] justify-center items-center w-full">
                          <button className="w-[50px] sm:w-[58px] md:w-[62px] lg:w-[66px] h-[50px] sm:h-[58px] md:h-[62px] lg:h-[66px] bg-global-background2 rounded-[25px] sm:rounded-[29px] md:rounded-[31px] lg:rounded-[32px] p-[8px] sm:p-[9px] md:p-[9px] lg:p-[10px]">
                            <img
                              src={service.icon}
                              alt={service.title}
                              className="w-full h-full object-contain"
                            />
                          </button>
                          <div className="h-[1px] w-full bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)]"></div>
                        </div>
                        <div className="flex flex-col justify-between w-full bg-global-background6 rounded-[10px] shadow-[0px_4px_4px_#0000003f] p-[21px] sm:p-[24px] md:p-[26px] lg:p-[28px] pb-[32px] h-[380px]">
                          <div className="flex flex-col">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-full h-[161px] sm:h-[185px] md:h-[200px] lg:h-[214px] object-cover rounded-[3px]"
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
                    <div className="flex flex-col gap-[14px] sm:gap-[16px] md:gap-[17px] lg:gap-[18px] justify-start items-center w-full lg:w-[426px] flex-shrink-0">
                      <div className="flex flex-row gap-[3px] sm:gap-[4px] md:gap-[5px] lg:gap-[6px] justify-center items-center w-full">
                        <button className="w-[50px] sm:w-[58px] md:w-[62px] lg:w-[66px] h-[50px] sm:h-[58px] md:h-[62px] lg:h-[66px] bg-global-background2 rounded-[25px] sm:rounded-[29px] md:rounded-[31px] lg:rounded-[32px] p-[8px] sm:p-[9px] md:p-[9px] lg:p-[10px]">
                          <img
                            src="/images/img_icon_park_solid_sport.png"
                            alt="Private coaching"
                            className="w-full h-full object-contain"
                          />
                        </button>
                        <div className="h-[1px] w-full bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)]"></div>
                      </div>
                      <div className="flex flex-col justify-between w-full bg-global-background6 rounded-[10px] shadow-[0px_4px_4px_#0000003f] p-[21px] sm:p-[24px] md:p-[26px] lg:p-[28px] h-[380px]">
                        <div className="flex flex-col">
                          <img
                            src="/images/img_rectangle_24_1.png"
                            alt="Private coaching session"
                            className="w-full h-[161px] sm:h-[185px] md:h-[200px] lg:h-[214px] object-cover rounded-[3px]"
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
                  className="w-full h-[229px] sm:h-[320px] md:h-[389px] lg:h-[458px] bg-cover bg-center relative mt-[150px] sm:mt-[200px] md:mt-[250px] lg:mt-[300px]"
                  style={{ backgroundImage: "url('/images/img_rectangle_20.png')" }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(104deg,#5dcd62e5_0%,_#000000e5_100%)]"></div>
                  <div className="relative z-10 flex flex-col gap-[20px] sm:gap-[25px] md:gap-[28px] lg:gap-[30px] justify-center lg:justify-end items-center w-full h-full px-[20px] sm:px-[30px] md:px-[35px] lg:px-[40px] lg:pb-[60px]">
                    <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-comic-sans font-normal leading-[26px] sm:leading-[28px] md:leading-[30px] lg:leading-[32px] text-center text-global-text5 max-w-[320px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] mx-auto">
                      Vous ne rejoignez pas seulement un centre de Fitness, vous intégrez une
                      seconde famille
                    </p>
                    <div className="flex justify-center items-center w-full">
                      <button
                        onClick={handleReservationClick}
                        className="flex gap-[6px] sm:gap-[7px] md:gap-[8px] lg:gap-[9px] justify-center items-center border border-[#5dcd62] rounded-[3px] bg-global-background9 px-[10px] sm:px-[12px] md:px-[14px] lg:px-[16px] py-[6px] sm:py-[7px] md:py-[8px] lg:py-[9px] hover:bg-[#5dcd62] hover:text-global-text1 transition-all"
                      >
                        <span className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-normal leading-[18px] sm:leading-[19px] md:leading-[20px] lg:leading-[21px] text-global-text5">
                          Réservez maintenant
                        </span>
                        <img
                          src="/images/img_solararrowuplinear.svg"
                          alt="Arrow"
                          className="w-[24px] sm:w-[26px] md:w-[28px] lg:w-[30px] h-[24px] sm:h-[26px] md:h-[28px] lg:h-[30px]"
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
        <div className="w-full mt-[60px] sm:mt-[70px] md:mt-[80px] lg:mt-[96px] px-4 sm:px-6 md:px-8 lg:px-8">
          <div className="w-full max-w-[1376px] mx-auto">
            <div className="flex flex-col justify-start items-start w-full">
              <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start w-full gap-[20px] lg:gap-[40px]">
                <div className="flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] lg:gap-[18px] justify-start items-center lg:items-start w-full lg:w-auto text-center lg:text-left">
                  <div className="flex flex-row justify-center lg:justify-start items-center w-full">
                    <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bahnschrift font-normal uppercase text-global-text1">
                      TÉMOIGNAGE
                    </span>
                    <div className="h-[1px] w-[80px] sm:w-[100px] md:w-[140px] lg:w-[180px] xl:w-[222px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] ml-[8px] sm:ml-[12px] md:ml-[16px] lg:ml-[20px] mb-[2px] self-end"></div>
                  </div>
                  <h2 className="text-[20px] sm:text-[26px] md:text-[32px] lg:text-[40px] xl:text-[50px] font-bahnschrift font-bold leading-[24px] sm:leading-[32px] md:leading-[38px] lg:leading-[48px] xl:leading-[61px] text-center lg:text-left uppercase bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] bg-clip-text text-transparent w-full">
                    TÉMOIGNAGES CLIENTS
                  </h2>
                </div>

                {/* Navigation Arrows */}
                <div className="flex flex-row justify-center lg:justify-end items-center gap-[32px] sm:gap-[40px] md:gap-[48px] lg:gap-[56px] w-full lg:w-auto">
                  <button
                    onClick={prevTestimonialSlide}
                    className="w-[44px] sm:w-[50px] md:w-[56px] lg:w-[62px] h-[44px] sm:h-[50px] md:h-[56px] lg:h-[62px] bg-global-background3 rounded-[22px] sm:rounded-[25px] md:rounded-[28px] lg:rounded-[30px] p-[8px] sm:p-[10px] md:p-[12px] lg:p-[14px] hover:bg-global-background2 transition-colors duration-300 shadow-md"
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
                    className="w-[44px] sm:w-[50px] md:w-[56px] lg:w-[62px] h-[44px] sm:h-[50px] md:h-[56px] lg:h-[62px] bg-global-background3 rounded-[22px] sm:rounded-[25px] md:rounded-[28px] lg:rounded-[30px] p-[8px] sm:p-[10px] md:p-[12px] lg:p-[14px] hover:bg-global-background2 transition-colors duration-300 shadow-md"
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

              <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-light leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] text-center lg:text-left text-global-text1 w-full lg:w-[60%] max-w-[600px] lg:max-w-none mt-[16px] sm:mt-[20px] md:mt-[24px] lg:mt-[28px] px-2 lg:px-0">
                Nos membres parlent mieux que nous ! Découvrez leurs parcours inspirants et
                laissez-vous motiver par leurs transformations.
              </p>

              {/* Testimonial Cards */}
              <div className="flex flex-col lg:flex-row gap-[24px] sm:gap-[32px] md:gap-[40px] lg:gap-[48px] w-full mt-[32px] sm:mt-[40px] md:mt-[48px] lg:mt-[56px] px-2 sm:px-4 md:px-6 lg:px-8">
                {testimonials
                  .slice(currentTestimonialSlide * 2, currentTestimonialSlide * 2 + 2)
                  .map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="flex flex-col w-full lg:w-1/2 relative bg-white rounded-[12px] p-[20px] sm:p-[24px] md:p-[28px] lg:p-[32px] shadow-lg"
                    >
                      {/* Profile Section */}
                      <div className="flex flex-row items-start gap-[12px] sm:gap-[16px] mb-[20px] sm:mb-[24px]">
                        {/* Profile Image with Green Border */}
                        <div className="relative flex-shrink-0">
                          <div className="w-[48px] sm:w-[56px] md:w-[64px] h-[48px] sm:h-[56px] md:h-[64px] rounded-full border-[3px] sm:border-[4px] border-green-500 overflow-hidden">
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Name and Role */}
                        <div className="flex flex-col flex-1">
                          <h3 className="text-[16px] sm:text-[18px] md:text-[20px] font-bold text-black mb-[4px] sm:mb-[6px]">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-500 text-[12px] sm:text-[13px] md:text-[14px] mb-[8px] sm:mb-[10px]">
                            Membres du Club Fitness
                          </p>

                          {/* Star Rating */}
                          <div className="flex gap-[2px] sm:gap-[4px]">
                            {[...Array(testimonial.rating)].map((_, index) => (
                              <svg
                                key={index}
                                className="w-[14px] sm:w-[16px] h-[14px] sm:h-[16px] text-green-500 fill-current"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                        </div>

                        {/* Quote Icon */}
                        <div className="ml-auto flex-shrink-0">
                          <div className="w-[40px] sm:w-[44px] md:w-[48px] h-[40px] sm:h-[44px] md:h-[48px] bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-[20px] sm:w-[22px] md:w-[24px] h-[20px] sm:h-[22px] md:h-[24px] text-green-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Testimonial Text */}
                      <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] text-gray-700 text-justify mt-[16px] sm:mt-[20px]">
                        {testimonial.comment}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div
          id="contact"
          className="w-full bg-global-background5 border-b border-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] mt-[60px] sm:mt-[70px] md:mt-[80px] lg:mt-[96px] py-[32px] sm:py-[40px] md:py-[48px] lg:py-[56px] px-4 sm:px-6 md:px-8 lg:px-8"
        >
          <div className="w-full max-w-[1600px] mx-auto">
            <div className="flex flex-col gap-[32px] sm:gap-[40px] md:gap-[48px] lg:gap-[56px] justify-start items-center w-full">
              {/* Contact Header */}
              <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] justify-start items-center w-full text-center lg:text-left">
                <div className="flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] lg:gap-[18px] justify-start items-center lg:items-start w-full">
                  <div className="flex flex-row justify-center lg:justify-start items-center w-full">
                    <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bahnschrift font-normal uppercase text-global-text1">
                      LAISSEZ NOUS UN MESSAGE
                    </span>
                    <div className="h-[1px] w-[80px] sm:w-[100px] md:w-[140px] lg:w-[180px] xl:w-[222px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] ml-[8px] sm:ml-[12px] md:ml-[16px] lg:ml-[20px] mb-[2px] self-end"></div>
                  </div>
                  <h2 className="text-[20px] sm:text-[26px] md:text-[32px] lg:text-[40px] xl:text-[50px] font-bahnschrift font-bold leading-[24px] sm:leading-[32px] md:leading-[38px] lg:leading-[48px] xl:leading-[61px] text-center lg:text-left uppercase bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] bg-clip-text text-transparent w-full">
                    NOUS CONTACTEZ
                  </h2>
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-light leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] text-center lg:text-justify lowercase text-global-text1 w-full lg:w-[60%] max-w-[600px] lg:max-w-none px-2 lg:px-0">
                    Notre équipe vous attend pour répondre à toutes vos questions et vous guider
                    vers la formule qui vous correspond.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center w-full gap-[24px] sm:gap-[32px] md:gap-[40px] lg:gap-[48px]">
                  {/* Phone */}
                  <div className="flex flex-row justify-center lg:justify-start items-center w-full lg:w-auto">
                    <div className="flex flex-row justify-center items-center bg-global-background2 rounded-[5px] p-[12px] sm:p-[14px] md:p-[16px] lg:p-[18px] ">
                      <img
                        src="/images/img_mingcute_phone_call_fill.png"
                        alt="Phone"
                        className="w-[28px] sm:w-[32px] md:w-[36px] lg:w-[40px] h-[28px] sm:h-[32px] md:h-[36px] lg:h-[40px]"
                      />
                    </div>
                    <div className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-kanit font-light leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[24px] text-center lg:text-left text-global-text1 ml-[12px] sm:ml-[16px] md:ml-[18px] lg:ml-[20px]">
                      +221 6666666
                      <br />
                      +221 6666666
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-row justify-center items-center w-full lg:w-auto gap-[12px] sm:gap-[16px] md:gap-[18px] lg:gap-[20px]">
                    <div className="flex flex-row justify-center items-center bg-global-background2 rounded-[5px] p-[12px] sm:p-[14px] md:p-[16px] lg:p-[18px] ">
                      <img
                        src="/images/img_ic_baseline_email.png"
                        alt="Email"
                        className="w-[28px] sm:w-[32px] md:w-[36px] lg:w-[40px] h-[28px] sm:h-[32px] md:h-[36px] lg:h-[40px]"
                      />
                    </div>
                    <span className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-kanit font-light leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[24px] text-center lg:text-left text-global-text1">
                      info@email.com
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex flex-row justify-center lg:justify-end items-center w-full lg:w-auto">
                    <div className="flex flex-row justify-center items-center bg-global-background2 rounded-[5px] p-[12px] sm:p-[14px] md:p-[16px] lg:p-[18px] ">
                      <img
                        src="/images/img_mdi_google_maps.png"
                        alt="Location"
                        className="w-[28px] sm:w-[32px] md:w-[36px] lg:w-[40px] h-[28px] sm:h-[32px] md:h-[36px] lg:h-[40px]"
                      />
                    </div>
                    <div className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-kanit font-light leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[24px] text-center lg:text-left text-global-text1 ml-[12px] sm:ml-[16px] md:ml-[18px] lg:ml-[20px]">
                      Sénégal
                      <br />
                      rue 12B Dakar
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="flex flex-col justify-start items-center w-full">
                <div className="flex flex-col justify-start items-start w-full ">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[32px] w-full">
                    {/* Name Field */}
                    <div className="flex flex-col gap-[8px] sm:gap-[10px] justify-start items-start w-full">
                      <label className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-normal text-global-text1">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        placeholder="Entrez votre nom"
                        className="text-[14px] sm:text-[15px] md:text-[16px] font-bahnschrift font-normal text-global-text4 bg-global-background8 rounded-[5px] shadow-md px-[16px] sm:px-[18px] md:px-[20px] py-[12px] sm:py-[14px] md:py-[16px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#5dcd62] transition-all duration-300"
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="flex flex-col gap-[8px] sm:gap-[10px] justify-start items-start w-full">
                      <label className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-normal text-global-text1">
                        Numéro de telephone
                      </label>
                      <input
                        type="tel"
                        placeholder="Entrez votre numéro de telephone"
                        className="text-[14px] sm:text-[15px] md:text-[16px] font-bahnschrift font-normal text-global-text4 bg-global-background8 rounded-[5px] shadow-md px-[16px] sm:px-[18px] md:px-[20px] py-[12px] sm:py-[14px] md:py-[16px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#5dcd62] transition-all duration-300"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-[8px] sm:gap-[10px] justify-start items-start w-full">
                      <label className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-normal text-global-text1">
                        Adresse mail
                      </label>
                      <input
                        type="email"
                        placeholder="Entrez votre Adresse mail"
                        className="text-[14px] sm:text-[15px] md:text-[16px] font-bahnschrift font-normal text-global-text4 bg-global-background8 rounded-[5px] shadow-md px-[16px] sm:px-[18px] md:px-[20px] py-[12px] sm:py-[14px] md:py-[16px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#5dcd62] transition-all duration-300"
                      />
                    </div>

                    {/* Subject Field */}
                    <div className="flex flex-col gap-[8px] sm:gap-[10px] justify-start items-start w-full">
                      <label className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-normal text-global-text1">
                        Sujet
                      </label>
                      <input
                        type="text"
                        placeholder="Entrez le sujet"
                        className="text-[14px] sm:text-[15px] md:text-[16px] font-bahnschrift font-normal text-global-text4 bg-global-background8 rounded-[5px] shadow-md px-[16px] sm:px-[18px] md:px-[20px] py-[12px] sm:py-[14px] md:py-[16px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#5dcd62] transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="flex flex-col gap-[8px] sm:gap-[10px] justify-start items-start w-full mt-[24px] sm:mt-[28px] md:mt-[32px]">
                    <label className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-bahnschrift font-normal text-global-text1">
                      Message
                    </label>
                    <div className="flex flex-row justify-start items-start w-full bg-global-background8 rounded-[5px] shadow-md p-[16px] sm:p-[18px] md:p-[20px]">
                      <textarea
                        placeholder="Entrez votre message"
                        rows={6}
                        className="text-[14px] sm:text-[15px] md:text-[16px] font-bahnschrift font-normal text-global-text4 w-full border-0 bg-transparent resize-none focus:outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-row justify-center w-full mt-[32px] sm:mt-[36px] md:mt-[40px]">
                    <Button
                      variant="primary"
                      className="text-[14px] sm:text-[16px] md:text-[18px] font-bahnschrift font-normal text-global-text5 bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[3px] px-[24px] sm:px-[32px] md:px-[40px] py-[12px] sm:py-[16px] md:py-[18px] hover:opacity-90 transition-opacity duration-300 shadow-lg w-full "
                    >
                      Envoyez votre Message
                    </Button>
                  </div>
                </div>
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
        className="fixed bottom-6 right-6 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] hover:bg-[linear-gradient(90deg,#21ac28_0%,_#5dcd62_100%)] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
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
