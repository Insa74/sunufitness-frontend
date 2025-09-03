import React, { Component } from 'react'

export class Footer extends Component {
  render() {
    return (
      <div className="w-full">
         {/* Footer */}
         <div className="w-full bg-global-background7">
          <div className="w-full  mx-auto">
            <div className="flex flex-col justify-start items-start w-full p-[20px] sm:p-[24px] md:p-[28px] lg:p-[18px]">
              <div className="flex flex-col justify-start items-center w-full px-4 sm:px-6 md:px-8 lg:px-[16px] mb-[40px] sm:mb-[50px] md:mb-[60px] lg:mb-[72px]">
                <div className="flex flex-col lg:flex-row justify-start items-center lg:items-start w-full gap-[40px] sm:gap-[50px] md:gap-[60px] lg:gap-[80px]">
                  {/* Logo and Description */}
                  <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[24px] justify-start items-center lg:items-start w-full lg:w-[40%] px-4 lg:px-[14px]">
                    <div className="flex flex-col items-center lg:items-start w-full max-w-[350px] lg:max-w-none">
                      <img 
                        src="/images/img_logo_500x500_px.png" 
                        alt="MMT Fitness Logo" 
                        className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[206px] h-[120px] sm:h-[140px] md:h-[160px] lg:h-[202px] object-contain mb-[16px] sm:mb-[20px] md:mb-[24px] lg:mb-[28px]"
                      />
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] font-bahnschrift font-light leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[25px] text-center lg:text-justify lowercase text-global-text1 w-full">
                        Depuis notre création, nous nous engageons à offrir un environnement motivant et inclusif pour tous les passionnés de fitness, où chaque pas vers vos objectifs est célébré et chaque défi devient une occasion de grandir. Notre équipe de coachs certifiés est là pour vous guider avec expertise
                      </p>
                    </div>
                    <div className="flex   flex-row justify-center items-center w-[160px] sm:w-[160px] md:w-[200px] lg:w-[37%] bg-global-background3 rounded-[6px] py-[10px] sm:py-[12px] px-[20px] sm:px-[24px] lg:px-[16px]">
                      <div className="flex gap-[10px] flex-row justify-between items-center w-full">
                        <img 
                          src="/images/img_ic_baseline_facebook.png" 
                          alt="Facebook" 
                          className="w-[20px] sm:w-[22px] md:w-[24px] lg:w-[24px] h-[20px] sm:h-[22px] md:h-[24px] lg:h-[24px]"
                        />
                        <img 
                          src="/images/img_teenyicons_instagram_solid.png" 
                          alt="Instagram" 
                          className="w-[18px] sm:w-[20px] md:w-[22px] lg:w-[20px] h-[18px] sm:h-[20px] md:h-[22px] lg:h-[20px]"
                        />
                        <img 
                          src="/images/img_flowbite_twitter_solid.png" 
                          alt="Twitter" 
                          className="w-[20px] sm:w-[22px] md:w-[24px] lg:w-[24px] h-[20px] sm:h-[22px] md:h-[24px] lg:h-[24px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact and Newsletter */}
                  <div className="flex flex-col gap-[32px] sm:gap-[40px] md:gap-[48px] lg:gap-[10px] justify-start items-center w-full lg:w-[60%]">
                    {/* Mobile/Tablet Headers - Stacked */}
                    <div className="flex flex-col lg:hidden gap-[32px] sm:gap-[40px] md:gap-[48px] w-full">
                      <h3 className="text-[20px] sm:text-[24px] md:text-[28px] font-bahnschrift font-normal leading-[24px] sm:leading-[28px] md:leading-[32px] text-center text-global-text1">
                        Contact
                      </h3>
                    </div>
                    
                    {/* Desktop Headers - Side by Side */}
                    <div className="hidden lg:flex flex-row w-full px-[50px]">
                      <div className="w-[38%]">
                        <h3 className="text-[30px] font-bahnschrift font-normal leading-[37px] text-left text-global-text1">
                          Contact
                        </h3>
                      </div>
                      <div className="w-[54%]">
                        <h3 className="text-[30px] ml-[36px] font-bahnschrift font-normal leading-[37px] text-left text-global-text1">
                          Newsletter
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-center items-start w-full gap-[40px] sm:gap-[50px] md:gap-[60px] lg:gap-0">
                      {/* Contact Info */}
                      <div className="flex flex-col gap-[20px] sm:gap-[24px] md:gap-[28px] lg:gap-[30px] justify-start items-center lg:items-start w-full lg:w-[38%] max-w-[400px] lg:max-w-none mx-auto lg:mx-0">
                        <div className="flex flex-row justify-center lg:justify-start items-center w-full">
                          <button className="w-[40px] sm:w-[44px] md:w-[48px] lg:w-[50px] h-[40px] sm:h-[44px] md:h-[48px] lg:h-[50px] bg-global-background3 rounded-[2px] p-[8px] sm:p-[9px] md:p-[10px] lg:p-[10px] flex-shrink-0">
                            <img 
                              src="/images/img_mingcute_phone_call_fill.png" 
                              alt="Phone" 
                              className="w-full h-full object-contain"
                            />
                          </button>
                          <span className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-kanit font-light leading-[20px] sm:leading-[23px] md:leading-[25px] lg:leading-[27px] text-center lg:text-left text-global-text1 ml-[16px] sm:ml-[18px] md:ml-[20px] lg:ml-[18px]">
                            +221 66 66 66 66
                          </span>
                        </div>

                        <div className="flex flex-row justify-center lg:justify-start items-center w-full">
                          <button className="w-[40px] sm:w-[44px] md:w-[48px] lg:w-[50px] h-[40px] sm:h-[44px] md:h-[48px] lg:h-[50px] bg-global-background3 rounded-[2px] p-[8px] sm:p-[9px] md:p-[10px] lg:p-[10px] flex-shrink-0">
                            <img 
                              src="/images/img_ic_baseline_email.png" 
                              alt="Email" 
                              className="w-full h-full object-contain"
                            />
                          </button>
                          <span className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-kanit font-light leading-[20px] sm:leading-[23px] md:leading-[25px] lg:leading-[27px] text-center lg:text-left text-global-text1 ml-[16px] sm:ml-[18px] md:ml-[20px] lg:ml-[18px]">
                            info@email.com
                          </span>
                        </div>

                        <div className="flex flex-row justify-center lg:justify-start items-center w-full">
                          <button className="w-[40px] sm:w-[44px] md:w-[48px] lg:w-[50px] h-[40px] sm:h-[44px] md:h-[48px] lg:h-[50px] bg-global-background3 rounded-[2px] p-[8px] sm:p-[9px] md:p-[10px] lg:p-[10px] flex-shrink-0">
                            <img 
                              src="/images/img_mdi_google_maps.png" 
                              alt="Location" 
                              className="w-full h-full object-contain"
                            />
                          </button>
                          <div className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-kanit font-light leading-[20px] sm:leading-[23px] md:leading-[25px] lg:leading-[26px] text-center lg:text-left text-global-text1 ml-[16px] sm:ml-[18px] md:ml-[20px] lg:ml-[18px]">
                            Sénégal Dakar<br />rue 12o
                          </div>
                        </div>
                      </div>

                      {/* Newsletter - Mobile/Tablet */}
                      <div className="flex flex-col lg:hidden gap-[20px] sm:gap-[24px] md:gap-[28px] justify-start items-center w-full max-w-[400px] mx-auto">
                        <h3 className="text-[20px] sm:text-[24px] md:text-[28px] font-bahnschrift font-normal leading-[24px] sm:leading-[28px] md:leading-[32px] text-center text-global-text1">
                          Newsletter
                        </h3>
                        <p className="text-[13px] sm:text-[14px] md:text-[16px] font-bahnschrift font-light leading-[18px] sm:leading-[20px] md:leading-[22px] text-center text-global-text3 w-full">
                          Ne manquez aucune actualité, offre exclusive ou conseil coaching de votre centre de fitness préféré ! En vous abonnant, vous recevrez directement dans votre boîte mail .
                        </p>
                        <div className="flex flex-col sm:flex-row items-center w-full gap-[12px] sm:gap-0">
                          <input 
                            type="email" 
                            placeholder="Votre adresse email"
                            className="w-full sm:flex-1 h-[44px] sm:h-[48px] md:h-[50px] bg-global-background3 border border-[#5dcd62] rounded-[5px] sm:rounded-l-[5px] sm:rounded-r-none px-[16px] sm:px-[18px] text-[13px] sm:text-[14px] md:text-[15px] font-bahnschrift text-global-text1 placeholder:text-global-text1 placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#5dcd62]"
                          />
                          <button className="flex flex-row justify-center items-center bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-[5px] sm:rounded-l-none sm:rounded-r-[5px] px-[16px] sm:px-[12px] py-[12px] sm:py-[14px] md:py-[16px] w-full sm:w-auto hover:opacity-90 transition-opacity">
                            <img 
                              src="/images/img_tabler_send.svg" 
                              alt="Send" 
                              className="w-[20px] sm:w-[24px] md:w-[28px] h-[20px] sm:h-[24px] md:h-[28px]"
                            />
                            <span className="text-[13px] sm:text-[14px] font-bahnschrift text-global-text5 ml-[8px] sm:hidden">
                              S'abonner
                            </span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Newsletter - Desktop */}
                      <div className="hidden lg:flex flex-col gap-[20px] justify-start items-start w-full lg:w-[54%]">
                        <p className="text-[18px] font-bahnschrift font-light leading-[21px] text-left text-global-text3 w-full">
                          Ne manquez aucune actualité, offre exclusive ou conseil coaching de votre centre de fitness préféré ! En vous abonnant, vous recevrez directement dans votre boîte mail .
                        </p>
                        <div className="flex flex-row items-center w-full">
                          <input 
                            type="email" 
                            placeholder="Votre adresse email"
                            className="w-[290px] h-[46px] bg-global-background3 border border-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-l-[5px] px-[16px] text-[15px] font-bahnschrift text-global-text1 placeholder:text-global-text1 placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#5dcd62]"
                          />
                          <div className="flex flex-row items-center bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] rounded-r-[5px] px-[9px] py-[9px]">
                            <img 
                              src="/images/img_tabler_send.svg" 
                              alt="Send" 
                              className="w-[32px] h-[32px]"
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
        <div className="w-full bg-[linear-gradient(90deg,#5dcd62_0%,_#21ac28_100%)] px-4 sm:px-6 md:px-8 lg:px-[34px] py-[12px] sm:py-[14px] md:py-[16px] lg:py-[10px]">
          <p className="text-[13px] sm:text-[15px] md:text-[17px] lg:text-[20px] font-kanit font-normal leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[27px] text-center text-global-text5 w-full  mx-auto">
            <span className="text-global-text5">© 2025 MMT Fitness. Tous droits réservés</span>
            <span className="block sm:inline text-global-text5"> | Design By </span>
            <span className="text-global-text5 underline">Maisoft.</span>
          </p>
        </div>
      </div>
    )
  }
}

export default Footer