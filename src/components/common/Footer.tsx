import React, { Component } from 'react'

export class Footer extends Component {
  render() {
    return (
      <div>
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
                    <div className="flex flex-row justify-center items-center w-[30%] bg-global-background3 rounded-[6px] py-[8px] px-[16px] ml-[7px] sm:ml-[10px] md:ml-[12px] lg:ml-[14px]">
                      <div className="flex flex-row justify-between items-center w-full">
                        <img 
                          src="/images/img_ic_baseline_facebook.png" 
                          alt="Facebook" 
                          className="w-[18px] sm:w-[21px] md:w-[22px] lg:w-[24px] h-[18px] sm:h-[21px] md:h-[22px] lg:h-[24px]"
                        />
                        <img 
                          src="/images/img_teenyicons_instagram_solid.png" 
                          alt="Instagram" 
                          className="w-[15px] sm:w-[17px] md:w-[19px] lg:w-[20px] h-[15px] sm:h-[17px] md:h-[19px] lg:h-[20px]"
                        />
                        <img 
                          src="/images/img_flowbite_twitter_solid.png" 
                          alt="Twitter" 
                          className="w-[18px] sm:w-[21px] md:w-[22px] lg:w-[24px] h-[18px] sm:h-[21px] md:h-[22px] lg:h-[24px]"
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
                        <div className="flex flex-row items-center w-full">
                          <input 
                            type="email" 
                            placeholder="Votre adresse email"
                            className="w-[220px] sm:w-[250px] md:w-[270px] lg:w-[290px] h-[40px] sm:h-[45px] md:h-[48px] lg:h-[46px] bg-global-background3 border border-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-l-[5px] px-[12px] sm:px-[14px] md:px-[15px] lg:px-[16px] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-bahnschrift text-global-text1 placeholder:text-global-text1 placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#5dcd62]"
                          />
                          <div className="flex flex-row items-center bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-r-[5px] px-[6px] sm:px-[7px] md:px-[8px] lg:px-[9px] py-[6px] sm:py-[7px] md:py-[8px] lg:py-[9px]">
                            <img 
                              src="/images/img_tabler_send.svg" 
                              alt="Send" 
                              className="w-[24px] sm:w-[28px] md:w-[30px] lg:w-[32px] h-[24px] sm:h-[28px] md:h-[30px] lg:h-[32px]"
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
    )
  }
}

export default Footer