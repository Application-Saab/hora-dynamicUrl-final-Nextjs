import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import axios from "axios";
import { Step, Label } from 'semantic-ui-react'; // Replace with actual library
import { ListGroup, ListGroupItem } from "react-bootstrap";
import {  Button,  Row, Col,  } from "react-bootstrap";
import {
    BASE_URL,
    GET_CUISINE_ENDPOINT,
    API_SUCCESS_CODE,
    GET_MEAL_DISH_ENDPOINT,
} from "../../utils/apiconstants";
import RectanglePurple from "../../assets/Rectanglepurple.png";
import RectangleWhite from "../../assets/rectanglewhite.png";
import MinusIcon from "../../assets/minus.png";
import PlusIcon from "../../assets/plus.png";
import warningImage from "../../assets/Group.png";
import SkeletonLoader from "../../component/Placeholder/chefSkeleton";
import '../../css/Toggle.css';
import '../../css/chefOrder.css';
import SelectDishes from "../../assets/selectDish.png";
import SelectDateTime from "../../assets/event.png";
import SelectConfirmOrder from "../../assets/confirm_order.png";
import separator from "../../assets/separator.png";
import InfoIcon from '../../assets/info.png';
import Image from "next/image";
import { useRouter } from "next/router";
import Popup from '../../utils/popup';

const BookCheifForParty = ({ history, currentStep }) => {
    const [isMobile, setIsMobile] = useState(false);
    const bottomSheetRef = useRef(null);
    const [orderType, setOrderType] = useState(2);
    const [isDishSelected, setIsDishSelected] = useState(false);
    const [selected, setSelected] = useState("veg");
    const [cuisines, setCuisines] = useState([]);
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [mealList, setMealList] = useState([]);
    const [dishDetail, setDishDetail] = useState(null);
    const [selectedCount, setSelectedCount] = useState(0);
    const [selectedDishes, setSelectedDishes] = useState([]);
    const [isViewAllSheetOpen, setIsViewAllSheetOpen] = useState(false);
    const [selectedDishPrice, setSelectedDishPrice] = useState(0);
    const [selectedDishDictionary, setSelectedDishDictionary] = useState({});
    const [isNonVegSelected, setIsNonVegSelected] = useState(false);
    const [isVegSelected, setIsVegSelected] = useState(true);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isWarningVisibleForTotalAmount, setWarningVisibleForTotalAmount] = useState(false);
    const [isWarningVisibleForDishCount, setWarningVisibleForDishCount] = useState(false);
    const [isWarningVisibleForCuisineCount, setWarningVisibleForCuisineCount] = useState(false);
    const [isViewAllExpanded, setIsViewAllExpanded] = useState(false);
    const [popupMessage, setPopupMessage] = useState({
        img: "",
        title: "",
        body: "",
        button: "",
    });
    // Handler for 'Only Veg' toggle switch
    const handleVegSwitch = () => {
        if (isNonVegSelected) return; // Prevent switching if 'Non-Veg' is selected
        setIsVegSelected(prev => !prev); // Toggle 'Only Veg' state
    };


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        // Initial setting
        if (typeof window !== "undefined") {
            setIsMobile(window.innerWidth <= 768);
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);
    const maxItems = isMobile ? 3 : 7;


    const router = useRouter();

    const handleWarningClose = () => {
        setWarningVisibleForDishCount(false);
        setWarningVisibleForCuisineCount(false);
        setWarningVisibleForTotalAmount(false);
    };

    // get category of cuisines
    useEffect(() => {
        const fetchCuisineData = async () => {
            try {
                const url = BASE_URL + GET_CUISINE_ENDPOINT;
                const requestData = {
                    type: "cuisine",
                };
                const response = await axios.post(url, requestData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === API_SUCCESS_CODE) {
                    const names = response.data.data.configuration.map(
                        ({ _id, name }) => [_id, name]
                    );
                    setCuisines(names);
                }
            } catch (error) {
                console.log("Error Fetching Data:", error.message);
            }
        };
        fetchCuisineData();
    }, []);

    useEffect(() => {
        if (cuisines.length > 0 && selectedCuisines.length === 0) {
            handleCuisinePress(cuisines[0][0]);
        }
    }, [cuisines, selectedCuisines]);

    const renderItem = ({ item }) => {
        const isSelected = selectedCuisines.includes(item[0]);

        return (
            <div className="d-flex align-items-center justify-content-between mb-2">
                <Button
                    variant={isSelected ? "primary" : "outline-primary"}
                    onClick={() => handleCuisinePress(item[0])}
                    className="cusinebtn"
                >
                    {item[1]}
                </Button>
                {expandedCategories.includes(item[0]) && (
                    <ListGroup className="d-flex flex-wrap">
                        {cuisines.map((cuisine, index) => (
                            <ListGroupItem
                                key={index}
                                className="flex-grow-1"
                                style={{ flexBasis: "calc(25% - 10px)", margin: "5px" }} // Adjust margin and flexBasis as needed
                            >
                                {renderItem({ item: cuisine })}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                )}
            </div>
        );
    };

    const handleIncreaseQuantity = (dish, isSelected) => {
        if (selectedDishes.length >= 0 && !isSelected) {
            //setIsButtonVisible(true);
        }
        if (selectedDishes.length > 11 && !isSelected) {
            setWarningVisibleForDishCount(true);
            setPopupMessage({
                img: warningImage,
                title: "Total Dishes Selected can not be more than 12 Dish.",
                body: "Total dish selected can not be more than 12 dish, for more help contact us.",
                button: "Contact Us",
            });
        } else {
            const updatedSelectedDishes = [...selectedDishes];
            const updatedSelectedDishDictionary = { ...selectedDishDictionary };
            if (updatedSelectedDishes.includes(dish._id)) {
                const index = updatedSelectedDishes.indexOf(dish._id);
                updatedSelectedDishes.splice(index, 1);
            } else {
                updatedSelectedDishes.push(dish._id);
            }
            setSelectedDishes(updatedSelectedDishes);
            setSelectedCount(updatedSelectedDishes.length);
            if (isSelected) {
                const updatedPrice = selectedDishPrice - parseInt(dish.dish_rate, 10);
                setSelectedDishPrice(updatedPrice);
            } else {
                const updatedPrice = selectedDishPrice + parseInt(dish.dish_rate, 10);
                setSelectedDishPrice(updatedPrice);
            }
            if (updatedSelectedDishDictionary[dish._id]) {
                delete updatedSelectedDishDictionary[dish._id];
            } else {
                updatedSelectedDishDictionary[dish._id] = dish;
            }
            setSelectedDishDictionary(updatedSelectedDishDictionary);
            setIsDishSelected(updatedSelectedDishes.length > 0);
        }
    };

    const handleCuisinePress = (cuisineId) => {
        if (selectedCuisines.length < 3 || selectedCuisines.includes(cuisineId)) {
            setSelectedCuisines((prevSelected) => {
                if (prevSelected.includes(cuisineId)) {
                    return prevSelected.filter((item) => item !== cuisineId);
                } else {
                    return [...prevSelected, cuisineId];
                }
            });
        } else {
            setWarningVisibleForCuisineCount(true);
            setPopupMessage({
                img: warningImage,
                title: "One chef is only expert in 3 cuisine only.",
                body: "Our chef is expert in cuisines only please select appropriate number of cuisines to continue",
                button: "Continue",
            });
        }
    };

    const fetchMealBasedOnCuisine = async () => {
        try {
            setLoading(true);
            const url = BASE_URL + GET_MEAL_DISH_ENDPOINT;
            const is_dish = isNonVegSelected ? 0 : 1;
            const requestData = {
                cuisineId: selectedCuisines,
                is_dish: is_dish,
            };
            const response = await axios.post(url, requestData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === API_SUCCESS_CODE) {
                setMealList(response.data.data);
            }
        } catch (error) {
            console.log("Error Fetching Data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedCuisines.length > 0 && selectedCuisines.length <= 3) {
            fetchMealBasedOnCuisine();
        } else {
            setMealList([]);
            setSelectedDishDictionary({});
            setIsDishSelected(false);
            setSelectedDishes([]);
            setSelectedCount(0);
            setSelectedDishPrice(0);
        }
    }, [selectedCuisines, isNonVegSelected]);

  

    const renderDishItem = ({ item }) => (
        <div className="w-100">
            {item.dish.length > 0 ? (
                <div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "top",
                            margin: "9px 19px 0px 6px",
                        }}
                    >
                        <h1
                            style={{ color: "#000", fontSize: "16px", marginBottom: "0px" }}
                        >
                            {item.mealObject.name}
                            {"  "}
                            {"(" + item.dish.length + ")"}
                        </h1>
                        <Button
                            onClick={() => handleViewAll(item.mealObject._id)}
                            style={{
                                color: expandedCategories.includes(item.mealObject._id)
                                    ? "#000"
                                    : "#fff",
                                fontWeight: "400",
                                textDecorationLine: "none",
                                fontSize: 12,
                            }}
                            className={`viewbtn ${expandedCategories.includes(item.mealObject._id)
                                ? "clickedviewAll"
                                : ""
                                }`}
                        >
                            View All
                        </Button>
                    </div>
                    <div className="dish-item 12">
                        {expandedCategories.includes(item.mealObject._id)
                            ? item.dish.map((dish, index) => {
                                const dishImage = dish.image
                                    ? `https://horaservices.com/api/uploads/${dish.image}`
                                    : "";
                                const specialApplianceImage =
                                    dish.special_appliance_id.length > 0 &&
                                        dish.special_appliance_id[0].image
                                        ? `https://horaservices.com/api/uploads/${dish.special_appliance_id[0].image}`
                                        : "";
                                const selectedImage = selectedDishes.includes(dish._id)
                                    ? dishImage
                                    : dishImage;

                                return (
                                    <div
                                        key={index}
                                        className={`dish-item-inner ${dish.is_dish === 1 ? "veg-border" : "non-veg-border"
                                            }`}
                                        style={{
                                            backgroundImage: `url(${selectedDishes.includes(dish._id)
                                                ? RectanglePurple.src
                                                : RectangleWhite.src
                                                })`,
                                        }}
                                    >
                                        {selectedImage ? (
                                            <div 
                                            className={`dish-image ${selectedDishes.includes(dish._id) ? "selected" : ""}`}
                                            style={{
                                                backgroundImage: `url(${selectedImage})`,
                                                backgroundSize: 'cover, cover', // Ensures both images cover the element
                                                backgroundPosition: 'center, center' // Centers both images
                                            }}
                                            >
                                           
                                            </div>
                                           
                                            
                                        ) : (
                                            <div
                                                className={`dish-placeholder ${selectedDishes.includes(dish._id) ? "selected" : ""
                                                    }`}
                                            >
                                                Image not available
                                            </div>
                                        )}
                                        <p
                                            className={`dish-name ${selectedDishes.includes(dish._id) ? "selected" : ""
                                                }`}
                                        >
                                            {isDishSelected &&
                                                dish.special_appliance_id.length > 0 &&
                                                selectedDishes.includes(dish._id)
                                                ? dish.special_appliance_id[0].name
                                                : dish.name}
                                        </p>
                                        <div className="d-flex justify-content-between w-100 px-3 dishPrice">
                                            <Button
                                                className="pluBtn"
                                                onClick={() =>
                                                    handleIncreaseQuantity(
                                                        dish,
                                                        selectedDishes.includes(dish._id)
                                                    )
                                                }
                                            >                                   
                                                         <Image
                                                    src={
                                                        selectedDishes.includes(dish._id)
                                                            ? MinusIcon
                                                            : PlusIcon
                                                    }
                                                    alt="icon"
                                                    style={{ width: 21, height: 21 }}
                                                /> 
                                            </Button>
                                        </div>
                                        <div
                                            className={`dish-indicator ${dish.is_dish === 1 ? "veg" : "non-veg"
                                                }`}
                                        ></div>
                                    </div>
                                );
                            })
                            : item.dish.slice(0, maxItems).map((dish, index) => {
                                const dishImage = dish.image
                                    ? `https://horaservices.com/api/uploads/${dish.image}`
                                    : "";
                                const specialApplianceImage =
                                    dish.special_appliance_id.length > 0 &&
                                        dish.special_appliance_id[0].image
                                        ? `https://horaservices.com/api/uploads/${dish.special_appliance_id[0].image}`
                                        : "";
                                const selectedImage = selectedDishes.includes(dish._id)
                                    ? dishImage
                                    : dishImage;

                                return (
                                    <div
                                        key={index}
                                        className={`dish-item-inner ${dish.is_dish === 1 ? "veg-border" : "non-veg-border"
                                            }`}
                                        style={{
                                            backgroundImage: `url(${selectedDishes.includes(dish._id)
                                                ? RectanglePurple.src
                                                : RectangleWhite.src
                                                })`,
                                        }}
                                    >
                                        {selectedImage ? (
                                             <div 
                                             className={`dish-image ${selectedDishes.includes(dish._id) ? "selected" : ""}`}
                                             style={{
                                                 backgroundImage: `url(${selectedImage})`,
                                                 backgroundSize: 'cover, cover', // Ensures both images cover the element
                                                 backgroundPosition: 'center, center' // Centers both images
                                             }}
                                             >
                                                </div>
                                        ) : (
                                            <div
                                                className={`dish-placeholder ${selectedDishes.includes(dish._id) ? "selected" : ""
                                                    }`}
                                            >
                                                Image not available
                                            </div>
                                        )}
                                        <p
                                            className={`dish-name ${selectedDishes.includes(dish._id) ? "selected" : ""
                                                }`}
                                        >
                                            {isDishSelected &&
                                                dish.special_appliance_id.length > 0 &&
                                                selectedDishes.includes(dish._id)
                                                ? dish.special_appliance_id[0].name
                                                : dish.name}
                                        </p>
                                        <div className="d-flex justify-content-between w-100 px-3 dishPrice">
                                            <Button
                                                className="pluBtn"
                                                onClick={() =>
                                                    handleIncreaseQuantity(
                                                        dish,
                                                        selectedDishes.includes(dish._id)
                                                    )
                                                }
                                            >
                                                <Image
                                                    src={
                                                        selectedDishes.includes(dish._id)
                                                            ? MinusIcon
                                                            : PlusIcon
                                                    }
                                                    alt="icon"
                                                    style={{ width: 21, height: 21 }}
                                                />
                                            </Button>
                                        </div>
                                        <div
                                            className={`dish-indicator ${dish.is_dish === 1 ? "veg" : "non-veg"
                                                }`}
                                        ></div>
                                    </div>
                                );
                            })}
                    </div>
                    <div className="chef-divider" style={{ marginTop: "20px" }}></div>
                </div>
            ) : null}
        </div>
    );

    const addDish = (selectedDishPrice) => {
        router.push({
            pathname: '/book-chef-cook-for-party/order-details',
            query: {
                orderType,
                selectedDishDictionary: JSON.stringify(selectedDishDictionary),
                selectedDishPrice:Number(selectedDishPrice) + 49,
                selectedDishes:JSON.stringify(selectedDishes),
                isDishSelected,
                selectedCount,
            }
        });
    };
    

    const closeBottomSheet = () => {
        setDishDetail(null);
        bottomSheetRef.current.close();
    };


    const handleSwitchChange = (value) => {
        setSelected(value);
        if (value === "veg") {
            setIsVegSelected(true);
            setIsNonVegSelected(false);
        } else {
            setIsVegSelected(false);
            setIsNonVegSelected(true);
        }
    };

    const handleViewAll = (categoryId) => {
        setIsViewAllExpanded(!isViewAllExpanded);

        setExpandedCategories((prevExpanded) =>
            categoryId === prevExpanded[0]
                ? prevExpanded.length === 1
                    ? []
                    : prevExpanded.slice(1) // If the first category is clicked, toggle its expansion state only if it's not the only expanded category
                : prevExpanded.includes(categoryId)
                    ? prevExpanded.filter((id) => id !== categoryId)
                    : [...prevExpanded, categoryId]
        );
    };

    return (
        <div className="chef-create-order">
            <div className="order-container chef">
                <div style={{ flexDirection: 'row', backgroundColor: '#EFF0F3', boxShadow: "0px 0px 6px 0px rgba(0, 0, 0, 0.23)", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px 0" }}>
                    <Image style={{ width: "20px", height: "20px", marginRight: "10px" }} src={InfoIcon} alt="info" />
                    <p style={{ color: '#676767', fontSize: "94%", fontWeight: '400', margin: "0" }} className='billheading'>Bill value depends upon Dish selected + Number of people</p>
                </div>
                <div className="range-bar">
                    <Step active className="step1">
                        <Image src={SelectDishes} alt="Select Dishes" style={styles.dish} />
                        <Label active>Select Dishes</Label>
                    </Step>
                    <div className="sep-image">
                        <Image src={separator} alt="separator" />
                    </div>
                    <Step className="step2">
                        <Image src={SelectDateTime} alt="Select Date & Time" style={styles.dish} />
                        <Label>Select Date & Time</Label>
                    </Step>
                    <div className="sep-image">
                        <Image src={separator} alt="separator" />
                    </div>
                    <Step className="step3">
                        <Image src={SelectConfirmOrder} alt="Confirm Order" style={styles.dish} />
                        <Label>Select Confirm Order</Label>
                    </Step>
                </div>
            </div>
            <div className="order-container chef-bottum">
                <Row className="d-flex justify-content-start">
                    <div style={{ display: "flex", margin: "5px 0 0" }}>
                        <div style={{ marginRight: "10px" }}>
                            <Button
                                variant={selected === "veg" ? "success" : "outline-success"}
                                onClick={() => handleSwitchChange("veg")}
                                className="cuisinebtn"
                            >
                                Only Veg
                            </Button>
                        </div>
                        <div>
                            <Button
                                variant={
                                    selected === "non-veg" ? "danger" : "outline-danger"
                                }
                                onClick={() => handleSwitchChange("non-veg")}
                                className="cuisinebtn"
                            >
                                Non-Veg
                            </Button>
                        </div>
                    </div>
                    <div className="chef-divider" style={{ marginTop: "10px" }}></div>
                    <div style={{ margin: "10px 0 0 0" }}>
                        <h1
                            style={{
                                fontSize: "14px",
                                color: "#000",
                                marginTop: "0px",
                                marginBottom: "0",
                            }}
                        >
                            Select Cusinies
                        </h1>
                        <ListGroup className="cuisine-list d-flex flex-row flex-wrap justify-content-start">
                            {cuisines.map((cuisine, index) => (
                                <ListGroupItem key={index} className="cuisine-item">
                                    {renderItem({ item: cuisine })}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                </Row>
                <div className="chef-divider"></div>
                {loading?<SkeletonLoader loading={true} />:<Row className="mt-1">
                    <Col>
                        {selectedCuisines.length > 0 && (
                            <ListGroup className="dish-list">
                                {mealList.map((meal) => (
                                    <div className='w-100'>
                                        <ListGroupItem key={meal._id} className="dish-item">
                                            {renderDishItem({ item: meal })}
                                        </ListGroupItem>
                                    </div>
                                ))}
                            </ListGroup>
                        )}
                    </Col>
                </Row>}
                <Row>
                    <Col>
                        <div
                            style={{
                                position: "fixed",
                                bottom: 0,
                                width: "100%",
                                backgroundColor: "#EDEDED",
                                borderTop: "1px solid #efefef",
                                padding: "15px 0",
                                left: "0",
                            }}
                        >
                            <Button
                                onClick={() => addDish(selectedDishPrice)}
                                style={{
                                    width: "50%",
                                    backgroundColor: isDishSelected
                                        ? "#9252AA"
                                        : "#F9E9FF",
                                    borderColor: isDishSelected ? "#9252AA" : "#F9E9FF",
                                }}
                                disabled={!isDishSelected}
                                className="continuebtnchef"
                            >
                                <div
                                    style={{
                                        className: "continueButtonLeftText",
                                        color: isDishSelected ? "white" : "#fff",
                                    }}
                                >
                                    Continue
                                </div>
                                <div
                                    style={{
                                        className: "continueButtonRightText",
                                        color: isDishSelected ? "white" : "#fff",
                                    }}
                                >
                                    {selectedCount} Items
                                </div>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
            {isWarningVisibleForCuisineCount && (<Popup popupMessage={popupMessage} onClose={handleWarningClose} />)}
            {isWarningVisibleForDishCount && (<Popup popupMessage={popupMessage} onClose={handleWarningClose} />)}
        </div>
    )
}

const styles = {
    imageContainer: {
        position: "relative",
        width: "270px",
        backgroundColor: "#fff",
        marginBottom: 40,
        boxShadow: "0 6px 16px 0 rgba(0,0,0,.14)",
        borderRadius: "5px",
        overflow: "hidden",
        transition: "transform 0.3s ease-in-out",
        margin: "10px 12px 20px",
        padding: "6px 5px 10px",
    },
    dish: {
        width: "32px",
        height: "32px",
    },
};

export default BookCheifForParty;
