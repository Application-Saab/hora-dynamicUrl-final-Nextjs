import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Step, Label, Divider } from 'semantic-ui-react'; // Replace with actual library
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { BASE_URL, GET_CUISINE_ENDPOINT, API_SUCCESS_CODE, GET_MEAL_DISH_ENDPOINT } from '../../../utils/apiconstants';
// import { useNavigate } from 'react-router-dom';
import RectanglePurple from '../../../assets/Rectanglepurple.png';
import RectangleWhite from '../../../assets/rectanglewhite.png';
import MinusIcon from '../../../assets/minus.png';
import PlusIcon from '../../../assets/plus.png';
// import { useParams } from "react-router-dom";
import warningImage from "../../../assets/Group.png";
import Popup from '../../../utils/popup';
import SkeletonLoader from "../../../utils/chefSkeleton";
import SelectDishes from "../../../assets/selectDish.png";
import SelectDateTime from "../../../assets/event.png";
import SelectConfirmOrder from "../../../assets/confirm_order.png";
import separator from "../../../assets/separator.png";
import InfoIcon from '../../../assets/info.png';
import { useRouter } from 'next/router';
import Image from 'next/image';
import '../../../css/chefOrder.css';

const FoodDeliveryCreateOrder = (currentStep) => {
  const viewBottomSheetRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const router = useRouter();
  console.log(router)
  const { selectedfoodCategory } = router.query;
  const [selectedOption, setSelectedOption] = useState('');
  // const selectedOption = router.asPath.split('/').pop();
  const [orderType, setOrderType] = useState(2);
  const [isDishSelected, setIsDishSelected] = useState(false);
  const [selected, setSelected] = useState('veg');
  const [cuisines, setCuisines] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [mealList, setMealList] = useState([]);
  const [isSelectedDish, setIsSelectedDish] = useState(false);
  const [dishDetail, setDishDetail] = useState(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
    image: "",
    title: "",
    body: "",
    button: "",
  });

  useEffect(() => {
    if (selectedfoodCategory) {
      setSelectedOption(selectedfoodCategory);
    }
  }, [selectedfoodCategory]);

  // const navigate = useNavigate();

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
          type: 'cuisine',
        };
        const response = await axios.post(url, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status == API_SUCCESS_CODE) {
          const names = response.data.data.configuration.map(({ _id, name }) => [
            _id,
            name,
          ]);
          setCuisines(names);
        }
      } catch (error) {
        console.log('Error Fetching Data:', error.message);
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
          variant={isSelected ? 'primary' : 'outline-primary'}
          onClick={() => handleCuisinePress(item[0])}
          className='cusinebtn'
        >
          {item[1]}
        </Button>
        {expandedCategories.includes(item[0]) && (
          <ListGroup className="d-flex flex-wrap">
            {cuisines.map((cuisine, index) => (
              <ListGroupItem
                key={index}
                className="flex-grow-1"
                style={{ flexBasis: 'calc(25% - 10px)', margin: '5px' }} // Adjust margin and flexBasis as needed
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
    if (selectedDishes.length >= 15 && !isSelected) {
      setWarningVisibleForDishCount(true);
      setPopupMessage({
        img: warningImage,
        title: "Total Dishes Selected can not be more than 15 Dish.",
        body: "",
        button: "Contact Us",
      });
    } else {
      const updatedSelectedDishes = [...selectedDishes];
      const updatedSelectedDishDictionary = { ...selectedDishDictionary };
      const dishPriceValue = parseInt(dish.cuisineArray[0], 10);
      console.log("dishPriceValue" + dishPriceValue)
      if (!isNaN(dishPriceValue)) { // Check if the parsed value is not NaN
        if (updatedSelectedDishes.includes(dish._id)) {
          const index = updatedSelectedDishes.indexOf(dish._id);
          updatedSelectedDishes.splice(index, 1);
          const updatedPrice = selectedDishPrice - dishPriceValue;
          setSelectedDishPrice(updatedPrice);
        } else {
          updatedSelectedDishes.push(dish._id);
          const updatedPrice = selectedDishPrice + dishPriceValue;
          setSelectedDishPrice(updatedPrice);
        }
      }
      setSelectedDishes(updatedSelectedDishes);
      setSelectedCount(updatedSelectedDishes.length);

      if (updatedSelectedDishDictionary[dish._id]) {
        delete updatedSelectedDishDictionary[dish._id];
      } else {
        updatedSelectedDishDictionary[dish._id] = dish;
      }
      setSelectedDishDictionary(updatedSelectedDishDictionary);
      setIsDishSelected(updatedSelectedDishes.length > 0);
    }
  };

  //handleCuisinePress is used to handle cuisine clicks and called from above function
  const handleCuisinePress = cuisineId => {
    if (selectedCuisines.length < 3 || selectedCuisines.includes(cuisineId)) {
      setSelectedCuisines(prevSelected => {
        if (prevSelected.includes(cuisineId)) {
          return prevSelected.filter(item => item !== cuisineId);
        } else {
          return [...prevSelected, cuisineId];
        }
      });
    } else {
      // Display a popup or handle the case where the user tries to select more than 3 cuisines
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
      console.log(selectedCuisines);
      const requestData = {
        cuisineId: ["65f1b256aaba27208a89865f"],
        is_dish: is_dish,
      };
      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status == API_SUCCESS_CODE) {
        // Assuming response is your API response
        const filteredMealList = response.data.data.map(item => ({
          ...item,
          dish: item.dish
        }));

        setMealList(filteredMealList);

      }
    } catch (error) {
      console.log('Error Fetching Data:', error.message);
    } finally {
      setLoading(false); // Set loading to false when the API request is completed
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
    <div className='w-100'>
      {item.dish.length > 0 ?
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "top", margin: "5px 4px 0px 0px" }}>
            <h1 style={{ color: "#222", fontSize: "110%", marginBottom: "13px" , fontWeight:"700" }} className='cat-Name'>{item.mealObject.name}{"  "}{"(" + item.dish.length + ")"}</h1>
            <Button onClick={() => handleViewAll(item.mealObject._id)} style={{ color: expandedCategories.includes(item.mealObject._id) ? '#000' : '#fff', fontWeight: '400', textDecorationLine: 'none', fontSize: 12 }}
              className={`viewbtn ${expandedCategories.includes(item.mealObject._id)
                ? "clickedviewAll"
                : ""
                }`}>View All</Button>
          </div>
          <div className="dish-item">
            {expandedCategories.includes(item.mealObject._id) ? (
              item.dish.map((dish, index) => {
                const dishImage = dish.image ? `https://horaservices.com/api/uploads/${dish.image}` : '';
                const specialApplianceImage = dish.special_appliance_id.length > 0 && dish.special_appliance_id[0].image
                  ? `https://horaservices.com/api/uploads/${dish.special_appliance_id[0].image}`
                  : '';
                const selectedImage = selectedDishes.includes(dish._id) ? dishImage : dishImage;

                return (
                  <div key={index} className={`dish-item-inner ${dish.is_dish === 1 ? 'veg-border' : 'non-veg-border'}`}
                    style={{
                      backgroundImage: `url(${selectedDishes.includes(dish._id)
                        ? RectanglePurple.src
                        : RectangleWhite.src
                        })`
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
                      <div className={`dish-placeholder ${selectedDishes.includes(dish._id) ? 'selected' : ''}`}>Image not available</div>
                    )}
                    <p className={`dish-name ${selectedDishes.includes(dish._id) ? 'selected' : ''}`}>
                      {isDishSelected && dish.special_appliance_id.length > 0 && selectedDishes.includes(dish._id)
                        ? dish.special_appliance_id[0].name
                        : dish.name}
                    </p>
                    <div className="d-flex justify-content-between w-100 px-3">
                      <span className={`dish-price ${selectedDishes.includes(dish._id) ? 'selected' : ''}`}>
                        ₹ {dish.cuisineArray[0]}
                      </span>
                      <Button className="pluBtn" onClick={() => handleIncreaseQuantity(dish, selectedDishes.includes(dish._id))}>
                        <Image
                          src={
                            selectedDishes.includes(dish._id) ? MinusIcon : PlusIcon
                          }
                          width={21}
                          height={21}
                        />
                      </Button>
                    </div>
                    <div className={`dish-indicator ${dish.is_dish === 1 ? 'veg' : 'non-veg'}`}></div>
                  </div>
                );
              })) :
              (item.dish.slice(0, 7).map((dish, index) => {
                const dishImage = dish.image ? `https://horaservices.com/api/uploads/${dish.image}` : '';
                const specialApplianceImage = dish.special_appliance_id.length > 0 && dish.special_appliance_id[0].image
                  ? `https://horaservices.com/api/uploads/${dish.special_appliance_id[0].image}`
                  : '';
                const selectedImage = selectedDishes.includes(dish._id) ? dishImage : dishImage;

                return (
                  <div key={index} className={`dish-item-inner ${dish.is_dish === 1 ? 'veg-border' : 'non-veg-border'}`}

                    style={{
                      backgroundImage: `url(${selectedDishes.includes(dish._id)
                        ? RectanglePurple.src
                        : RectangleWhite.src
                        })`
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
                      <div className={`dish-placeholder ${selectedDishes.includes(dish._id) ? 'selected' : ''}`}>Image not available</div>
                    )}
                    <p className={`dish-name ${selectedDishes.includes(dish._id) ? 'selected' : ''}`}>
                      {isDishSelected && dish.special_appliance_id.length > 0 && selectedDishes.includes(dish._id)
                        ? dish.special_appliance_id[0].name
                        : dish.name}
                    </p>
                    <div className="d-flex justify-content-between w-100 px-3">
                      <span className={`dish-price ${selectedDishes.includes(dish._id) ? 'selected' : ''}`}>
                        ₹ {dish.cuisineArray[0]}
                      </span>
                      <Button className="pluBtn" onClick={() => handleIncreaseQuantity(dish, selectedDishes.includes(dish._id))}>
                        <Image
                          src={
                            selectedDishes.includes(dish._id) ? MinusIcon : PlusIcon
                          }
                          width={21}
                          height={21}
                        />
                      </Button>
                    </div>
                    <div className={`dish-indicator ${dish.is_dish === 1 ? 'veg' : 'non-veg'}`}></div>
                  </div>
                );
              }))
            }
          </div>
          <div className='chef-divider' style={{ marginTop: "20px" }}></div>
        </>
        : null
      }
    </div>
  );
console.log('selectedOption',selectedOption)
  const addDish = selectedDishPrice => {
    if (!selectedDishDictionary || Object.keys(selectedDishDictionary).length === 0) {
      console.error("selectedDishDictionary is undefined or empty");
      return; // Exit the function early if the dictionary is undefined or empty
  }
    const selectedDishQuantities = Object.values(selectedDishDictionary).map(item => {
      return {
        name: item.name,
        image: item.image,
        price: item.cuisineArray[0],
        quantity: item.cuisineArray[1],
        unit: item.cuisineArray[2],
        id: item.mealId
      };
    });
    // router.push(`/party-food-delivery-live-catering-buffet-select-date/${selectedOption}`, { state: { selectedDishDictionary, selectedDishPrice, selectedDishes, orderType , isDishSelected , selectedCount , selectedDishQuantities  , selectedOption} });
    router.push({
      pathname: `/party-food-delivery-live-catering-buffet-select-date/${selectedOption}`,
      query: {
        selectedDishDictionary: JSON.stringify(selectedDishDictionary),
        selectedDishPrice,
        selectedDishes,
        orderType,
        isDishSelected,
        selectedCount,
        selectedDishQuantities: JSON.stringify(selectedDishQuantities),
        selectedOption
      },
    });
  };

  const closeBottomSheet = () => {
    setDishDetail(null);
    bottomSheetRef.current.close();
  };

  const addDishAndCloseBottomSheet = () => {
    closeBottomSheet();
  };

  const RenderBottomSheetContent = () => (
    <div className="bottom-sheet-content">
      <Image
        src={`https://horaservices.com/api/uploads/${dishDetail.image}`}
        alt={dishDetail.name}
        className="bottom-sheet-image"
        width={300}
        height={300}
      />
      <h5 className="bottom-sheet-title">{dishDetail.name}</h5>
      <hr />
      <p className="bottom-sheet-description">{dishDetail.description}</p>
      <div className="bottom-sheet-info">
        <div className="info-item">
          <strong>Per Plate Qty:</strong> {dishDetail.per_plate_qty.qty ? `${dishDetail.per_plate_qty.qty} ${dishDetail.per_plate_qty.unit}` : 'NA'}
        </div>
        <div className="info-item">
          <strong>Price Per Plate:</strong> {dishDetail.dish_rate ? `₹ ${dishDetail.dish_rate}` : 'NA'}
        </div>
        <div className="info-item">
          <strong>Price:</strong> {dishDetail.price ? `₹ ${dishDetail.price}` : 'NA'}
        </div>
      </div>
      <Button variant="primary" onClick={addDishAndCloseBottomSheet}>
        Add Dish
      </Button>
    </div>
  );

  const openBottomSheet = (dish, ref) => {
    setDishDetail(dish);
    ref.current.open();
  };

  const closeViewAllSheet = () => {
    setIsViewAllSheetOpen(false);
  };

  const openViewAllSheet = (dish, ref) => {
    setDishDetail(dish);
    setIsViewAllSheetOpen(true);
  };

  const handleSwitchChange = value => {
    setSelected(value);
    if (value === 'veg') {
      setIsVegSelected(true);
      setIsNonVegSelected(false);
    } else {
      setIsVegSelected(false);
      setIsNonVegSelected(true);
    }
  };

  const handleViewAll = categoryId => {

    setIsViewAllExpanded(!isViewAllExpanded);

    setExpandedCategories(prevExpanded =>
      categoryId === prevExpanded[0]
        ? prevExpanded.length === 1 ? [] : prevExpanded.slice(1) // If the first category is clicked, toggle its expansion state only if it's not the only expanded category
        : prevExpanded.includes(categoryId)
          ? prevExpanded.filter(id => id !== categoryId)
          : [...prevExpanded, categoryId],
    );
  };

  if (loading) {
    return <SkeletonLoader loading={true} />;
  }

  return (
    <div className="chef-create-order">
      <div className="order-container chef">
        <div style={{ flexDirection: 'row', backgroundColor: '#EFF0F3', boxShadow: "0px 0px 6px 0px rgba(0, 0, 0, 0.08)", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px 0" }}>
          <Image style={{ width: "20px", height: '20px', marginRight: "5px" }} src={InfoIcon} />
          <p style={{ color: '#676767', fontSize: "94%", fontWeight: '400', margin: "0" }} className='billheading'>111Bill value depends upon Dish selected + Number of people</p>
        </div>
        <div className="range-bar">
          <Step active={true.toString()} className="step1">
            <Image src={SelectDishes} alt="Select Dishes" style={styles.dish} />
            <Label active={true.toString()}>Select Dishes</Label>
          </Step>
          <div className="sep-image">
            <Image src={separator} />
          </div>
          <Step className="step2">
            <Image src={SelectDateTime} alt="Select Date & Time" style={styles.dish} />
            <Label>Select Date & Time</Label>
          </Step>
          <div className="sep-image">
            <Image src={separator} />
          </div>
          <Step className="step3">
            <Image src={SelectConfirmOrder} alt="Confirm Order" style={styles.dish} />
            <Label>Select Confirm Order</Label>
          </Step>
        </div>
      </div>
      <div className="order-container chef-bottum">
        <Row className="d-flex justify-content-start">
          <div style={{ display: "flex", margin: "10px 0 0" }}>
            <div style={{ marginRight: "10px" }}>
              <Button
                variant={
                  selected === "veg" ? "success" : "outline-success"
                }
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
          <div
            className="chef-divider"
            style={{ marginTop: "13px" }}
          ></div>
        </Row>

        <Row className="mt-1">
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
        </Row>

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
      <Modal show={isViewAllSheetOpen} onHide={closeViewAllSheet}>
        <Modal.Header closeButton>
          <Modal.Title>View All</Modal.Title>
        </Modal.Header>
        <Modal.Body>{dishDetail && <RenderBottomSheetContent />}</Modal.Body>
      </Modal>
      {(isWarningVisibleForCuisineCount || isWarningVisibleForDishCount) && (
        <Popup popupMessage={popupMessage} onClose={handleWarningClose} />
      )}
    </div>
  );
};

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

export default FoodDeliveryCreateOrder;
