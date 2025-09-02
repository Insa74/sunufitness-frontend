import React from 'react';
import Header from '../../components/common/Header';
import Button from '../../components/ui/Button';

const HomePage: React.FC = () => {
  return (
    <div className="w-full bg-global-background8">
      <div className="flex flex-col justify-start items-center w-full">
        {/* Main Content Stack */}
        <div className="relative w-full h-[1022px] sm:h-[1400px] md:h-[1800px] lg:h-[2044px]">
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
          <div className="absolute inset-0 flex flex-col justify-start items-center z-15 pt-[80px] sm:pt-[120px] md:pt-[200px] lg:pt-[292px] px-4 sm:px-8 md:px-[56px]">
            <div className="flex flex-col gap-[26px] sm:gap-[36px] md:gap-[46px] lg:gap-[52px] justify-start items-center w-full max-w-[1200px]">
              {/* Hero Text */}
              <div className="flex flex-col gap-[17px] sm:gap-[24px] md:gap-[30px] lg:gap-[34px] justify-start items-start w-full max-w-[900px]">
                <h1 className="text-[32px] sm:text-[48px] md:text-[64px] lg:text-[85px] font-bahnschrift font-bold leading-[40px] sm:leading-[58px] md:leading-[78px] lg:leading-[103px] text-center text-global-text5 uppercase w-full">
                  MMT FITNESS AND MORE
                </h1>
                <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bahnschrift font-normal leading-[21px] sm:leading-[24px] md:leading-[27px] lg:leading-[30px] text-center text-global-text5 w-full ml-[2px]">
                  Bienvenue dans votre centre de fitness ultime, conçu pour vous accompagner dans l'atteinte de vos objectifs sportifs. Que vous soyez débutant ou athlète confirmé, nos coachs experts vous aideront à repousser vos limites.
                </p>
              </div>

              {/* Hero Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] w-full max-w-[600px]">
                <button className="flex justify-center items-center gap-[3px] sm:gap-[4px] md:gap-[5px] lg:gap-[6px] bg-global-background10 border border-global-text5 rounded-[5px] px-[10px] sm:px-[12px] md:px-[14px] py-[10px] sm:py-[12px] md:py-[14px] w-full sm:w-auto hover:bg-global-text5 hover:text-button-text1 transition-all">
                  <span className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[25px] font-bahnschrift font-normal leading-[23px] sm:leading-[25px] md:leading-[28px] lg:leading-[31px] text-global-text5 mt-[3px] sm:mt-[4px] md:mt-[5px] lg:mt-[6px]">
                    Réservez
                  </span>
                  <img 
                    src="/images/img_basil_arrow_up_outline.svg" 
                    alt="Arrow" 
                    className="w-[40px] sm:w-[45px] md:w-[50px] lg:w-[54px] h-[40px] sm:h-[45px] md:h-[50px] lg:h-[54px] self-center ml-[3px] sm:ml-[4px] md:ml-[5px] lg:ml-[6px]"
                  />
                </button>
                
                <Button 
                  variant="primary"
                  className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[25px] font-bahnschrift font-normal leading-[23px] sm:leading-[25px] md:leading-[28px] lg:leading-[31px] text-global-text5 bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] px-[24px] sm:px-[28px] md:px-[32px] lg:px-[34px] py-[18px] sm:py-[20px] md:py-[22px] lg:py-[24px] w-full sm:w-auto hover:opacity-90 transition-opacity"
                >
                  Contact
                </Button>
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="absolute bottom-[100px] sm:bottom-[140px] md:bottom-[180px] lg:bottom-[223px] left-1/2 transform -translate-x-1/2 w-full max-w-[1200px] px-4 sm:px-8 z-20">
            <div className="flex flex-col lg:flex-row gap-[20px] sm:gap-[24px] md:gap-[30px] lg:gap-[34px] w-full">
              {/* Excellence Card */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[378px] bg-global-background8 rounded-[5px] shadow-[0px_4px_4px_#0000003f] p-[20px] sm:p-[24px] md:p-[28px] lg:p-[32px]">
                <div className="flex flex-col justify-center items-center w-auto bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] p-[4px] sm:p-[5px] md:p-[6px] ml-[2px] sm:ml-[3px] md:ml-[4px]">
                  <img 
                    src="/images/img_game_icons_sport_medal.svg" 
                    alt="Sport medal" 
                    className="w-[48px] sm:w-[56px] md:w-[60px] lg:w-[64px] h-[48px] sm:h-[56px] md:h-[60px] lg:h-[64px]"
                  />
                </div>
                <h3 className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-semibold leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-justify text-global-text1 mt-[24px] sm:mt-[28px] md:mt-[32px] lg:mt-[36px]">
                  Excellence & Tradition Sportive
                </h3>
                <p className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-bahnschrift font-light leading-[17px] sm:leading-[19px] md:leading-[20px] lg:leading-[21px] text-justify text-global-text1 mt-[4px] sm:mt-[5px] md:mt-[6px] mb-[30px] sm:mb-[35px] md:mb-[38px] lg:mb-[40px] w-full">
                  Nous combinons les méthodes d'entraînement modernes avec l'énergie et la passion pour vous offrir une expérience unique,
                </p>
              </div>

              {/* Community Card */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[378px] bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] shadow-[0px_4px_4px_#0000003f] p-[20px] sm:p-[24px] md:p-[28px] lg:p-[32px]">
                <div className="flex flex-col justify-center items-center w-[57px] sm:w-[66px] md:w-[71px] lg:w-[76px] bg-global-background8 rounded-[5px] p-[10px] sm:p-[12px] md:p-[13px] lg:p-[14px] ml-[3px] sm:ml-[4px] md:ml-[5px] lg:ml-[6px]">
                  <img 
                    src="/images/img_fa_solid_users.png" 
                    alt="Users" 
                    className="w-full h-[33px] sm:h-[38px] md:h-[41px] lg:h-[44px]"
                  />
                </div>
                <h3 className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-semibold leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-justify text-global-text5 mt-[22px] sm:mt-[26px] md:mt-[30px] lg:mt-[34px]">
                  Communauté & Solidarité
                </h3>
                <p className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-bahnschrift font-light leading-[17px] sm:leading-[19px] md:leading-[20px] lg:leading-[21px] text-justify text-global-text5 mt-[6px] sm:mt-[7px] md:mt-[8px] lg:mt-[10px] mb-[24px] sm:mb-[28px] md:mb-[30px] lg:mb-[32px] w-[98%]">
                  Plus qu'une salle de sport, nous sommes une famille ! Chez nous, l'entraide et la bonne humeur sont aussi importantes que la performance. Venez vous entraîner dans une ambiance chaleureuse
                </p>
              </div>

              {/* Accessibility Card */}
              <div className="flex flex-col justify-start items-start w-full lg:w-[378px] bg-global-background8 rounded-[5px] shadow-[0px_4px_4px_#0000003f] p-[20px] sm:p-[24px] md:p-[28px] lg:p-[32px]">
                <div className="flex flex-col justify-center items-center w-auto bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] p-[4px] sm:p-[5px] md:p-[6px] ml-[2px] sm:ml-[3px] md:ml-[4px]">
                  <img 
                    src="/images/img_material_symbol.svg" 
                    alt="Material symbol" 
                    className="w-[48px] sm:w-[56px] md:w-[60px] lg:w-[64px] h-[48px] sm:h-[56px] md:h-[60px] lg:h-[64px]"
                  />
                </div>
                <h3 className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-semibold leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-justify text-global-text1 mt-[24px] sm:mt-[28px] md:mt-[32px] lg:mt-[36px]">
                  Accessibilité & Bien-être pour Tous
                </h3>
                <p className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-bahnschrift font-light leading-[17px] sm:leading-[19px] md:leading-[20px] lg:leading-[21px] text-justify text-global-text1 mt-[4px] sm:mt-[6px] md:mt-[7px] lg:mt-[8px] mb-[24px] sm:mb-[28px] md:mb-[30px] lg:mb-[32px] w-full">
                  Nous croyons que le fitness doit être accessible à tous, quel que soit le niveau ou le budget. Nos tarifs adaptés et nos programmes variés permettent à chacun de progresser à son rythme, dans un cadre professionnel.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="w-full bg-global-background4 mt-[53px] sm:mt-[74px] md:mt-[95px] lg:mt-[106px]">
          <div className="w-full max-w-[1378px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-center py-[40px] sm:py-[60px] md:py-[80px] lg:py-[100px] gap-[40px] lg:gap-0">
              {/* Left Image Section */}
              <div className="relative w-full lg:w-[44%] flex justify-center lg:justify-start">
                <div className="relative w-[300px] sm:w-[400px] md:w-[500px] lg:w-[666px] h-[350px] sm:h-[450px] md:h-[550px] lg:h-[736px]">
                  <img 
                    src="/images/img_02_1.png" 
                    alt="Fitness training" 
                    className="absolute top-[10px] sm:top-[15px] md:top-[18px] lg:top-[20px] left-[35px] sm:left-[45px] md:left-[55px] lg:left-[69px] w-[270px] sm:w-[350px] md:w-[430px] lg:w-[598px] h-[320px] sm:h-[420px] md:h-[520px] lg:h-[716px] object-cover"
                  />
                  <img 
                    src="/images/img_cercle.png" 
                    alt="Decorative circle" 
                    className="absolute top-0 left-0 w-[44px] sm:w-[60px] md:w-[74px] lg:w-[88px] h-[54px] sm:h-[74px] md:h-[91px] lg:h-[108px] object-contain"
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

                <Button 
                  variant="primary"
                  className="flex gap-[2px] sm:gap-[3px] md:gap-[3px] lg:gap-[4px] text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-bahnschrift font-normal leading-[18px] sm:leading-[20px] md:leading-[21px] lg:leading-[22px] text-global-text5 bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] border border-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] px-[24px] sm:px-[40px] md:px-[52px] lg:px-[64px] py-[12px] sm:py-[14px] md:py-[15px] lg:py-[16px] mt-[44px] sm:mt-[50px] md:mt-[54px] lg:mt-[58px] ml-[4px] sm:ml-[5px] md:ml-[6px] lg:ml-[8px] hover:opacity-90 transition-opacity"
                >
                  Réservez maintenant
                  <img 
                    src="/images/img_solararrowuplinear.svg" 
                    alt="Arrow" 
                    className="w-[24px] sm:w-[28px] md:w-[30px] lg:w-[32px] h-[24px] sm:h-[28px] md:h-[30px] lg:h-[32px]"
                  />
                </Button>

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
                  <button className="w-[47px] sm:w-[54px] md:w-[58px] lg:w-[62px] h-[47px] sm:h-[54px] md:h-[58px] lg:h-[62px] bg-global-background3 rounded-[24px] sm:rounded-[27px] md:rounded-[29px] lg:rounded-[30px] p-[6px] sm:p-[7px] md:p-[7px] lg:p-[8px] hover:bg-global-background2 transition-colors">
                    <img 
                      src="/images/img_tdesign_arrow_up.png" 
                      alt="Previous" 
                      className="w-full h-full object-contain"
                    />
                  </button>
                  <button className="w-[47px] sm:w-[54px] md:w-[58px] lg:w-[62px] h-[47px] sm:h-[54px] md:h-[58px] lg:h-[62px] bg-global-background3 rounded-[24px] sm:rounded-[27px] md:rounded-[29px] lg:rounded-[30px] p-[6px] sm:p-[7px] md:p-[7px] lg:p-[8px] hover:bg-global-background2 transition-colors">
                    <img 
                      src="/images/img_tdesign_arrow_up.png" 
                      alt="Next" 
                      className="w-full h-full object-contain"
                    />
                  </button>
                </div>
              </div>

              {/* Services Cards */}
              <div className="flex flex-col justify-start items-center w-full">
                <div className="flex flex-col lg:flex-row gap-[30px] sm:gap-[40px] md:gap-[45px] lg:gap-[50px] w-full max-w-[1378px] px-[34px] sm:px-[47px] md:px-[57px] lg:px-[67px]">
                  {/* Musculation Card */}
                  <div className="flex flex-col gap-[14px] sm:gap-[16px] md:gap-[17px] lg:gap-[18px] justify-start items-center w-full lg:w-[426px]">
                    <div className="flex flex-row gap-[3px] sm:gap-[4px] md:gap-[5px] lg:gap-[6px] justify-center items-center w-full">
                      <button className="w-[50px] sm:w-[58px] md:w-[62px] lg:w-[66px] h-[50px] sm:h-[58px] md:h-[62px] lg:h-[66px] bg-global-background2 rounded-[25px] sm:rounded-[29px] md:rounded-[31px] lg:rounded-[32px] p-[8px] sm:p-[9px] md:p-[9px] lg:p-[10px]">
                        <img 
                          src="/images/img_game_icons_muscular_torso.png" 
                          alt="Musculation" 
                          className="w-full h-full object-contain"
                        />
                      </button>
                      <div className="h-[1px] w-full bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)]"></div>
                    </div>
                    <div className="flex flex-col justify-start items-start w-full bg-global-background6 rounded-[10px] shadow-[0px_4px_4px_#0000003f] p-[21px] sm:p-[24px] md:p-[26px] lg:p-[28px]">
                      <img 
                        src="/images/img_rectangle_24.png" 
                        alt="Musculation equipment" 
                        className="w-full h-[161px] sm:h-[185px] md:h-[200px] lg:h-[214px] object-cover rounded-[5px]"
                      />
                      <h3 className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-bold leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-left uppercase text-global-text1 mt-[21px] sm:mt-[24px] md:mt-[26px] lg:mt-[28px] ml-[42px] sm:ml-[48px] md:ml-[52px] lg:ml-[56px]">
                        MUSCULATION & CARDIO
                      </h3>
                      <p className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-bahnschrift font-light leading-[17px] sm:leading-[19px] md:leading-[20px] lg:leading-[21px] text-center text-global-text1 w-full mt-[6px] sm:mt-[7px] md:mt-[7px] lg:mt-[8px] mb-[15px] sm:mb-[17px] md:mb-[18px] lg:mb-[20px] ml-[2px] sm:ml-[3px] md:ml-[3px] lg:ml-[4px]">
                        Accédez à des machines performantes et des espaces dédiés pour sculpter votre corps et améliorer votre endurance.
                      </p>
                    </div>
                  </div>

                  {/* Cours Collectifs Card */}
                  <div className="flex flex-col gap-[14px] sm:gap-[16px] md:gap-[17px] lg:gap-[18px] justify-start items-center w-full lg:w-[426px]">
                    <div className="flex flex-row gap-[3px] sm:gap-[4px] md:gap-[5px] lg:gap-[6px] justify-center items-center w-full">
                      <button className="w-[50px] sm:w-[58px] md:w-[62px] lg:w-[66px] h-[50px] sm:h-[58px] md:h-[62px] lg:h-[66px] bg-global-background2 rounded-[25px] sm:rounded-[29px] md:rounded-[31px] lg:rounded-[32px] p-[2px] sm:p-[3px] md:p-[3px] lg:p-[4px]">
                        <img 
                          src="/images/img_fa_users.png" 
                          alt="Group classes" 
                          className="w-full h-full object-contain"
                        />
                      </button>
                      <div className="h-[1px] w-full bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)]"></div>
                    </div>
                    <div className="flex flex-col justify-start items-start w-full bg-global-background6 rounded-[10px] shadow-[0px_4px_4px_#0000003f] p-[21px] sm:p-[24px] md:p-[26px] lg:p-[28px]">
                      <img 
                        src="/images/img_rectangle_24_214x358.png" 
                        alt="Group fitness class" 
                        className="w-full h-[161px] sm:h-[185px] md:h-[200px] lg:h-[214px] object-cover rounded-[5px]"
                      />
                      <h3 className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-bold leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-left uppercase text-global-text1 mt-[21px] sm:mt-[24px] md:mt-[26px] lg:mt-[28px] ml-[59px] sm:ml-[67px] md:ml-[73px] lg:ml-[78px]">
                        COURS COLLECTIFS
                      </h3>
                      <p className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-bahnschrift font-light leading-[17px] sm:leading-[19px] md:leading-[20px] lg:leading-[21px] text-center text-global-text1 w-full mt-[6px] sm:mt-[7px] md:mt-[7px] lg:mt-[8px] mb-[15px] sm:mb-[17px] md:mb-[18px] lg:mb-[20px] ml-[2px] sm:ml-[3px] md:ml-[3px] lg:ml-[4px]">
                        Yoga, HIIT, Pilates, Zumba… Des séances dynamiques pour brûler des calories en groupe et en musique !
                      </p>
                    </div>
                  </div>

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
                  className="w-full h-[229px] sm:h-[320px] md:h-[389px] lg:h-[458px] bg-cover bg-center mt-[-111px] sm:mt-[-155px] md:mt-[-189px] lg:lg-[-222px] relative"
                  style={{ backgroundImage: "url('/images/img_rectangle_20.png')" }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(104deg,#5dcd62e5_0%,_#000000e5_100%)]"></div>
                  <div className="relative z-10 flex flex-col gap-[30px] sm:gap-[35px] md:gap-[38px] lg:gap-[40px] justify-start items-center w-full h-full px-[30px] sm:px-[35px] md:px-[38px] lg:px-[40px] pt-[165px] sm:pt-[231px] md:pt-[281px] lg:pt-[330px]">
                    <p className="text-[22px] sm:text-[26px] md:text-[28px] lg:text-[30px] font-comic-sans font-normal leading-[31px] sm:leading-[36px] md:leading-[39px] lg:leading-[42px] text-left text-global-text5 text-center max-w-[900px]">
                      Vous ne rejoignez pas seulement un centre de Fitness, vous intégrez une seconde famille
                    </p>
                    <div className="flex justify-center items-center w-auto">
                      <button className="flex gap-[9px] sm:gap-[10px] md:gap-[11px] lg:gap-[12px] justify-center items-center border border-[#5dcd62] rounded-[5px] bg-global-background9 px-[12px] sm:px-[14px] md:px-[15px] lg:px-[16px] py-[12px] sm:py-[14px] md:py-[15px] lg:px-[16px] hover:bg-[#5dcd62] hover:text-global-text1 transition-all">
                        <span className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-global-text5">
                          Réservez maintenant
                        </span>
                        <img 
                          src="/images/img_solararrowuplinear.svg" 
                          alt="Arrow" 
                          className="w-[32px] sm:w-[36px] md:w-[39px] lg:w-[42px] h-[32px] sm:h-[36px] md:h-[39px] lg:h-[42px]"
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
                  <button className="w-[47px] sm:w-[54px] md:w-[58px] lg:w-[62px] h-[47px] sm:h-[54px] md:h-[58px] lg:h-[62px] bg-global-background3 rounded-[24px] sm:rounded-[27px] md:rounded-[29px] lg:rounded-[30px] p-[6px] sm:p-[7px] md:p-[7px] lg:p-[8px] hover:bg-global-background2 transition-colors">
                    <img 
                      src="/images/img_tdesign_arrow_up.png" 
                      alt="Previous" 
                      className="w-full h-full object-contain"
                    />
                  </button>
                  <button className="w-[47px] sm:w-[54px] md:w-[58px] lg:w-[62px] h-[47px] sm:h-[54px] md:h-[58px] lg:h-[62px] bg-global-background3 rounded-[24px] sm:rounded-[27px] md:rounded-[29px] lg:rounded-[30px] p-[6px] sm:p-[7px] md:p-[7px] lg:p-[8px] hover:bg-global-background2 transition-colors">
                    <img 
                      src="/images/img_tdesign_arrow_up.png" 
                      alt="Next" 
                      className="w-full h-full object-contain"
                    />
                  </button>
                </div>
              </div>

              <p className="text-[12px] sm:text-[13px] md:text-[13px] lg:text-[14px] font-bahnschrift font-normal leading-[13px] sm:leading-[14px] md:leading-[15px] lg:leading-[16px] text-left text-global-text1 w-[42%] mt-[10px] sm:mt-[12px] md:mt-[13px] lg:mt-[14px] ml-[7px] sm:ml-[10px] md:ml-[12px] lg:ml-[14px]">
                Nos membres parlent mieux que nous ! Découvrez leurs parcours inspirants et laissez-vous motiver par leurs transformations.
              </p>

              {/* Testimonial Cards */}
              <div className="flex flex-col lg:flex-row gap-[22px] sm:gap-[26px] md:gap-[28px] lg:gap-[30px] w-full mt-[18px] sm:mt-[20px] md:lg-[22px] lg:mt-[24px] px-[3px] sm:px-[4px] md:px-[5px] lg:px-[6px]">
                {/* Omar D Testimonial */}
                <div className="flex flex-col gap-[24px] sm:gap-[28px] md:gap-[30px] lg:gap-[32px] justify-start items-center w-full lg:w-[670px] bg-global-background6 rounded-[5px] shadow-[0px_4px_4px_#0000003f] p-[3px] sm:p-[4px] md:p-[5px] lg:p-[6px]">
                  <div className="flex flex-row justify-start items-center w-full px-[15px] sm:px-[17px] md:px-[18px] lg:px-[20px]">
                    <div className="flex flex-row justify-start items-start w-full self-end">
                      <img 
                        src="/images/img_ellipse_24.png" 
                        alt="Omar D" 
                        className="w-[90px] sm:w-[105px] md:w-[113px] lg:w-[120px] h-[90px] sm:h-[105px] md:h-[113px] lg:h-[120px] rounded-[45px] sm:rounded-[53px] md:rounded-[57px] lg:rounded-[60px] self-center object-cover"
                      />
                      <div className="flex flex-col gap-[3px] sm:gap-[4px] md:gap-[5px] lg:gap-[6px] justify-start items-center w-full px-[9px] sm:px-[13px] md:px-[16px] lg:px-[18px]">
                        <div className="flex flex-col justify-start items-start w-full px-[3px] sm:px-[4px] md:px-[5px] lg:px-[6px]">
                          <h3 className="text-[22px] sm:text-[26px] md:text-[28px] lg:text-[30px] font-bahnschrift font-semibold leading-[28px] sm:leading-[32px] md:leading-[35px] lg:leading-[37px] text-left text-global-text1 ml-[1px] sm:ml-[1px] md:ml-[1px] lg:ml-[2px]">
                            Omar D
                          </h3>
                          <p className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-left text-global-text4 mt-[-1px] sm:mt-[-1px] md:mt-[-1px] lg:mt-[-2px]">
                            Membres du Club Fitness
                          </p>
                        </div>
                        <div className="flex flex-row justify-start items-center w-full">
                          {[...Array(5)].map((_, index) => (
                            <img 
                              key={index}
                              src="/images/img_material_symbols_star.png" 
                              alt="Star" 
                              className="w-[21px] sm:w-[24px] md:w-[26px] lg:w-[28px] h-[21px] sm:h-[24px] md:h-[26px] lg:h-[28px] ml-[3px] sm:ml-[4px] md:ml-[5px] lg:ml-[6px] first:ml-0"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="relative w-[57px] sm:w-[66px] md:w-[71px] lg:w-[76px] h-[104px] sm:h-[120px] md:h-[129px] lg:h-[138px]">
                      <div className="absolute top-[21px] sm:top-[24px] md:top-[26px] lg:top-[28px] left-0 w-[57px] sm:w-[66px] md:w-[71px] lg:w-[76px] h-[57px] sm:h-[66px] md:h-[71px] lg:h-[76px] bg-global-background3 rounded-[29px] sm:rounded-[33px] md:rounded-[36px] lg:rounded-[38px]"></div>
                      <div className="absolute top-0 left-[10px] sm:left-[11px] md:left-[12px] lg:left-[13px] flex justify-center items-center">
                        <span className="text-[75px] sm:text-[87px] md:text-[94px] lg:text-[100px] font-pontano-sans font-light leading-[97px] sm:leading-[112px] md:leading-[121px] lg:leading-[129px] text-left bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] bg-clip-text text-transparent">
                          ,
                        </span>
                        <span className="text-[75px] sm:text-[87px] md:text-[94px] lg:text-[100px] font-pontano-sans font-light leading-[97px] sm:leading-[112px] md:leading-[121px] lg:leading-[129px] text-left bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] bg-clip-text text-transparent">
                          ,
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[15px] sm:text-[17px] md:text-[19px] lg:text-[20px] font-bahnschrift font-normal leading-[18px] sm:leading-[21px] md:leading-[22px] lg:leading-[24px] text-justify text-global-text1 w-[94%] mb-[24px] sm:mb-[28px] md:mb-[30px] lg:mb-[32px] ml-[9px] sm:ml-[10px] md:ml-[11px] lg:ml-[12px]">
                    Entre les réunions et les voyages, ma santé passait au dernier plan. Grâce aux cours express du matin et au suivi nutritionnel, j'ai perdu mon ventre de bureau et gagné en productivité. Aujourd'hui, même en déplacement, j'applique leurs conseils. Une révolution !
                  </p>
                </div>

                {/* Fatou K Testimonial */}
                <div className="flex flex-col gap-[24px] sm:gap-[28px] md:gap-[30px] lg:gap-[32px] justify-start items-center w-full lg:w-[670px] bg-global-background6 rounded-[5px] shadow-[0px_4px_4px_#0000003f] p-[3px] sm:p-[4px] md:p-[5px] lg:p-[6px]">
                  <div className="flex flex-row justify-start items-center w-full px-[15px] sm:px-[17px] md:px-[18px] lg:px-[20px]">
                    <div className="flex flex-row justify-start items-start w-full self-end">
                      <img 
                        src="/images/img_ellipse_24_120x120.png" 
                        alt="Fatou K" 
                        className="w-[90px] sm:w-[105px] md:w-[113px] lg:w-[120px] h-[90px] sm:h-[105px] md:h-[113px] lg:h-[120px] rounded-[45px] sm:rounded-[53px] md:rounded-[57px] lg:rounded-[60px] self-center object-cover"
                      />
                      <div className="flex flex-col gap-[3px] sm:gap-[4px] md:gap-[5px] lg:gap-[6px] justify-start items-center w-full px-[9px] sm:px-[13px] md:px-[16px] lg:px-[18px]">
                        <div className="flex flex-col justify-start items-start w-full px-[3px] sm:px-[4px] md:px-[5px] lg:px-[6px]">
                          <h3 className="text-[22px] sm:text-[26px] md:text-[28px] lg:text-[30px] font-bahnschrift font-semibold leading-[28px] sm:leading-[32px] md:leading-[35px] lg:leading-[37px] text-left text-global-text1 ml-[1px] sm:ml-[1px] md:ml-[1px] lg:ml-[2px]">
                            Fatou K.
                          </h3>
                          <p className="text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-left text-global-text4 mt-[-1px] sm:mt-[-1px] md:mt-[-1px] lg:mt-[-2px]">
                            Membres du Club Fitness
                          </p>
                        </div>
                        <div className="flex flex-row justify-start items-center w-full">
                          {[...Array(5)].map((_, index) => (
                            <img 
                              key={index}
                              src="/images/img_material_symbols_star.png" 
                              alt="Star" 
                              className="w-[21px] sm:w-[24px] md:w-[26px] lg:w-[28px] h-[21px] sm:h-[24px] md:h-[26px] lg:h-[28px] ml-[3px] sm:ml-[4px] md:ml-[5px] lg:ml-[6px] first:ml-0"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="relative w-[57px] sm:w-[66px] md:w-[71px] lg:w-[76px] h-[104px] sm:h-[120px] md:h-[129px] lg:h-[138px]">
                      <div className="absolute top-[21px] sm:top-[24px] md:top-[26px] lg:top-[28px] left-0 w-[57px] sm:w-[66px] md:w-[71px] lg:w-[76px] h-[57px] sm:h-[66px] md:h-[71px] lg:h-[76px] bg-global-background3 rounded-[29px] sm:rounded-[33px] md:rounded-[36px] lg:rounded-[38px]"></div>
                      <div className="absolute top-0 left-[10px] sm:left-[11px] md:left-[12px] lg:left-[13px] flex justify-center items-center">
                        <span className="text-[75px] sm:text-[87px] md:text-[94px] lg:text-[100px] font-pontano-sans font-light leading-[97px] sm:leading-[112px] md:leading-[121px] lg:leading-[129px] text-left bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] bg-clip-text text-transparent">
                          ,
                        </span>
                        <span className="text-[75px] sm:text-[87px] md:text-[94px] lg:text-[100px] font-pontano-sans font-light leading-[97px] sm:leading-[112px] md:leading-[121px] lg:leading-[129px] text-left bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] bg-clip-text text-transparent">
                          ,
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[15px] sm:text-[17px] md:text-[19px] lg:text-[20px] font-bahnschrift font-normal leading-[18px] sm:leading-[21px] md:leading-[22px] lg:leading-[24px] text-justify text-global-text1 w-[94%] mb-[24px] sm:mb-[28px] md:mb-[30px] lg:mb-[32px] ml-[9px] sm:ml-[10px] md:ml-[11px] lg:ml-[12px]">
                    Je n'osais même pas entrer dans une salle de sport avant... Ici, pas de regard moqueur, que des encouragements ! Mon premier cours de danse africaine-fit a tout changé. 6 mois plus tard, je participe à des compétitions locales. La team m'a révélée à moi-même !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="w-full bg-global-background5 border-b border-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] mt-[90px] sm:mt-[105px] md:mt-[113px] lg:mt-[120px] py-[38px] sm:px-[43px] md:px-[47px] lg:px-[50px]">
          <div className="w-full max-w-[1378px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-[38px] sm:gap-[43px] md:gap-[47px] lg:gap-[50px] justify-start items-center w-[98%] mt-[2px] sm:mt-[3px] md:mt-[3px] lg:mt-[4px]">
              {/* Contact Header */}
              <div className="flex flex-col gap-[15px] sm:gap-[17px] md:gap-[18px] lg:gap-[20px] justify-start items-center w-[96%]">
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
                  <p className="text-[12px] sm:text-[13px] md:text-[13px] lg:text-[14px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-justify lowercase text-global-text1 w-[44%] ml-[3px] sm:ml-[4px] md:ml-[5px] lg:ml-[6px]">
                    Notre équipe vous attend pour répondre à toutes vos questions et vous guider vers la formule qui vous correspond.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col lg:flex-row justify-start items-center w-full gap-[20px] lg:gap-0">
                  {/* Phone */}
                  <div className="flex flex-row justify-start items-center w-full lg:w-[30%]">
                    <div className="flex flex-row justify-center items-center bg-global-background2 rounded-[5px] p-[18px] sm:p-[20px] md:p-[22px] lg:p-[24px]">
                      <img 
                        src="/images/img_mingcute_phone_call_fill.png" 
                        alt="Phone" 
                        className="w-[53px] sm:w-[60px] md:w-[65px] lg:w-[70px] h-[53px] sm:h-[60px] md:h-[65px] lg:h-[70px]"
                      />
                    </div>
                    <div className="text-[19px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-kanit font-light leading-[28px] sm:leading-[32px] md:leading-[35px] lg:leading-[37px] text-left text-global-text1 w-[40%] ml-[20px] sm:ml-[22px] md:ml-[24px] lg:ml-[26px]">
                      +221 6666666<br />+221 6666666
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-row gap-[20px] sm:gap-[22px] md:gap-[24px] lg:gap-[26px] justify-center items-center w-full lg:w-auto px-[42px] sm:px-[48px] md:px-[52px] lg:px-[56px]">
                    <div className="flex flex-row justify-center items-center bg-global-background2 rounded-[5px] p-[18px] sm:p-[20px] md:p-[22px] lg:p-[24px]">
                      <img 
                        src="/images/img_ic_baseline_email.png" 
                        alt="Email" 
                        className="w-[53px] sm:w-[60px] md:w-[65px] lg:w-[70px] h-[53px] sm:h-[60px] md:h-[65px] lg:h-[70px]"
                      />
                    </div>
                    <span className="text-[19px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-kanit font-light leading-[29px] sm:leading-[33px] md:leading-[36px] lg:leading-[38px] text-left text-global-text1">
                      info@email.com
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex flex-row justify-end items-center w-full lg:w-[30%]">
                    <div className="flex flex-row justify-center items-center bg-global-background2 rounded-[5px] p-[18px] sm:p-[20px] md:p-[22px] lg:p-[24px]">
                      <img 
                        src="/images/img_mdi_google_maps.png" 
                        alt="Location" 
                        className="w-[53px] sm:w-[60px] md:w-[65px] lg:w-[70px] h-[53px] sm:h-[60px] md:h-[65px] lg:h-[70px]"
                      />
                    </div>
                    <div className="text-[19px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-kanit font-light leading-[28px] sm:leading-[32px] md:leading-[35px] lg:leading-[37px] text-left text-global-text1 w-[40%] self-end mb-[9px] sm:mb-[10px] md:mb-[11px] lg:mb-[12px] ml-[20px] sm:ml-[22px] md:ml-[24px] lg:ml-[26px]">
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
                      <label className="text-[19px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-bahnschrift font-normal leading-[23px] sm:leading-[27px] md:leading-[29px] lg:leading-[31px] text-justify text-global-text1 ml-[1px] sm:ml-[2px] md:ml-[2px] lg:ml-[3px]">
                        Nom complet
                      </label>
                      <input 
                        type="text"
                        placeholder="Entrez votre nom"
                        className="text-[19px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-bahnschrift font-normal leading-[23px] sm:leading-[27px] md:leading-[29px] lg:leading-[31px] text-justify text-global-text4 bg-global-background8 rounded-[5px] shadow-[0px_4px_4px_#0000003f] px-[26px] sm:px-[29px] md:px-[32px] lg:px-[34px] py-[20px] sm:py-[22px] md:py-[24px] lg:py-[26px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#5dcd62]"
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="flex flex-col gap-[3px] sm:gap-[4px] md:gap-[5px] lg:gap-[6px] justify-start items-start w-full">
                      <label className="text-[19px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-bahnschrift font-normal leading-[23px] sm:leading-[27px] md:leading-[29px] lg:leading-[31px] text-justify text-global-text1 ml-[1px] sm:ml-[2px] md:ml-[2px] lg:ml-[3px]">
                        Numéro de telephone
                      </label>
                      <input 
                        type="tel"
                        placeholder="Entrez votre numéro de telephone"
                        className="text-[19px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-bahnschrift font-normal leading-[23px] sm:leading-[27px] md:leading-[29px] lg:leading-[31px] text-justify text-global-text4 bg-global-background8 rounded-[5px] shadow-[0px_4px_4px_#0000003f] px-[26px] sm:px-[29px] md:px-[32px] lg:px-[34px] py-[18px] sm:py-[20px] md:py-[22px] lg:py-[24px] pt-[21px] sm:pt-[24px] md:pt-[26px] lg:pt-[28px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#5dcd62]"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-[3px] sm:gap-[4px] md:gap-[5px] lg:gap-[6px] justify-start items-start w-full">
                      <label className="text-[19px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-bahnschrift font-normal leading-[23px] sm:leading-[27px] md:leading-[29px] lg:leading-[31px] text-justify text-global-text1 ml-[1px] sm:ml-[2px] md:ml-[2px] lg:ml-[3px]">
                        Adresse mail
                      </label>
                      <input 
                        type="email"
                        placeholder="Entrez votre Adresse mail"
                        className="text-[19px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-bahnschrift font-normal leading-[23px] sm:leading-[27px] md:leading-[29px] lg:leading-[31px] text-justify text-global-text4 bg-global-background8 rounded-[5px] shadow-[0px_4px_4px_#0000003f] px-[26px] sm:px-[29px] md:px-[32px] lg:px-[34px] py-[20px] sm:py-[22px] md:py-[24px] lg:py-[26px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#5dcd62]"
                      />
                    </div>

                    {/* Subject Field */}
                    <div className="flex flex-col gap-[2px] sm:gap-[3px] md:gap-[3px] lg:gap-[4px] justify-start items-start w-full">
                      <label className="text-[19px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-bahnschrift font-normal leading-[23px] sm:leading-[27px] md:leading-[29px] lg:leading-[31px] text-justify text-global-text1 ml-[1px] sm:ml-[2px] md:ml-[2px] lg:ml-[3px]">
                        Sujet
                      </label>
                      <input 
                        type="text"
                        placeholder="Entrez le sujet"
                        className="text-[19px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-bahnschrift font-normal leading-[23px] sm:leading-[27px] md:leading-[29px] lg:leading-[31px] text-justify text-global-text4 bg-global-background8 rounded-[5px] shadow-[0px_4px_4px_#0000003f] px-[26px] sm:px-[29px] md:px-[32px] lg:px-[34px] py-[17px] sm:py-[19px] md:py-[21px] lg:py-[22px] pt-[23px] sm:pt-[26px] md:pt-[28px] lg:pt-[30px] w-full border-0 focus:outline-none focus:ring-2 focus:ring-[#5dcd62]"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <label className="text-[19px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-bahnschrift font-normal leading-[23px] sm:leading-[27px] md:leading-[29px] lg:leading-[31px] text-justify text-global-text1 mt-[35px] sm:mt-[39px] md:mt-[42px] lg:mt-[46px] ml-[3px] sm:ml-[4px] md:ml-[5px] lg:ml-[6px]">
                    Message
                  </label>
                  <div className="flex flex-row justify-start items-start w-full bg-global-background8 rounded-[5px] shadow-[0px_4px_4px_#0000003f] mt-[2px] sm:mt-[3px] md:mt-[3px] lg:mt-[4px] p-[21px] sm:p-[23px] md:p-[25px] lg:p-[26px] pt-[21px] sm:pt-[24px] md:pt-[26px] lg:pt-[28px] pb-[21px] sm:pb-[24px] md:pb-[26px] lg:pb-[28px]">
                    <textarea 
                      placeholder="Entrez votre Adresse mail"
                      rows={8}
                      className="text-[19px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-bahnschrift font-normal leading-[23px] sm:leading-[27px] md:leading-[29px] lg:leading-[31px] text-justify text-global-text4 w-full border-0 bg-transparent resize-none focus:outline-none mb-[134px] sm:mb-[154px] md:mb-[166px] lg:mb-[178px]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-row justify-center items-center w-full">
                <Button 
                  variant="primary"
                  className="text-[19px] sm:text-[22px] md:text-[24px] lg:text-[25px] font-bahnschrift font-normal leading-[23px] sm:leading-[27px] md:leading-[29px] lg:leading-[31px] text-left text-global-text5 bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] px-[26px] sm:px-[29px] md:px-[32px] lg:px-[34px] py-[26px] sm:py-[29px] md:px-[32px] lg:py-[34px] self-end hover:opacity-90 transition-opacity"
                >
                  Envoyez votre Message
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full bg-global-background7">
          <div className="w-full max-w-[1512px] mx-auto">
            <div className="flex flex-row justify-start items-start w-full p-[14px] sm:p-[16px] md:p-[17px] lg:p-[18px]">
              <div className="flex flex-row justify-start items-start w-full px-[12px] sm:px-[14px] md:px-[15px] lg:px-[16px] mb-[54px] sm:mb-[62px] md:mb-[67px] lg:mb-[72px]">
                <div className="flex flex-col lg:flex-row justify-start items-start w-full gap-[30px] lg:gap-0">
                  {/* Logo and Description */}
                  <div className="flex flex-col gap-[18px] sm:gap-[20px] md:gap-[22px] lg:gap-[24px] justify-start items-start self-center w-full lg:w-[34%] px-[7px] sm:px-[10px] md:px-[12px] lg:px-[14px]">
                    <div className="relative w-[330px] sm:w-[380px] md:w-[415px] lg:w-[440px] h-[231px] sm:h-[266px] md:h-[287px] lg:h-[308px]">
                      <img 
                        src="/images/img_logo_500x500_px.png" 
                        alt="MMT Fitness Logo" 
                        className="absolute top-0 left-[9px] sm:left-[13px] md:left-[16px] lg:left-[18px] w-[155px] sm:w-[178px] md:w-[192px] lg:w-[206px] h-[152px] sm:h-[174px] md:h-[188px] lg:h-[202px] object-contain"
                      />
                      <p className="absolute bottom-0 left-[9px] sm:left-[13px] md:left-[16px] lg:left-[18px] text-[12px] sm:text-[13px] md:text-[13px] lg:text-[14px] font-bahnschrift font-normal leading-[20px] sm:leading-[22px] md:leading-[24px] lg:leading-[25px] text-justify lowercase text-global-text1 w-[96%]">
                        Depuis notre création, nous nous engageons à offrir un environnement motivant et inclusif pour tous les passionnés de fitness, où chaque pas vers vos objectifs est célébré et chaque défi devient une occasion de grandir. Notre équipe de coachs certifiés est là pour vous guider avec expertise
                      </p>
                    </div>
                    <div className="flex flex-row justify-center items-center w-[30%] bg-global-background2 rounded-[5px] p-[2px] sm:p-[3px] md:p-[3px] lg:p-[4px] ml-[7px] sm:ml-[10px] md:ml-[12px] lg:ml-[14px]">
                      <div className="flex flex-row justify-between items-center w-full px-[3px] sm:px-[4px] md:px-[4px] lg:px-[6px]">
                        <img 
                          src="/images/img_ic_baseline_facebook.png" 
                          alt="Facebook" 
                          className="w-[18px] sm:w-[21px] md:w-[22px] lg:w-[24px] h-[18px] sm:h-[21px] md:h-[22px] lg:h-[24px]"
                        />
                        <img 
                          src="/images/img_teenyicons_instagram_solid.png" 
                          alt="Instagram" 
                          className="w-[15px] sm:w-[17px] md:w-[19px] lg:w-[20px] h-[15px] sm:h-[17px] md:h-[19px] lg:h-[20px] ml-[40px] sm:ml-[46px] md:ml-[49px] lg:ml-[53px]"
                        />
                        <img 
                          src="/images/img_flowbite_twitter_solid.png" 
                          alt="Twitter" 
                          className="w-[21px] sm:w-[24px] md:w-[26px] lg:w-[28px] h-[21px] sm:h-[24px] md:h-[26px] lg:h-[28px] ml-[35px] sm:ml-[40px] md:ml-[44px] lg:ml-[47px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact and Newsletter */}
                  <div className="flex flex-col gap-[8px] sm:gap-[9px] md:gap-[9px] lg:gap-[10px] justify-start items-center w-full lg:w-auto mt-[23px] sm:mt-[26px] md:mt-[28px] lg:mt-[30px]">
                    <div className="flex flex-row justify-between items-center w-full px-[38px] sm:px-[43px] md:px-[47px] lg:px-[50px]">
                      <h3 className="text-[22px] sm:text-[26px] md:text-[28px] lg:text-[30px] font-bahnschrift font-normal leading-[28px] sm:leading-[32px] md:leading-[35px] lg:leading-[37px] text-left text-global-text1">
                        Contact
                      </h3>
                      <h3 className="text-[22px] sm:text-[26px] md:text-[28px] lg:text-[30px] font-bahnschrift font-normal leading-[28px] sm:leading-[32px] md:leading-[35px] lg:leading-[37px] text-left text-global-text1 mr-[230px] sm:mr-[264px] md:mr-[285px] lg:mr-[306px]">
                        Newsletter
                      </h3>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-center items-start w-full gap-[30px] lg:gap-0">
                      {/* Contact Info */}
                      <div className="flex flex-col gap-[23px] sm:gap-[26px] md:gap-[28px] lg:gap-[30px] justify-start items-center self-end w-full lg:w-[38%] mt-[14px] sm:mt-[16px] md:mt-[17px] lg:mt-[18px]">
                        <div className="flex flex-row justify-start items-center w-full">
                          <button className="w-[38px] sm:w-[43px] md:w-[47px] lg:w-[50px] h-[38px] sm:h-[43px] md:h-[47px] lg:h-[50px] bg-global-background3 rounded-[2px] p-[8px] sm:p-[9px] md:p-[9px] lg:p-[10px]">
                            <img 
                              src="/images/img_mingcute_phone_call_fill.png" 
                              alt="Phone" 
                              className="w-full h-full object-contain"
                            />
                          </button>
                          <span className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-kanit font-light leading-[20px] sm:leading-[23px] md:leading-[25px] lg:leading-[27px] text-left text-global-text1 ml-[14px] sm:ml-[15px] md:ml-[16px] lg:ml-[18px]">
                            +221 66 66 66 66
                          </span>
                        </div>

                        <div className="flex flex-row justify-start items-center w-full">
                          <button className="w-[38px] sm:w-[43px] md:w-[47px] lg:w-[50px] h-[38px] sm:h-[43px] md:h-[47px] lg:h-[50px] bg-global-background3 rounded-[2px] p-[8px] sm:p-[9px] md:p-[9px] lg:p-[10px]">
                            <img 
                              src="/images/img_ic_baseline_email.png" 
                              alt="Email" 
                              className="w-full h-full object-contain"
                            />
                          </button>
                          <span className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-kanit font-light leading-[20px] sm:leading-[23px] md:leading-[25px] lg:leading-[27px] text-left text-global-text1 ml-[14px] sm:ml-[15px] md:ml-[16px] lg:ml-[18px]">
                            info@email.com
                          </span>
                        </div>

                        <div className="flex flex-row justify-start items-center w-full">
                          <button className="w-[38px] sm:w-[43px] md:w-[47px] lg:w-[50px] h-[38px] sm:h-[43px] md:h-[47px] lg:h-[50px] bg-global-background3 rounded-[2px] p-[8px] sm:p-[9px] md:p-[9px] lg:p-[10px]">
                            <img 
                              src="/images/img_mdi_google_maps.png" 
                              alt="Location" 
                              className="w-full h-full object-contain"
                            />
                          </button>
                          <div className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-kanit font-light leading-[20px] sm:leading-[23px] md:leading-[25px] lg:leading-[26px] text-left text-global-text1 w-[32%] ml-[14px] sm:ml-[15px] md:ml-[16px] lg:ml-[18px]">
                            Sénégal Dakar<br />rue 12o
                          </div>
                        </div>
                      </div>

                      {/* Newsletter */}
                      <div className="flex flex-col gap-[15px] sm:gap-[17px] md:gap-[18px] lg:gap-[20px] justify-start items-center w-full lg:w-[54%]">
                        <p className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-bahnschrift font-normal leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[21px] text-left text-global-text3 w-full">
                          Ne manquez aucune actualité, offre exclusive ou conseil coaching de votre centre de fitness préféré ! En vous abonnant, vous recevrez directement dans votre boîte mail .
                        </p>
                        <div className="flex flex-row justify-center items-center w-full">
                          <div className="w-[284px] sm:w-[326px] md:w-[352px] lg:w-[378px] h-[56px] sm:h-[64px] md:h-[69px] lg:h-[74px] bg-global-background3 border border-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-l-[5px]"></div>
                          <div className="flex flex-row justify-center items-end bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-r-[5px] px-[8px] sm:px-[9px] md:px-[9px] lg:px-[10px] py-[8px] sm:px-[9px] md:py-[9px] lg:py-[10px] pt-[8px] sm:pt-[9px] md:pt-[9px] lg:pt-[10px]">
                            <img 
                              src="/images/img_tabler_send.svg" 
                              alt="Send" 
                              className="w-[33px] sm:w-[38px] md:w-[41px] lg:w-[44px] h-[33px] sm:h-[38px] md:h-[41px] lg:h-[44px] mt-[5px] sm:mt-[5px] md:mt-[6px] lg:mt-[6px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="w-full bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] px-[26px] sm:px-[29px] md:px-[32px] lg:px-[34px] py-[8px] sm:py-[9px] md:py-[9px] lg:py-[10px] mt-[-32px] sm:mt-[-36px] md:mt-[-39px] lg:mt-[-42px]">
          <p className="text-[15px] sm:text-[17px] md:text-[19px] lg:text-[20px] font-kanit font-normal leading-[20px] sm:leading-[23px] md:leading-[25px] lg:leading-[27px] text-center text-global-text5">
            <span className="text-global-text5">© 2025 nom du site. Tous droits réservés | Design By </span>
            <span className="text-global-text5 underline">Maisoft.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;