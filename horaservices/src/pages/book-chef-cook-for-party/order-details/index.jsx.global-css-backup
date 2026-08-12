import React, { useState, useEffect, useRef } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Modal, Button, Row, Col, Spinner } from 'react-bootstrap';
import orderWarning from "../../../assets/OrderWarning.png";
import Popup from '../../../utils/popup';
import '../../../css/chefOrder.css';
import styled from 'styled-components';
import SelectDishes from "../../../assets/selectDish.png";
import SelectDateTime from "../../../assets/event2.png";
import SelectConfirmOrder from "../../../assets/confirm_order.png";
import { useRouter } from "next/router";
import Image from 'next/image';
import info from '../../../assets/info.png';
import verticalSeparator from '../../../assets/verticalSeparator.png';
import minusIcon from '../../../assets/ic_minus.png';
import plusIcon from '../../../assets/plus.png';
import burner from '../../../assets/burner.png';

const orangeColor = '#FF6F61';
const defaultColor = '#B0BEC5';

const SelectDate = ({ history, currentStep }) => {
    const router = useRouter();
    // const { orderType, selectedDishDictionary, selectedDishPrice, selectedDishes, isDishSelected, selectedCount } = router.query || {}; // Accessing subCategory and itemName safely
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
     const [activeTab, setActiveTab] = useState('right');
    const [showAll, setShowAll] = useState(false);
    const [burnerCount, setBurnerCount] = useState(0)
    const [isWarningVisible, setWarningVisible] = useState(false);
    const [isTimeValid, setTimeValid] = useState(null);
    const [isDateValid, setDateValid] = useState(null);
    const [errorText, setErrorText] = useState(null)
    const [isDatePressed, setIsDatePressed] = useState(false)
    const [isTimePressed, setIsTimePressed] = useState(false)
    const [showCookingTime, setShowCookingTime] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState('Appliances');
      const [isMobile, setIsMobile] = useState(false);
 const [peopleCount, setPeopleCount] = useState(1);
    const [selectedDishes, setSelectedDishes] = useState([]);
    const [selectedDishDictionary, setSelectedDishDictionary] = useState({});
    const [dishBasePrice, setDishBasePrice] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedCount, setSelectedCount] = useState(0);
    const [isDishSelected, setIsDishSelected] = useState(false);
    const [orderType, setOrderType] = useState('');
    
    const [isWarningVisibleForTotalAmount, setWarningVisibleForTotalAmount] = useState(false);

    // ✅ GET DATA FROM ROUTER QUERY
    useEffect(() => {
        if (router.query) {
            let {
                orderType,
                selectedDishDictionary,
                selectedDishPrice,
                selectedDishes,
                isDishSelected,
                selectedCount,
                peopleCount
            } = router.query;

            setOrderType(orderType);
            setIsDishSelected(isDishSelected === "true" || isDishSelected);
            setSelectedCount(Number(selectedCount) || 0);
            setPeopleCount(Number(peopleCount) || 1);

            try {
                setSelectedDishDictionary(JSON.parse(selectedDishDictionary || "{}"));
                setSelectedDishes(JSON.parse(selectedDishes || "[]"));
            } catch (err) {
                console.error("Parsing Error:", err);
            }

            setDishBasePrice(Number(selectedDishPrice) || 0);
        }
    }, [router.query]);

    // ✅ FINAL PRICE CALCULATION (People + Safe charge)
   useEffect(() => {
    const numericPeopleCount = Number(peopleCount) || 1;

    // ✅ Charge ₹49 per extra person (beyond 1st)
    const peopleCharge = numericPeopleCount > 1 ? (numericPeopleCount - 1) * 49 : 0;

    const safeCharge = selectedCount >= 7 ? 700 : 0;   // ✅ 7 or more dishes → 700

    const total = dishBasePrice + peopleCharge + safeCharge;
    setTotalAmount(total);

    console.log({
        dishBasePrice,
        peopleCharge,
        safeCharge,
        total
    });
}, [peopleCount, selectedCount, dishBasePrice]);


    // ✅ INCREASE / DECREASE PEOPLE COUNT
    const increasePeopleCount = () => {
        if (peopleCount >= 35) {
            alert("You cannot select more than 35 people.");
        } else {
            setPeopleCount(peopleCount + 1);
        }
    };

    const decreasePeopleCount = () => {
        if (peopleCount > 1) {
            setPeopleCount(peopleCount - 1);
        }
    };

    // ✅ WARNING CLOSE
    const handleWarningClose = () => {
        setWarningVisibleForTotalAmount(false);
    };

    // ✅ CONTINUE BUTTON CLICK
    const onContinueClick = () => {
        if (totalAmount < 700) {
            setWarningVisibleForTotalAmount(true);
            setPopupMessage({
                img: orderWarning,
                title: "Total Order Amount is less than ₹700",
                body: "Total Order amount cannot be less than ₹700. Add more to continue.",
                button: "Add More",
            });
            return;
        }

        const navigateState = {
            from: window.location.pathname,
            peopleCount,
            selectedDishDictionary: JSON.stringify(selectedDishDictionary),
            selectedDishPrice: dishBasePrice,
            selectedDishes: JSON.stringify(selectedDishes),
            orderType,
            isDishSelected,
            selectedCount,
            totalAmount
        };

        router.push({
            pathname: '/book-chef-checkout',
            query: navigateState
        });
    };
    const data = selectedDishDictionary;

    // Container for the whole component
    const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 10px;

  @media (max-width: 768px) {
    padding: 0;
  }
  `;

    // Layout for heading and control section
    const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
  }
  `;

    // Heading
    const Heading = styled.p`
  margin: 0;
  font-size: 18px;
  color: #3C3C3E;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 10px;
  }
  `;

    // Buttons container
    const ControlButtons = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    margin: 0;
  }
  `;

    // Container for Range Input and Count Display
    const RangeContainer = styled.div`
  display: flex;
  align-items: center;
  width: 94%;
  max-width: 920px;
  margin-top: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
  `;

    // Range Input container
    const RangeWrapper = styled.div`
  flex: 1;
  padding: 5px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
  }
  `;

    // Text
    const CountText = styled.p`
  margin: 0 10px;
  line-height: 23px;
  font-size: 18px;
  text-align: center;
  color: black;

  @media (max-width: 768px) {
    font-size: 16px;
  }
  `;

    // Display Count
    const CountDisplay = styled.p`
      margin-left: 20px;
      line-height: 23px;
      font-size: 18px;
      text-align: center;
      color: black;

      @media (max-width: 768px) {
       font-size: 16px;
       margin-left: 0; // Adjust margin for mobile
      }
   `;
    //different


    const Container = styled.div`
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row; // Align items horizontally
      overflow-x: auto;    // Enable horizontal scrolling if needed
      padding: 10px;      // Adjust padding for mobile view
      width: 100%;        // Ensure it takes up the full width of the parent
      white-space: nowrap; // Prevent labels from wrapping to the next line

      @media (max-width: 600px) {
        padding: 5px;    // Reduce padding on smaller screens
      }
    `;

    const Step = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 10px;    // Adjust margin for spacing
    `;

    const Line = styled.div`
      height: 2px;
      width: 50px;       // Default width for mobile view
      background-color: #ccc;
      margin: 0 4px;     // Adjust margin for spacing
      color: ${(props) => (props.active ? '#F46C5B' : 'black')};

      @media (max-width: 600px) {
        width: 30px;     // Smaller width for mobile view
      }
    `;

    // const Image = styled.img`
    //   width: 48px;       // Default size for mobile view
    //   height: 48px;

    //   ${(props) => props.active && `border: 2px solid #000;`};

    //   @media (max-width: 600px) {
    //   width: 32px;     // Smaller width for mobile view
    //   height: 32px;    // Maintain aspect ratio
    // }
    // `;

    const Label = styled.div`
      margin-top: 5px;
      text-align: center;
      font-size: 14px;   // Default font size
      color: ${(props) => (props.active ? '#F46C5B' : 'black')}; // Color based on active prop
      white-space: nowrap; // Prevent text from wrapping

      @media (max-width: 600px) {
        font-size: 10px; // Smaller font size for mobile view
      }
    `;

    const [popupMessage, setPopupMessage] = useState({
        img: "",
        title: "",
        body: "",
        button: "",
    });

    const minPeopleCount = 1
    const maxPeopleCount = 35
    const step = 1;

 
    // // old handelRange
    // const handleRangeChange = (e) => {
    //     // console.log(e.target.value)
    //     const value = parseInt(e.target.value, 10);
    //     setPeopleCount(value);
    //     setDishPrice(value * 49); // Assuming 49 is the unit price
    // };

    // New HadelRangeChanges
    // const handleRangeChange = (e) => {
    //     // console.log(e.target.value)
    //     const value = parseInt(e.target.value, 10);
    //     setPeopleCount(value);
    //     setDishPrice(Number(selectedDishPrice )+ (value * 49)); // Assuming 49 is the unit price
    // };
    
   


   

       

   

    const getTotalBurnerCount = () => {
        let totalBurnerCount = 0;

        for (const dishId in data) {
            const dish = data[dishId];
            if (dish.is_gas) {
                totalBurnerCount += 1;
            }
        }

        if (totalBurnerCount <= 6)
            return 2;
        else if (totalBurnerCount > 6 && totalBurnerCount < 10)
            return 3;
        else if (totalBurnerCount > 10)
            return 4;
    };

    const getTotalSpecialAppliances = () => {
        const totalSpecialAppliances = {};
        for (const dishId in data) {
            const dish = data[dishId];
            if (dish.special_appliance_id) {
                dish.special_appliance_id.forEach((appliance) => {
                    if (!totalSpecialAppliances[appliance._id]) {
                        totalSpecialAppliances[appliance._id] = { ...appliance };
                    }
                });
            }
        }
        return Object.values(totalSpecialAppliances);
    };

    const defaultImage = 'https://play-lh.googleusercontent.com/a-/ALV-UjXtTD4G9gbxQz1RSCSnAEkBxESsZuZI2pSfXLzd6WjXDJ3muobz6w=s32-rw'; // Replace with the path to your default image

    const getTotalIngredients = () => {
        let totalIngredients = {};
        for (const dishId in data) {
            const dish = data[dishId];
            if (dish.ingredientUsed) {
                dish.ingredientUsed.forEach((ingredient) => {
                    const { _id, name, image, unit, qty } = ingredient;

                    if (!totalIngredients[_id]) {
                        totalIngredients[_id] = {
                            _id,
                            name,
                            image: image && image.trim() !== '' ? image : defaultImage,
                            unit: '',
                            qty: 0,
                            count: 0,
                        };
                    }

                    totalIngredients[_id].qty += parseInt(qty, 10);
                    totalIngredients[_id].count += 1;

                    // Normalize units
                    if (unit.toLowerCase() === 'gram') {
                        totalIngredients[_id].unit = 'g';
                    } else if (unit.toLowerCase() === 'ml') {
                        totalIngredients[_id].unit = 'ml';
                    } else {
                        totalIngredients[_id].unit = unit; // Keep the original unit if it's not 'gram' or 'ml'
                    }
                });
            }
        }
        return Object.values(totalIngredients);
    };

    const RenderAppliances = ({ item }) => {
        return (
            <div style={{ height: '51px', paddingRight: '2px', alignItems: 'center', borderRadius: '5px', borderColor: '#DADADA', borderWidth: '0.5px', flexDirection: 'row', marginRight: '6px', marginBottom: '8px', display: 'flex', borderStyle: 'solid' }}>
                <div style={{ marginLeft: '5px', width: '40px', height: '40px', backgroundColor: '#F0F0F0', borderRadius: '3px', alignItems: 'center', justifyContent: 'center', marginRight: '5px', display: 'flex' }}>
                    <Image src={`https://horaservices.com/api/uploads/${item.image}`} alt={item.name} height={34} width={34} />
                </div>

                <div style={{ flexDirection: 'column', marginLeft: '1px', width: '43px', display: 'flex' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#414141', lineHeight: '15px' }} title={item.name}>{item.name}</span>
                </div>
            </div>
        );
    };

    const RenderIngredients = ({ key, item }) => {
        let quantity = item.qty * peopleCount;

        if (item.count == 4) {
            quantity = quantity * 0.7
        }
        else if (item.count == 5) {
            quantity = quantity * 0.6
        }
        else if (item.count == 6) {
            quantity = quantity * 0.5
        }
        else if (item.count == 7) {
            quantity = quantity * 0.4
        }
        else if (item.count == 8) {
            quantity = quantity * 0.35
        }
        else if (item.count == 9) {
            quantity = quantity * 0.3
        }
        else if (item.count == 10) {
            quantity = quantity * 0.28
        }
        else if (item.count == 11) {
            quantity = quantity * 0.25
        }

        quantity = Math.round(quantity)
        let unit = item.unit;
        if (quantity >= 1000) {
            quantity = quantity / 1000;
            if (unit === 'g')
                unit = 'kg'
            else if (unit === 'ml')
                unit = 'L'
        }
        return (
            <div style={{
                width: "23%", alignItems: 'center', borderRadius: 5, border: "1px solid #DADADA",
                flexDirection: 'row', padding: "10px", display: "flex", marginBottom: "20px", marginRight: "10px"
            }} className='ingredientsec'>
                <div style={{
                    marginLeft: 5, width: "45%", height: "auto", backgroundColor: '#F0F0F0', borderRadius: "10px",
                    alignItems: 'center', padding: "5%", justifyContent: 'center', marginRight: 15
                }} className='ingredientleftsec'>
                    <Image src={`https://horaservices.com/api/uploads/${item.image}`} alt={item.name} width={120} height={isMobile ? 27 : 44} />
                </div>
                <div style={{ flexDirection: 'column', marginLeft: 1, width: 80 }} className='ingredientrightsec'>
                    <div style={{ fontSize: "70%", fontWeight: '500', color: '#414141' }} className='ingredientrightsecheading'>{item.name}</div>
                    <div style={{ fontSize: "110%", fontWeight: '700', color: '#9252AA', textTransform: "lowerCase" }}
                        className='ingredientrightsecsibheading'>{quantity + ' ' + unit}</div>
                </div>
            </div>
        );
    };

    const LeftTabContent = ({ burnerCount, ApplianceList }) => {
        return (
            <>
                <div style={{ padding: "10px 20px 20px 20px", flexDirection: 'column', backgroundColor: 'white', borderBottomRightRadius: 15, borderBottomLeftRadius: 15 }}>
                    <div style={{ flexDirection: 'column' }} className="req-applicance-details">
                        <p style={{ color: '#000000', fontSize: "100%", fontWeight: '400' }} >Required Burners</p>
                        <p style={{ color: '#969696', fontSize: "100%", fontWeight: '400' }}>Number of burners depend upon the number of dishes chosen</p>
                        <p style={{ color: '#969696', fontSize: "100%", fontWeight: '400' }}>(Burners would be used at your location)</p>
                    </div>

                    <div style={{ width: 90, height: 54, flexDirection: 'column', borderColor: "#DADADA", borderWidth: 0.5, borderRadius: 5 }}>
                        <div style={{ flexDirection: 'row' }}>
                            <Image style={styles.burner} src={burner} alt="burner" />
                            <span style={{ marginInlineStart: 12, marginBlock: 6, fontSize: 26, color: "#9252AA" }}>{burnerCount}</span>
                        </div>
                    </div>

                    {ApplianceList.length > 0 && (
                        <div style={{ flexDirection: 'column', marginTop: 11 }}>
                            <div style={{ flexDirection: 'column' }}>
                                <span style={{ color: '#000000', fontSize: 13, fontWeight: '600' }}>Requires Special Appliances</span>
                                <span style={{ color: '#969696', fontSize: 11, fontWeight: '500', marginTop: 7 }}>(Keep these appliances ready at your location)</span>
                            </div>
                        </div>
                    )}

                    {ApplianceList.length > 0 && (
                        <div style={{ flexDirection: 'row', marginTop: 11 }}>
                            <Image style={styles.verticalSeparator} src={verticalSeparator} alt="separator" />
                        </div>
                    )}

                    <div style={{ flexDirection: 'column', marginTop: 8 }}>
                        <ListGroup>
                            {ApplianceList.map(item => (
                                <ListGroup.Item key={item.id}>
                                    <RenderAppliances item={item} />
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>

                    {/* {preparationTextList.length > 0 && (
        <div style={{ flexDirection: 'column', backgroundColor: '#F9E9FF', borderRadius: 15, paddingInline: 10 }}>
            <div style={styles.header}>
                <span style={{ color: '#9252AA', fontWeight: '500', fontSize: 10 }}>Readiness Required*</span>
                <button onClick={toggleShowAll} style={styles.showAllText}>{showAll ? 'Show Less' : 'Show All'}</button>
            </div>
            <div style={{ flexDirection: 'column' }}>
                {renderPreparationText(preparationTextList)}
            </div>
        </div>
    )} */}
                </div>

            </>
        )
    }

    const RightTabContent = ({ ingredientList, preparationTextList, toggleShowAll, showAll, renderPreparationText }) => {
        return (
            <div style={{ overflowY: 'auto', height: '100%', borderRadius: "4px 13px 13px 13px" }}>
                <div style={{ padding: "0px 20px 20px 20px", flexDirection: 'column', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)', backgroundColor: 'white', borderBottomRightRadius: '15px', borderBottomLeftRadius: '15px', display: 'flex', border: "1px solid #efefef" }}>
                    <div style={{ flexDirection: 'column', display: 'flex' }}>
                        <span style={{ color: '#000000', fontSize: '13px', fontWeight: '600', marginTop: '20px' }}>Required Ingredient</span>
                        <span style={{ color: '#969696', fontSize: '11px', fontWeight: '500', marginTop: '6px' }}>(Keep these ingredient ready at your location)</span>
                    </div>

                    <div style={{ flexDirection: 'row', marginTop: '15px', display: 'flex' }}>
                        <ListGroup style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center" }}>
                            {ingredientList.map(item => (
                                <RenderIngredients key={item.id} item={item} />
                            ))}
                        </ListGroup>
                    </div>

                    {/* {preparationTextList?.length > 0 && (
                    <div style={{ flexDirection: 'column', backgroundColor: '#F9E9FF', borderRadius: '15px', padding: '10px', display: 'flex' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#9252AA', fontWeight: '500', fontSize: '10px' }}>Readiness Required*</span>
                            <button onClick={toggleShowAll} style={{ background: 'none', border: 'none', color: '#9252AA', cursor: 'pointer', padding: 0 }}>
                                {showAll ? 'Show Less' : 'Show All'}
                            </button>
                        </div>
                        <div style={{ flexDirection: 'column', display: 'flex' }}>
                            {renderPreparationText(preparationTextList)}
                        </div>
                    </div>
                )} */}
                </div>
            </div>
        );
    };


    const renderTabContent = () => {
        if (activeTab === 'left') {
            const totalBurnerCount = getTotalBurnerCount();
            const totalSpecialAppliancesList = getTotalSpecialAppliances();
            return (
                <LeftTabContent
                    burnerCount={totalBurnerCount}
                    ApplianceList={totalSpecialAppliancesList}
                />
            );
        } else if (activeTab === 'right') {
            let totalIngredientsList = getTotalIngredients();
            return <RightTabContent ingredientList={totalIngredientsList} />;
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 800);
        };
        handleResize(); // Check initial size
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ width: "90%", margin: "0 auto", backgroundColor: "#EDEDED", marginBottom: "10px" }} className='selectdatesecouter'>
            <div style={{ flexDirection: 'row', backgroundColor: '#EFF0F3', boxShadow: "0px 0px 6px 0px rgba(0, 0, 0, 0.23)", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px 0" }}>
                <Image style={{ width: "20px", marginRight: "10px", height: "20px" }} src={info} />
                <p style={{ color: '#676767', fontSize: "94%", fontWeight: '400', margin: "0" }} className='billheading'>Bill value depends upon Dish selected + Number of people</p>
            </div>

            <Container>
                <Step active={true.toString()}>
                    {isMobile ? <Image src={SelectDishes} alt="Select Dishes" width={32} height={32} /> : <Image src={SelectDishes} alt="Select Dishes" width={48} height={48} />}
                    <Label active={true.toString()}>Select Dishes</Label>
                </Step>
                <Line active={true.toString()} />
                <Step>
                    {isMobile ? <Image src={SelectDateTime} alt="Select Date & Time" width={32} height={32} /> : <Image src={SelectDateTime} alt="Select Date & Time" width={48} height={48} />}
                    <Label active={true.toString()}>Select Date & Time</Label>
                </Step>
                <Line />
                <Step>
                    {isMobile ? <Image src={SelectConfirmOrder} alt="Confirm Order" width={32} height={32} /> : <Image src={SelectConfirmOrder} alt="Confirm Order" width={48} height={48} />}
                    <Label>Select Confirm Order</Label>
                </Step>
            </Container>

            <div style={{
                width: "90%", margin: "0 auto", backgroudColor: "rgb(237, 237, 237)",
                display: "flex", flexDirection: "column", backgroundColor: "#edededc9"
            }} className='selectdateContainersec'>
                <div style={{ width: "98%", margin: "10px", padding: "10px 30px" }} className='selectdateContainer'>
                    <div style={{ backgroundColor: "#fff", borderRadius: "10px", padding: "10px 10px 20px 15px" }} className='peoplecontsec'>
                        {/* <div style={{ display: "flex", padding: 7, flexDirection: 'row', borderRadius: 5, marginTop: 5, marginBottom: 10, backgroundColor: 'rgba(211, 75, 233, 0.10)', justifyContent: 'flex-start', alignItems: 'top' }}>
                            <div style={{ color: "#9252AA", fontWeight: '500', fontSize: 11 }}>Note: Additional charge of 700 applies for more than 7 dishes.</div>
                        </div> */}
                        <div className="header-section">
                            <div className="heading">How many people you are hosting?</div>
                            <div className="control-buttons">
                                <button onClick={decreasePeopleCount} className="control-button">
                                    <Image src={minusIcon} alt="minus icon" />
                                </button>
                                <div className="count-text mx-2">{peopleCount}</div>
                                <button onClick={increasePeopleCount} className="control-button">
                                    <Image src={plusIcon} alt="plus icon" />
                                </button>
                            </div>
                        </div>
                        {/* <div className="range-container">
                            <div className="range-wrapper">
                                <input
                                    type="range"
                                    min={minPeopleCount}
                                    max={maxPeopleCount}
                                    step={step}
                                    value={peopleCount}
                                    id="customRange3"
                                    onChange={handleRangeChange}
                                    className="range-input"
                                    style={{
                                        // CSS styles inline for the range input
                                        '--range-color': 'rgb(146, 82, 170)',  // Custom color variable
                                        '--range-track-height': '6px',         // Custom track height
                                        '--range-thumb-size': '14px',         // Custom thumb (handle) size
                                        '--range-thumb-transform': 'translateY(-30%)'  // Vertically center the thumb
                                    }}
                                />
                                <div>
                                    <div className="count-display">{peopleCount}</div>
                                </div>
                            </div>
                        </div> */}
                        {/* New range Container */}
                         {/* <div className="range-container aarti">
                            <div className="range-wrapper">
                                <input
                                    type="range"
                                    min={minPeopleCount}
                                    max={maxPeopleCount}
                                    step={step}
                                    value={peopleCount}
                                    id="customRange3"
                                    onChange={handleRangeChange}
                                    className="range-input"
                                    style={{
                                        // CSS styles inline for the range input
                                        '--range-color': 'rgb(146, 82, 170)',  // Custom color variable
                                        '--range-track-height': '6px',         // Custom track height
                                        '--range-thumb-size': '14px',         // Custom thumb (handle) size
                                        '--range-thumb-transform': 'translateY(-30%)'  // Vertically center the thumb
                                    }}
                                />
                                <div>
                                    <div className="count-display">{peopleCount}</div>
                                </div>
                            </div>
                        </div> */}
                        <div className='personsectionprice'>
                            <Image src={info} className="info-icon" alt="info icon" />
                            <p className="info-text">₹ 49/person would be added to bill value in addition to dish price</p>
                        </div>
                    </div>
                    <div>
                        <div style={{
                            flex: 1, marginTop: 16,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: "0 10px",
                        }}>
                            <p style={{ flexDirection: 'row', alignItems: 'center', marginBottom: "2px" }} className='req-sec'>
                                <span style={{ color: '#000', fontSize: "100%", fontWeight: '800' }}>Required </span>
                                <span style={{ color: '#9252AA', fontSize: "100%", fontWeight: '800' }}>Procurement </span>
                                <span style={{ color: '#000', fontSize: "100%", fontWeight: '800' }}>?</span>
                            </p>
                        </div>
                        <div style={{ flexDirection: 'row', marginTop: 4, padding: "0 10px", justifyContent: 'center' }}>
                            <p style={{ color: '#707070', fontSize: "100%", fontWeight: '400' }} className='req-des'>Keep these Appliances and Ingredients ready before chef Arrival</p>
                        </div>
                    </div>
                    <div style={{ flexDirection: 'row', marginTop: 20, marginHorizontal: 16 }}>
                        <button
                            style={{
                                backgroundColor: activeTab === 'left' ? "white" : '#D9D9D9',
                                borderTopRightRadius: 10,
                                borderTopLeftRadius: 15,
                                padding: "5px 60px",
                            }}
                            onClick={() => setActiveTab('left')}
                            className='tabButton'
                        >
                            <p style={activeTab === 'left' ? styles.activeTab : styles.inactiveTab}>Appliances</p>
                        </button>
                        <button
                            style={{
                                backgroundColor: activeTab === 'right' ? "white" : '#D9D9D9',
                                borderTopRightRadius: 10,
                                borderTopLeftRadius: 15,
                                padding: "5px 60px",

                            }}
                            onClick={() => setActiveTab('right')}
                            className='tabButton'
                        >
                            <p style={activeTab === 'right' ? styles.activeTab : styles.inactiveTab}>Ingredient</p>
                        </button>
                        {renderTabContent()}
                    </div>
                </div>
            </div>
            <Row>
                <Col>
                    <div style={{
                        position: "fixed",
                        bottom: 0,
                        width: "100%",
                        backgroundColor: "#EDEDED",
                        borderTop: "1px solid #efefef",
                        padding: "15px 0",
                        left: "0",
                    }}>
                        <Button
                            onClick={onContinueClick}
                            style={{
                                width: "50%",
                                backgroundColor: isDishSelected ? '#9252AA' : '#F9E9FF',
                                borderColor: isDishSelected ? '#9252AA' : '#F9E9FF',
                            }}
                            disabled={!isDishSelected}
                            className='continuebtnchef'
                        >
                            <div
                                style={{
                                    className: "continueButtonLeftText",
                                    color: isDishSelected ? 'white' : '#343333',
                                }}
                            >
                                Continue
                            </div>
                            <div
                                style={{
                                    className: "continueButtonRightText",
                                    color: isDishSelected ? 'white' : '#343333',
                                }}
                            >   {selectedCount} Items | ₹ {totalAmount}

                                {/* New Price */}
                            </div>
                        </Button>
                    </div>
                </Col>
            </Row>
            {isWarningVisibleForTotalAmount && (<Popup popupMessage={popupMessage} onClose={handleWarningClose} />)}
            {/* <div>
                <ReadinessListt />
            </div>
            <div>
                <CookingTimeIndicator time={3.5} />
            </div> */}
        </div>
    )
}

const styles = {
    activeTab: {
        fontWeight: '500',
        color: '#823D9D',
        fontSize: 13,
        padding: "0px",
        margin: "0px",
    },
    inactiveTab: {
        color: '#969696',
        fontSize: 13,
        fontWeight: '500',
        padding: "0px",
        margin: "0px",
    },
    burner: {
        width: "56px",
        height: "56px",
        margin: "10px 0 0"
    }
}

export default SelectDate;