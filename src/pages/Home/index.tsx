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
      description: 'Accédez à des machines performantes et des espaces dédiés pour sculpter votre corps et améliorer votre endurance.'
    },
    {
      id: 2,
      icon: '/images/img_fa_users.png',
      image: '/images/img_rectangle_24_214x358.png',
      title: 'COURS COLLECTIFS',
      description: 'Yoga, HIIT, Pilates, Zumba… Des séances dynamiques pour brûler des calories en groupe et en musique !'
    },
    {
      id: 3,
      icon: '/images/img_game_icons_muscular_torso.png',
      image: '/images/img_rectangle_24.png',
      title: 'COACHING PERSONNEL',
      description: 'Un accompagnement sur mesure avec nos coachs certifiés pour atteindre vos objectifs rapidement et efficacement.'
    },
    {
      id: 4,
      icon: '/images/img_fa_users.png',
      image: '/images/img_rectangle_24_214x358.png',
      title: 'NUTRITION & BIEN-ÊTRE',
      description: 'Conseils nutritionnels personnalisés et programmes de relaxation pour un équilibre corps-esprit optimal.'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Omar D",
      avatar: "/images/img_ellipse_24.png",
      rating: 5,
      comment: "Entre les réunions et les voyages, ma santé passait au dernier plan. Grâce aux cours express du matin et au suivi nutritionnel, j'ai perdu mon ventre de bureau et gagné en productivité. Aujourd'hui, même en déplacement, j'applique leurs conseils. Une révolution !"
    },
    {
      id: 2,
      name: "Fatou K.", 
      avatar: "/images/img_ellipse_24_120x120.png",
      rating: 5,
      comment: "Je n'osais même pas entrer dans une salle de sport avant... Ici, pas de regard moqueur, que des encouragements ! Mon premier cours de danse africaine-fit a tout changé. 6 mois plus tard, je participe à des compétitions locales. La team m'a révélée à moi-même !"
    },
    {
      id: 3,
      name: "Sophie Laurent",
      avatar: "/images/reservation/woman.png",
      rating: 5,
      comment: "Après ma grossesse, j'avais perdu confiance en moi. L'équipe m'a accompagnée avec bienveillance dans ma remise en forme. Les cours de yoga prénatal puis les séances de renforcement m'ont redonné énergie et estime de soi."
    },
    {
      id: 4,
      name: "Ahmed Ben Ali",
      avatar: "/images/reservation/man1.png",
      rating: 4,
      comment: "À 45 ans, je pensais qu'il était trop tard pour me remettre en forme. Grâce au programme adapté à mon âge et mes capacités, j'ai retrouvé la forme de mes 30 ans. L'ambiance conviviale m'a motivé à persévérer."
    }
  ];

  // Carousel navigation functions
  const nextServiceSlide = () => {
    setCurrentServiceSlide((prev) => (prev + 1) % Math.ceil(services.length / 2));
  };

  const prevServiceSlide = () => {
    setCurrentServiceSlide((prev) => (prev - 1 + Math.ceil(services.length / 2)) % Math.ceil(services.length / 2));
  };

  const nextTestimonialSlide = () => {
    setCurrentTestimonialSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
  };

  const prevTestimonialSlide = () => {
    setCurrentTestimonialSlide((prev) => (prev - 1 + Math.ceil(testimonials.length / 2)) % Math.ceil(testimonials.length / 2));
  };
  return (
    <div className="w-full bg-global-background8">
      <div className="flex flex-col justify-start items-center w-full">
        {/* Hero Section */}
        <div className="relative w-full h-screen">
          {/* Header Section */}
          <div className="absolute top-0 left-0 right-0 z-20">
            <Header />
          </div>

          {/* Hero Background Image with Overlays */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/images/img_rectangle_4.png')" }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-global-background1"></div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(91deg,#21ac2899_0%,_#00000099_100%)]"></div>
            
            {/* Additional Dark Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#0000007f_0%,_#0000007f_100%)]"></div>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-0 right-[56px] sm:right-[112px] md:right-[168px] lg:right-[224px] w-[200px] sm:w-[280px] md:w-[340px] lg:w-[400px] h-[199px] sm:h-[279px] md:h-[339px] lg:h-[398px] z-10">
            <img 
              src="/images/img_ellipse_2.svg" 
              alt="Decorative circle" 
              className="w-full h-full object-contain"
            />
          </div>

          <div className="absolute top-[205px] sm:top-[287px] md:top-[369px] lg:top-[410px] left-0 w-[137px] sm:w-[192px] md:w-[233px] lg:w-[274px] h-[334px] sm:h-[468px] md:h-[568px] lg:h-[668px] z-10">
            <img 
              src="/images/img_ellipse_1_white_a700.png" 
              alt="Decorative element" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center z-15 px-4 sm:px-8 md:px-[56px]">
            <div className="flex flex-col gap-[26px] sm:gap-[36px] md:gap-[46px] lg:gap-[52px] justify-start items-center w-full max-w-[1200px]">
              {/* Hero Text */}
              <div className="flex flex-col gap-[17px] sm:gap-[24px] md:gap-[30px] lg:gap-[34px] justify-start items-start w-full max-w-[900px]">
                <h1 className="text-[28px] sm:text-[40px] md:text-[52px] lg:text-[68px] font-bahnschrift font-bold leading-[34px] sm:leading-[48px] md:leading-[62px] lg:leading-[82px] text-center text-global-text5 uppercase w-full">
                  MMT FITNESS AND MORE
                </h1>
                <p className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-bahnschrift font-normal leading-[18px] sm:leading-[21px] md:leading-[24px] lg:leading-[27px] text-center text-global-text5 w-full ml-[2px]">
                  Bienvenue dans votre centre de fitness ultime, conçu pour vous accompagner dans l'atteinte de vos objectifs sportifs. Que vous soyez débutant ou athlète confirmé, nos coachs experts vous aideront à repousser vos limites.
                </p>
              </div>

              {/* Hero Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] w-full max-w-[600px]">
                <button 
                  onClick={handleReservationClick}
                  className="flex justify-center items-center gap-[6px] bg-global-background10 border border-global-text5 rounded-[5px] px-[28px] py-[14px] w-full sm:w-auto hover:text-button-text1 transition-all"
                >
                  <span className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] text-global-text5">
                    Réservez
                  </span>
                  <img 
                    src="/images/img_basil_arrow_up_outline.svg" 
                    alt="Arrow" 
                    className="w-[20px] h-[20px] self-center"
                  />
                </button>
                
                <button className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[26px] text-global-text5 bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] border border-[#5dcd62] rounded-[5px] px-[28px] py-[14px] w-full sm:w-auto hover:opacity-90 transition-opacity">
                  Contact
                </button>
              </div>
            </div>
          </div>

          {/* Service Cards - Positioned absolutely */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-[1200px] px-4 sm:px-8 z-20">
            <div className="flex flex-col lg:flex-row gap-[20px] sm:gap-[24px] md:gap-[30px] lg:gap-[34px] w-full">
              {/* Excellence Card */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[378px] bg-global-background8 rounded-[5px] shadow-[0px_4px_4px_#0000003f] p-[24px] min-h-[200px]">
                <div className="flex flex-col justify-center items-center w-auto bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] p-[8px]">
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
                  Nous combinons les méthodes d'entraînement modernes avec l'énergie et la passion pour vous offrir une expérience unique.
                </p>
              </div>

              {/* Community Card */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[378px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] shadow-[0px_4px_4px_#0000003f] p-[24px] min-h-[200px]">
                <div className="flex flex-col justify-center items-center w-[50px] bg-global-background8 rounded-[5px] p-[8px]">
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
                  Plus qu'une salle de sport, nous sommes une famille ! Chez nous, l'entraide et la bonne humeur sont aussi importantes que la performance.
                </p>
              </div>

              {/* Accessibility Card */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[378px] bg-global-background8 rounded-[5px] shadow-[0px_4px_4px_#0000003f] p-[24px] min-h-[200px]">
                <div className="flex flex-col justify-center items-center w-auto bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] p-[8px]">
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
                  Nous croyons que le fitness doit être accessible à tous, quel que soit le niveau ou le budget. Nos tarifs adaptés et nos programmes variés permettent à chacun de progresser à son rythme.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="w-full bg-global-background4 mt-[120px] sm:mt-[140px] md:mt-[160px] lg:mt-[180px]">
          <div className="w-full max-w-[1378px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-center py-[40px] sm:py-[60px] md:py-[80px] lg:py-[100px] gap-[40px] lg:gap-0">
              {/* Left Image Section */}
              <div className="relative w-full lg:w-[42%] flex justify-center lg:justify-start">
                <div className="relative w-[270px] sm:w-[350px] md:w-[440px] lg:w-[580px] h-[320px] sm:h-[410px] md:h-[510px] lg:h-[670px]">
                  <img 
                    src="/images/img_02_1.png" 
                    alt="Fitness training" 
                    className="absolute top-[10px] sm:top-[15px] md:top-[18px] lg:top-[20px] left-[32px] sm:left-[40px] md:left-[50px] lg:left-[62px] w-[240px] sm:w-[310px] md:w-[390px] lg:w-[518px] h-[300px] sm:h-[380px] md:h-[470px] lg:h-[630px] object-cover"
                  />
                  <img 
                    src="/images/img_cercle.png" 
                    alt="Decorative circle" 
                    className="absolute top-0 left-0 w-[40px] sm:w-[54px] md:w-[67px] lg:w-[80px] h-[49px] sm:h-[66px] md:h-[82px] lg:h-[98px] object-contain"
                  />
                </div>
              </div>

              {/* Right Content Section */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[50%] self-end">
                <div className="flex flex-row justify-start items-center w-full mb-[8px] sm:mb-[10px] md:mb-[12px] lg:mb-[14px] px-[3px] sm:px-[4px] md:px-[5px] lg:px-[6px]">
                  <span className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-left uppercase text-global-text1">
                    A PROPOS DE NOUS
                  </span>
                  <div className="h-[1px] w-[111px] sm:w-[155px] md:w-[189px] lg:w-[222px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] ml-[3px] sm:ml-[4px] md:ml-[5px] lg:ml-[6px] mb-[4px] sm:mb-[6px] md:mb-[8px] lg:mb-[10px] self-end"></div>
                </div>

                <h2 className="text-[30px] sm:text-[36px] md:text-[43px] lg:text-[50px] font-bahnschrift font-bold leading-[37px] sm:leading-[44px] md:leading-[52px] lg:leading-[61px] text-left uppercase bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] bg-clip-text text-transparent mt-[7px] sm:mt-[9px] md:mt-[12px] lg:mt-[14px]">
                  TAGGATYARAM FITNESS
                </h2>

                <p className="text-[12px] sm:text-[13px] md:text-[13px] lg:text-[14px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-justify lowercase text-global-text1 w-[92%] mt-[6px] sm:mt-[7px] md:mt-[8px] lg:mt-[10px] ml-[2px] sm:ml-[3px] md:ml-[3px] lg:ml-[4px]">
                  Depuis notre création, nous nous engageons à offrir un environnement motivant et inclusif pour tous les passionnés de fitness, où chaque pas vers vos objectifs est célébré et chaque défi devient une occasion de grandir. Notre équipe de coachs certifiés est là pour vous guider avec expertise, vous challenger avec bienveillance et vous faire progresser durablement, quel que soit votre niveau, que vous soyez débutant cherchant les bases solides ou athlète confirmé visant des performances optimisées. Ensemble, nous bâtissons une communauté dynamique et solidaire, où l'énergie collective et l'esprit sénégalais de persévérance et de convivialité nourrissent votre motivation au quotidien.
                </p>

                <div className="flex flex-row justify-center items-start w-[94%] bg-[linear-gradient(90deg,#5dcd6219_0%,_#21ac2819_100%)] mt-[16px] sm:mt-[18px] md:mt-[20px] lg:mt-[22px] ml-[2px] sm:ml-[3px] md:ml-[3px] lg:ml-[4px]">
                  <div className="w-[3px] sm:w-[3px] md:w-[4px] lg:w-[4px] h-[75px] sm:h-[85px] md:h-[90px] lg:h-[100px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] self-center"></div>
                  <p className="text-[12px] sm:text-[13px] md:text-[13px] lg:text-[14px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-justify lowercase text-global-text1 w-[96%] mt-[6px] sm:mt-[7px] md:mt-[8px] lg:mt-[10px] ml-[6px] sm:ml-[7px] md:ml-[8px] lg:ml-[10px]">
                    Rejoignez-nous pour transformer votre entraînement en une expérience inspirante, adaptée à vos besoins, votre rythme et vos rêves, et découvrez comment chaque séance peut devenir une étape vers une meilleure version de vous-même.
                  </p>
                </div>

                <button className="flex justify-center items-center gap-[8px] text-[16px] font-bahnschrift font-normal leading-[20px] text-global-text5 bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] px-[28px] py-[14px] mt-[32px] ml-[4px] hover:opacity-90 transition-opacity">
                  Réservez maintenant
                  <img 
                    src="/images/img_solararrowuplinear.svg" 
                    alt="Arrow" 
                    className="w-[20px] h-[20px]"
                  />
                </button>

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
        <div className="w-full mt-[72px] sm:mt-[84px] md:mt-[90px] lg:mt-[96px]">
          <div className="w-full max-w-[1378px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-[15px] sm:gap-[17px] md:gap-[18px] lg:gap-[20px] justify-start items-center">
              {/* Services Header */}
              <div className="flex flex-col lg:flex-row justify-start items-center w-full px-[42px] sm:px-[58px] md:px-[71px] lg:px-[84px]">
                <div className="flex flex-col gap-[15px] sm:gap-[17px] md:gap-[18px] lg:gap-[20px] justify-start items-center w-full lg:w-[46%]">
                  <div className="flex flex-col gap-[8px] sm:gap-[9px] md:gap-[9px] lg:gap-[10px] justify-start items-center w-full">
                    <div className="flex flex-row justify-start items-center w-full px-[1px] sm:px-[1px] md:px-[1px] lg:px-[2px]">
                      <span className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-justify text-global-text1">
                        NOS SERVICES
                      </span>
                      <div className="h-[1px] w-[111px] sm:w-[155px] md:w-[189px] lg:w-[222px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] ml-[8px] sm:ml-[11px] md:ml-[14px] lg:lg-[16px] mb-[4px] sm:mb-[6px] md:mb-[7px] lg:mb-[8px] self-end"></div>
                    </div>
                    <h2 className="text-[30px] sm:text-[36px] md:text-[43px] lg:text-[50px] font-bahnschrift font-bold leading-[37px] sm:leading-[44px] md:leading-[52px] lg:leading-[61px] text-left uppercase bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] bg-clip-text text-transparent">
                      DÉCOUVREZ NOS SERVICES
                    </h2>
                  </div>
                  <p className="text-[12px] sm:text-[13px] md:text-[13px] lg:text-[14px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-justify lowercase text-global-text1 w-full px-[1px] sm:px-[1px] md:px-[1px] lg:px-[2px]">
                    Nous proposons une variété de services pour répondre à tous vos besoins fitness et bien-être, en adaptant chaque offre à votre style de vie et à vos objectifs personnels afin de vous aider à progresser durablement: coaching personnalisé, programmes d'entraînement sur mesure, séances collectives dynamiques,
                  </p>
                </div>

                {/* Navigation Arrows */}
                <div className="flex flex-row justify-end items-center w-full lg:w-auto mt-[20px] lg:mt-0 gap-[44px] sm:gap-[50px] md:gap-[54px] lg:gap-[58px]">
                  <button 
                    onClick={prevServiceSlide}
                    className="w-[47px] sm:w-[54px] md:w-[58px] lg:w-[62px] h-[47px] sm:h-[54px] md:h-[58px] lg:h-[62px] bg-global-background3 rounded-[24px] sm:rounded-[27px] md:rounded-[29px] lg:rounded-[30px] p-[6px] sm:p-[7px] md:p-[7px] lg:p-[8px] hover:bg-global-background2 transition-colors"
                  >
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={nextServiceSlide}
                    className="w-[47px] sm:w-[54px] md:w-[58px] lg:w-[62px] h-[47px] sm:h-[54px] md:h-[58px] lg:h-[62px] bg-global-background3 rounded-[24px] sm:rounded-[27px] md:rounded-[29px] lg:rounded-[30px] p-[6px] sm:p-[7px] md:p-[7px] lg:p-[8px] hover:bg-global-background2 transition-colors"
                  >
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Services Cards */}
              <div className="flex flex-col justify-start items-center w-full relative">
                <div className="flex flex-col lg:flex-row gap-[30px] sm:gap-[40px] md:gap-[45px] lg:gap-[50px] w-full max-w-[1378px] px-[34px] sm:px-[47px] md:px-[57px] lg:px-[67px] absolute top-[160px] sm:top-[200px] md:top-[240px] lg:top-[280px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                  {services.slice(currentServiceSlide * 2, currentServiceSlide * 2 + 2).map((service) => (
                    <div key={service.id} className="flex flex-col gap-[14px] sm:gap-[16px] md:gap-[17px] lg:gap-[18px] justify-start items-center w-full lg:w-[426px]">
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
                      <div className="flex flex-col justify-start items-start w-full bg-global-background6 rounded-[10px] shadow-[0px_4px_4px_#0000003f] p-[21px] sm:p-[24px] md:p-[26px] lg:p-[28px]">
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          className="w-full h-[161px] sm:h-[185px] md:h-[200px] lg:h-[214px] object-cover rounded-[5px]"
                        />
                        <h3 className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-bold leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-left uppercase text-global-text1 mt-[21px] sm:mt-[24px] md:mt-[26px] lg:mt-[28px] text-center w-full">
                          {service.title}
                        </h3>
                        <p className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-bahnschrift font-light leading-[17px] sm:leading-[19px] md:leading-[20px] lg:leading-[21px] text-center text-global-text1 w-full mt-[6px] sm:mt-[7px] md:mt-[7px] lg:mt-[8px] mb-[15px] sm:mb-[17px] md:mb-[18px] lg:mb-[20px]">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Coaching Privé Card */}
                  <div className="flex flex-col gap-[14px] sm:gap-[16px] md:gap-[17px] lg:gap-[18px] justify-start items-center w-full lg:w-[426px]">
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
                    <div className="flex flex-col justify-start items-center w-full bg-global-background6 rounded-[10px] shadow-[0px_4px_4px_#0000003f] p-[21px] sm:p-[24px] md:p-[26px] lg:p-[28px]">
                      <img 
                        src="/images/img_rectangle_24_1.png" 
                        alt="Private coaching session" 
                        className="w-full h-[161px] sm:h-[185px] md:h-[200px] lg:h-[214px] object-cover rounded-[5px]"
                      />
                      <h3 className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-bold leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-left uppercase text-global-text1 mt-[20px] sm:mt-[22px] md:mt-[24px] lg:mt-[26px]">
                        COACHING PRIVÉ
                      </h3>
                      <p className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-bahnschrift font-light leading-[17px] sm:leading-[19px] md:leading-[20px] lg:leading-[21px] text-center text-global-text1 w-full mt-[8px] sm:mt-[9px] md:mt-[9px] lg:lg-[10px] mb-[15px] sm:mb-[17px] md:mb-[18px] lg:mb-[20px]">
                        Un programme 100 % personnalisé avec un expert pour maximiser vos résultats.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Section with Background */}
                <div 
                  className="w-full h-[229px] sm:h-[320px] md:h-[389px] lg:h-[458px] bg-cover bg-center relative mt-[150px] sm:mt-[200px] md:mt-[250px] lg:mt-[300px]"
                  style={{ backgroundImage: "url('/images/img_rectangle_20.png')" }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(104deg,#5dcd62e5_0%,_#000000e5_100%)]"></div>
                  <div className="relative z-10 flex flex-col gap-[20px] sm:gap-[25px] md:gap-[28px] lg:gap-[30px] justify-start items-center w-full h-full px-[30px] sm:px-[35px] md:px-[38px] lg:px-[40px] pt-[170px] sm:pt-[210px] md:pt-[250px] lg:pt-[290px]">
                    <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-comic-sans font-normal leading-[26px] sm:leading-[28px] md:leading-[30px] lg:leading-[32px] text-left text-global-text5 text-center max-w-[900px]">
                      Vous ne rejoignez pas seulement un centre de Fitness, vous intégrez une seconde famille
                    </p>
                    <div className="flex justify-center items-center w-auto">
                      <button 
                        onClick={handleReservationClick}
                        className="flex gap-[6px] sm:gap-[7px] md:gap-[8px] lg:gap-[9px] justify-center items-center border border-[#5dcd62] rounded-[5px] bg-global-background9 px-[10px] sm:px-[12px] md:px-[14px] lg:px-[16px] py-[6px] sm:py-[7px] md:py-[8px] lg:py-[9px] hover:bg-[#5dcd62] hover:text-global-text1 transition-all"
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
        <div className="w-full mt-[72px] sm:mt-[84px] md:mt-[90px] lg:mt-[96px] px-[41px] sm:px-[57px] md:px-[69px] lg:px-[82px]">
          <div className="w-full max-w-[1376px] mx-auto">
            <div className="flex flex-col justify-start items-start w-full">
              <div className="flex flex-col lg:flex-row justify-between items-center w-full ml-[3px] sm:ml-[4px] md:ml-[5px] lg:ml-[6px]">
                <div className="flex flex-col gap-[8px] sm:gap-[9px] md:gap-[9px] lg:gap-[10px] justify-start items-start w-full lg:w-auto">
                  <div className="flex flex-row justify-start items-center w-full px-[3px] sm:px-[4px] md:px-[5px] lg:px-[6px]">
                    <span className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-justify uppercase text-global-text1">
                      TÉMOIGNAGE
                    </span>
                    <div className="h-[1px] w-[111px] sm:w-[155px] md:w-[189px] lg:w-[222px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] ml-[9px] sm:ml-[12px] md:ml-[15px] lg:ml-[18px] mb-[4px] sm:mb-[6px] md:mb-[7px] lg:mb-[8px] self-end"></div>
                  </div>
                  <h2 className="text-[30px] sm:text-[36px] md:text-[43px] lg:text-[50px] font-bahnschrift font-bold leading-[37px] sm:leading-[44px] md:leading-[52px] lg:leading-[61px] text-left uppercase bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] bg-clip-text text-transparent">
                    TÉMOIGNAGES CLIENTS
                  </h2>
                </div>

                {/* Navigation Arrows */}
                <div className="flex flex-row justify-end items-center gap-[44px] sm:gap-[50px] md:gap-[54px] lg:gap-[58px] mt-[20px] lg:mt-0 self-end">
                  <button 
                    onClick={prevTestimonialSlide}
                    className="w-[47px] sm:w-[54px] md:w-[58px] lg:w-[62px] h-[47px] sm:h-[54px] md:h-[58px] lg:h-[62px] bg-global-background3 rounded-[24px] sm:rounded-[27px] md:rounded-[29px] lg:rounded-[30px] p-[6px] sm:p-[7px] md:p-[7px] lg:p-[8px] hover:bg-global-background2 transition-colors"
                  >
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={nextTestimonialSlide}
                    className="w-[47px] sm:w-[54px] md:w-[58px] lg:w-[62px] h-[47px] sm:h-[54px] md:h-[58px] lg:h-[62px] bg-global-background3 rounded-[24px] sm:rounded-[27px] md:rounded-[29px] lg:rounded-[30px] p-[6px] sm:p-[7px] md:p-[7px] lg:p-[8px] hover:bg-global-background2 transition-colors"
                  >
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-[12px] sm:text-[13px] md:text-[13px] lg:text-[14px] font-bahnschrift font-normal leading-[13px] sm:leading-[14px] md:leading-[15px] lg:leading-[16px] text-left text-global-text1 w-[42%] mt-[10px] sm:mt-[12px] md:mt-[13px] lg:mt-[14px] ml-[7px] sm:ml-[10px] md:ml-[12px] lg:ml-[14px]">
                Nos membres parlent mieux que nous ! Découvrez leurs parcours inspirants et laissez-vous motiver par leurs transformations.
              </p>

              {/* Testimonial Cards */}
              <div className="flex flex-col lg:flex-row gap-[30px] sm:gap-[40px] md:gap-[45px] lg:gap-[50px] w-full mt-[40px] sm:mt-[50px] md:mt-[55px] lg:mt-[60px] px-[20px] sm:px-[30px] md:px-[40px] lg:px-[50px]">
                {testimonials.slice(currentTestimonialSlide * 2, currentTestimonialSlide * 2 + 2).map((testimonial) => (
                  <div key={testimonial.id} className="flex flex-col w-full lg:w-1/2 relative">
                    {/* Profile Section */}
                    <div className="flex flex-row items-start gap-4 mb-6">
                      {/* Profile Image with Green Border */}
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-full border-4 border-green-500 overflow-hidden">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Name and Role */}
                      <div className="flex flex-col">
                        <h3 className="text-xl font-bold text-black mb-1">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          Membres du Club Fitness
                        </p>
                        
                        {/* Star Rating */}
                        <div className="flex gap-1">
                          {[...Array(testimonial.rating)].map((_, index) => (
                            <svg key={index} className="w-4 h-4 text-green-500 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                      
                      {/* Quote Icon */}
                      <div className="ml-auto">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Testimonial Text */}
                    <p className="text-gray-700 text-base leading-relaxed mt-4">
                      {testimonial.comment}
                    </p>
                  </div>
                ))}


              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="w-full bg-global-background5 border-b border-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] mt-[90px] sm:mt-[105px] md:mt-[113px] lg:mt-[120px] py-[38px] sm:px-[43px] md:px-[47px] lg:px-[50px]">
          <div className="w-full max-w-[1378px] mx-auto">
            <div className="flex flex-col gap-[38px] sm:gap-[43px] md:gap-[47px] lg:gap-[50px] justify-start items-center w-full mt-[2px] sm:mt-[3px] md:mt-[3px] lg:mt-[4px]">
              {/* Contact Header */}
              <div className="flex flex-col gap-[15px] sm:gap-[17px] md:gap-[18px] lg:gap-[20px] justify-start items-center w-full">
                <div className="flex flex-col gap-[9px] sm:gap-[10px] md:gap-[11px] lg:gap-[12px] justify-start items-start w-full">
                  <div className="flex flex-row justify-start items-center w-full px-[3px] sm:px-[4px] md:px-[5px] lg:px-[6px]">
                    <span className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-left uppercase text-global-text1">
                      LAISSEZ NOUS UN MESSAGE
                    </span>
                    <div className="h-[1px] w-[111px] sm:w-[155px] md:w-[189px] lg:w-[222px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] ml-[4px] sm:ml-[6px] md:ml-[7px] lg:ml-[8px]"></div>
                  </div>
                  <h2 className="text-[30px] sm:text-[36px] md:text-[43px] lg:text-[50px] font-bahnschrift font-bold leading-[37px] sm:leading-[44px] md:leading-[52px] lg:leading-[61px] text-left uppercase bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] bg-clip-text text-transparent">
                    NOUS CONTACTEZ
                  </h2>
                  <p className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-bahnschrift font-normal leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-justify lowercase text-global-text1 w-[44%] ml-[3px] sm:ml-[4px] md:ml-[5px] lg:ml-[6px]">
                    Notre équipe vous attend pour répondre à toutes vos questions et vous guider vers la formule qui vous correspond.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col lg:flex-row justify-start items-center w-full gap-[20px] lg:gap-0">
                  {/* Phone */}
                  <div className="flex flex-row justify-start items-center w-full lg:w-[30%]">
                    <div className="flex flex-row justify-center items-center bg-global-background2 rounded-[5px] p-[12px] sm:p-[14px] md:p-[16px] lg:p-[18px]">
                      <img 
                        src="/images/img_mingcute_phone_call_fill.png" 
                        alt="Phone" 
                        className="w-[32px] sm:w-[36px] md:w-[40px] lg:w-[44px] h-[32px] sm:h-[36px] md:h-[40px] lg:h-[44px]"
                      />
                    </div>
                    <div className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-kanit font-light leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-left text-global-text1 w-[40%] ml-[12px] sm:ml-[14px] md:ml-[16px] lg:ml-[18px]">
                      +221 6666666<br />+221 6666666
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-row gap-[20px] sm:gap-[22px] md:gap-[24px] lg:gap-[26px] justify-center items-center w-full lg:w-auto px-[42px] sm:px-[48px] md:px-[52px] lg:px-[56px]">
                    <div className="flex flex-row justify-center items-center bg-global-background2 rounded-[5px] p-[12px] sm:p-[14px] md:p-[16px] lg:p-[18px]">
                      <img 
                        src="/images/img_ic_baseline_email.png" 
                        alt="Email" 
                        className="w-[32px] sm:w-[36px] md:w-[40px] lg:w-[44px] h-[32px] sm:h-[36px] md:h-[40px] lg:h-[44px]"
                      />
                    </div>
                    <span className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-kanit font-light leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-left text-global-text1">
                      info@email.com
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex flex-row justify-end items-center w-full lg:w-[30%]">
                    <div className="flex flex-row justify-center items-center bg-global-background2 rounded-[5px] p-[12px] sm:p-[14px] md:p-[16px] lg:p-[18px]">
                      <img 
                        src="/images/img_mdi_google_maps.png" 
                        alt="Location" 
                        className="w-[32px] sm:w-[36px] md:w-[40px] lg:w-[44px] h-[32px] sm:h-[36px] md:h-[40px] lg:h-[44px]"
                      />
                    </div>
                    <div className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-kanit font-light leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-left text-global-text1 w-[40%] self-end mb-[6px] sm:mb-[7px] md:mb-[8px] lg:mb-[9px] ml-[12px] sm:ml-[14px] md:ml-[16px] lg:ml-[18px]">
                      Sénégal<br />rue 12B Dakar
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="flex flex-row justify-start items-center w-full max-w-[1378px] px-[4px] sm:px-[6px] md:px-[7px] lg:px-[8px]">
                <div className="flex flex-col justify-start items-start w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-[26px] sm:gap-[29px] md:gap-[32px] lg:gap-[34px] w-full">
                    {/* Name Field */}
                    <div className="flex flex-col gap-[2px] sm:gap-[3px] md:gap-[3px] lg:gap-[4px] justify-start items-start w-full">
                      <label className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-bahnschrift font-normal leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-justify text-global-text1 ml-[1px] sm:ml-[2px] md:ml-[2px] lg:ml-[3px]">
                        Nom complet
                      </label>
                      <input 
                        type="text"
                        placeholder="Entrez votre nom"
                        className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-bahnschrift font-normal leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-justify text-global-text4 bg-global-background8 rounded-[5px] shadow-[0px_4px_4px_#0000003f] px-[12px] sm:px-[14px] md:px-[16px] lg:px-[18px] py-[10px] sm:py-[12px] md:py-[14px] lg:py-[16px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#5dcd62]"
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="flex flex-col gap-[3px] sm:gap-[4px] md:gap-[5px] lg:gap-[6px] justify-start items-start w-full">
                      <label className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-bahnschrift font-normal leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-justify text-global-text1 ml-[1px] sm:ml-[2px] md:ml-[2px] lg:ml-[3px]">
                        Numéro de telephone
                      </label>
                      <input 
                        type="tel"
                        placeholder="Entrez votre numéro de telephone"
                        className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-bahnschrift font-normal leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-justify text-global-text4 bg-global-background8 rounded-[5px] shadow-[0px_4px_4px_#0000003f] px-[12px] sm:px-[14px] md:px-[16px] lg:px-[18px] py-[10px] sm:py-[12px] md:py-[14px] lg:py-[16px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#5dcd62]"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-[3px] sm:gap-[4px] md:gap-[5px] lg:gap-[6px] justify-start items-start w-full">
                      <label className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-bahnschrift font-normal leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-justify text-global-text1 ml-[1px] sm:ml-[2px] md:ml-[2px] lg:ml-[3px]">
                        Adresse mail
                      </label>
                      <input 
                        type="email"
                        placeholder="Entrez votre Adresse mail"
                        className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-bahnschrift font-normal leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-justify text-global-text4 bg-global-background8 rounded-[5px] shadow-[0px_4px_4px_#0000003f] px-[12px] sm:px-[14px] md:px-[16px] lg:px-[18px] py-[10px] sm:py-[12px] md:py-[14px] lg:py-[16px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#5dcd62]"
                      />
                    </div>

                    {/* Subject Field */}
                    <div className="flex flex-col gap-[2px] sm:gap-[3px] md:gap-[3px] lg:gap-[4px] justify-start items-start w-full">
                      <label className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-bahnschrift font-normal leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-justify text-global-text1 ml-[1px] sm:ml-[2px] md:ml-[2px] lg:ml-[3px]">
                        Sujet
                      </label>
                      <input 
                        type="text"
                        placeholder="Entrez le sujet"
                        className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-bahnschrift font-normal leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-justify text-global-text4 bg-global-background8 rounded-[5px] shadow-[0px_4px_4px_#0000003f] px-[12px] sm:px-[14px] md:px-[16px] lg:px-[18px] py-[10px] sm:py-[12px] md:py-[14px] lg:py-[16px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#5dcd62]"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <label className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-bahnschrift font-normal leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-justify text-global-text1 mt-[20px] sm:mt-[22px] md:mt-[24px] lg:mt-[26px] ml-[3px] sm:ml-[4px] md:ml-[5px] lg:ml-[6px]">
                    Message
                  </label>
                  <div className="flex flex-row justify-start items-start w-full bg-global-background8 rounded-[5px] shadow-[0px_4px_4px_#0000003f] mt-[2px] sm:mt-[3px] md:mt-[3px] lg:mt-[4px] p-[12px] sm:p-[14px] md:p-[16px] lg:p-[18px]">
                    <textarea 
                      placeholder="Entrez votre message"
                      rows={6}
                      className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-bahnschrift font-normal leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-justify text-global-text4 w-full border-0 bg-transparent resize-none focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-row justify-center items-center w-full">
                <Button 
                  variant="primary"
                  className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-bahnschrift font-normal leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-left text-global-text5 bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] px-[16px] sm:px-[18px] md:px-[20px] lg:px-[22px] py-[12px] sm:py-[14px] md:py-[16px] lg:py-[18px] self-end hover:opacity-90 transition-opacity"
                >
                  Envoyez votre Message
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;