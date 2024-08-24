import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const YearlyPlansList = ({selectedPlan, planSelected}) => {
    const styles = {
        text: (isSelected) => ({
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            gap: 10,
            color: isSelected ? '#0B96B4' : 'white',
            marginTop: 10,
            fontSize: '2vh',  // Adjusted font size
        }),
        price: (isSelected) => ({
            textAlign: 'center',
            fontSize: '3vh',  // Adjusted font size
            color: isSelected ? '#0B96B4' : 'white',
            fontWeight: 'bold',
        }),
        subtitle: (isSelected) => ({
            textAlign: 'center',
            fontSize: '2vh',  // Adjusted font size
            color: isSelected ? '#0B96B4' : 'white',
            fontWeight: '400',
        }),
        descText:(isSelected) =>({
            fontSize:'2vh',
            fontWeight:isSelected?600:400
        })
    }

    const settings = {
        dots: true,
        // infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
    };

    const [actPrivate, setActPrivate] = useState(false)
    const [actExecutive, setActExecutive] = useState(false)


    useEffect(()=>{
        console.log("Plan changed in yearly ", selectedPlan)
        if(selectedPlan === "yearly_private"){
            setActExecutive(false)
            setActPrivate(true)
        }
        else if(selectedPlan === "yearly_executive"){
            setActExecutive(true)
            setActPrivate(false)
        } 
    }, [selectedPlan])

    return (
        <FormContainer>
            <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Slider {...settings} className="slider-container">
                    <div className='card-box' onClick={() => {
                        setActPrivate(true)
                        setActExecutive(false)
                        planSelected("yearly_private")
                    }}>
                        <div style={{ color: actPrivate ? '#0B96B4' : 'white', textAlign: 'center', paddingTop: 0,fontSize:'4vh' }}>PRIVATE</div>
                        <div style={{
                            borderColor: actPrivate ? "#0B96B4" : 'white', borderWidth: 1, borderStyle: 'solid',
                            padding: 20, borderRadius: 3
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 5 }}>
                                <div style={styles.price(actPrivate)}>
                                    $12k
                                </div>
                                <div style={styles.subtitle(actPrivate)}>
                                    yearly*
                                </div>
                            </div>
                            <div style={{
                                flexDirection: 'column', width: '100%', marginTop: 15
                            }}>
                                <div style={styles.text(actPrivate)}>
                                    <img className='logo' src={actPrivate?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actPrivate)}>Unlimited requests per month</div>  {/* Adjusted font size */}
                                </div>
                                <div style={styles.text(actPrivate)}>
                                    <img className='logo' src={actPrivate?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actPrivate)}>App + WhatsApp support</div>  {/* Adjusted font size */}
                                </div>
                                <div style={styles.text(actPrivate)}>
                                    <img className='logo' src={actPrivate?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actPrivate)}>Up to 5 Locations</div>  {/* Adjusted font size */}
                                </div>
                                <div style={styles.text(actPrivate)}>
                                    <img className='logo' src={actPrivate?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actPrivate)}>Restaurants / Nightlife</div>  {/* Adjusted font size */}
                                </div>
                                <div style={styles.text(actPrivate)}>
                                    <img className='logo' src={actPrivate?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actPrivate)}>Global Villa + Yacht Rentals</div>  {/* Adjusted font size */}
                                </div>
                                <div style={styles.text(actPrivate)}>
                                    <img className='logo' src={actPrivate?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actPrivate)}>Private Jet + First Class Flights</div>  {/* Adjusted font size */}
                                </div>
                                <div style={styles.text(actPrivate)}>
                                    <img className='logo' src={actPrivate?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actPrivate)}>Exclusive Event Access</div>  {/* Adjusted font size */}
                                </div>
                                <div style={{opacity:0,height:35}}>
                                    <img className='logo' src={actPrivate?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={{ fontSize: '2vh', fontWeight: '600' }}>Exclusive Event Access</div>  {/* Adjusted font size */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='card-box' onClick={() => {
                        setActPrivate(false)
                        setActExecutive(true)
                        planSelected("yearly_executive")
                    }}>
                        <div style={{ color: actExecutive ? '#0B96B4' : 'white', textAlign: 'center', paddingTop: 0 ,fontSize:'4vh'}}>EXECUTIVE</div>
                        <div style={{
                            borderColor: actExecutive ? "#0B96B4" : 'white', borderWidth: 1, borderStyle: 'solid',
                            padding: 20, borderRadius: 3
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 5 }}>
                                <div style={styles.price(actExecutive)}>
                                    $48k
                                </div>
                                <div style={styles.subtitle(actExecutive)}>
                                    yearly*
                                </div>
                            </div>
                            <div style={{
                                flexDirection: 'column', width: '100%', marginTop: 15
                            }}>
                                <div style={styles.text(actExecutive)}>
                                    <img className='logo' src={actExecutive?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actExecutive)}>Private +</div>  {/* Adjusted font size */}
                                </div>
                                <div style={styles.text(actExecutive)}>
                                    <img className='logo' src={actExecutive?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actExecutive)}>Real-time Support: 24/7/365</div>  {/* Adjusted font size */}
                                </div>
                                <div style={styles.text(actExecutive)}>
                                    <img className='logo' src={actExecutive?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actExecutive)}>Up to 10 Locations</div>  {/* Adjusted font size */}
                                </div>
                                <div style={styles.text(actExecutive)}>
                                    <img className='logo' src={actExecutive?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actExecutive)}>Executive Retreats / Wellness</div>  {/* Adjusted font size */}
                                </div>
                                <div style={styles.text(actExecutive)}>
                                    <img className='logo' src={actExecutive?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actExecutive)}>Private Events/ Music Bookings</div>  {/* Adjusted font size */}
                                </div>
                                <div style={styles.text(actExecutive)}>
                                    <img className='logo' src={actExecutive?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actExecutive)}>Exclusive Experiences (Galas)</div>  {/* Adjusted font size */}
                                </div>
                                <div style={styles.text(actExecutive)}>
                                    <img className='logo' src={actExecutive?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actExecutive)}>Private Membership Clubs</div>  {/* Adjusted font size */}
                                </div>
                                <div style={styles.text(actExecutive)}>
                                    <img className='logo' src={actExecutive?'/selectedTick.png':'/unselectedTick.png'} alt='tick' height={20} />
                                    <div style={styles.descText(actExecutive)}>Guests - Spouse +1</div>  {/* Adjusted font size */}
                                </div>
                            </div>
                        </div>
                    </div>
                </Slider>
            </div>
        </FormContainer>
    )
}

export default YearlyPlansList

const FormContainer = styled.div`
    .slider-container {
        width: 90%;  /* Reduced width for smaller screens */
        // max-width: 375px;  /* iPhone SE width */
        margin: auto;
        position: relative;
    }

    .card-box {
        width: 100%;
        // max-width: 350px;  /* Ensure content fits within the screen */
        margin: auto;
        padding: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* Customize dots */
    .slick-dots {
        position: relative;
        top: 3px;  /* Adjusted dot position */
        width: 100%;
        display: flex !important;
        justify-content: center;
        padding: 0;
        margin: 0;
    }

    .slick-dots li {
        margin: 0 5px;  /* Adjust space between dots */
    }

    .slick-dots li button:before {
        font-size: 12px;  /* Adjusted dot size */
        color: gray;
        font-weight: bold;
    }

    .slick-dots li.slick-active button:before {
        color: white;
        font-weight: bold;
    }

    @media (max-width: 375px) {
        .card-box {
            padding: 10px;  /* Reduce padding for smaller screens */
        }
        .slider-container {
            width: 100%;
        }
    }
`;
