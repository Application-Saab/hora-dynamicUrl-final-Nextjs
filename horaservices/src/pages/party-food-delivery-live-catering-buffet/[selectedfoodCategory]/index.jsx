import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Step, Label } from 'semantic-ui-react'; // Replace with actual library
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { BASE_URL, GET_CUISINE_ENDPOINT, API_SUCCESS_CODE, GET_MEAL_DISH_ENDPOINT } from '../../../utils/apiconstants';
import RectanglePurple from '../../../assets/Rectanglepurple.png';
import RectangleWhite from '../../../assets/rectanglewhite.png';
import MinusIcon from '../../../assets/minus.png';
import PlusIcon from '../../../assets/plus.png';
import warningImage from "../../../assets/Group.png";
import Popup from '../../../utils/popup';
import SkeletonLoader from "../../../component/Placeholder/chefSkeleton";
import SelectDishes from "../../../assets/selectDish.png";
import SelectDateTime from "../../../assets/event.png";
import SelectConfirmOrder from "../../../assets/confirm_order.png";
import separator from "../../../assets/separator.png";
import InfoIcon from '../../../assets/info.png';
import { useRouter } from 'next/router';
import Image from 'next/image';
import '../../../css/chefOrder.css';

const FoodDeliveryCreateOrder = () => {
  const router = useRouter();
  const { selectedfoodCategory } = router.query; 
  const orderType = 2; // Assuming this is a constant or derived differently
  const [isDishSelected, setIsDishSelected] = useState(false);
  const [selected, setSelected] = useState('veg'); // 'veg' or 'non-veg'
  const [cuisines, setCuisines] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]); // For meal categories
  const [mealList, setMealList] = useState([]);
  const [dishDetail, setDishDetail] = useState(null); // For the modal
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedDishes, setSelectedDishes] = useState([]); // Array of dish IDs
  const [isViewAllSheetOpen, setIsViewAllSheetOpen] = useState(false); // For the modal
  const [selectedDishPrice, setSelectedDishPrice] = useState(0);
  const [selectedDishDictionary, setSelectedDishDictionary] = useState({});
  const [loading, setLoading] = useState(true);
  const [isWarningVisibleForDishCount, setWarningVisibleForDishCount] = useState(false);
  const [isWarningVisibleForCuisineCount, setWarningVisibleForCuisineCount] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    image: "",
    title: "",
    body: "",
    button: "",
  });

  // const isVegSelected = selected === 'veg';
  const isNonVegSelected = selected === 'non-veg';

  const handleWarningClose = () => {
    setWarningVisibleForDishCount(false);
    setWarningVisibleForCuisineCount(false);
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
        if (response.status === API_SUCCESS_CODE) {
          const names = response.data.data.configuration.map(({ _id, name }) => [
            _id,
            name,
          ]);
          setCuisines(names);
        }
      } catch (error) {
        console.error('Error Fetching Cuisine Data:', error.message);
      }
    };
    fetchCuisineData();
  }, []);

  useEffect(() => {
    if (cuisines.length > 0 && selectedCuisines.length === 0) {
      if(cuisines[0] && cuisines[0][0]) {
        handleCuisinePress(cuisines[0][0]);
      }
    }
  }, [cuisines]); 

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
      </div>
    );
  };

  const handleIncreaseQuantity = (dish, isCurrentlySelected) => {
    if (selectedDishes.length >= 15 && !isCurrentlySelected) {
      setWarningVisibleForDishCount(true);
      setPopupMessage({
        img: warningImage,
        title: "Total Dishes Selected can not be more than 15 Dish.",
        body: "",
        button: "Contact Us", // This button text might need a different handler if it's not just closing the popup
      });
    } else {
      const updatedSelectedDishes = [...selectedDishes];
      const updatedSelectedDishDictionary = { ...selectedDishDictionary };
      const dishPriceValue = parseInt(dish.cuisineArray[0], 10);

      if (!isNaN(dishPriceValue)) {
        if (updatedSelectedDishes.includes(dish._id)) {
          const index = updatedSelectedDishes.indexOf(dish._id);
          updatedSelectedDishes.splice(index, 1);
          setSelectedDishPrice(prevPrice => prevPrice - dishPriceValue);
          delete updatedSelectedDishDictionary[dish._id];
        } else {
          updatedSelectedDishes.push(dish._id);
          setSelectedDishPrice(prevPrice => prevPrice + dishPriceValue);
          updatedSelectedDishDictionary[dish._id] = dish;
        }
      }
      setSelectedDishes(updatedSelectedDishes);
      setSelectedCount(updatedSelectedDishes.length);
      setSelectedDishDictionary(updatedSelectedDishDictionary);
      setIsDishSelected(updatedSelectedDishes.length > 0);
    }
  };

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
      setWarningVisibleForCuisineCount(true);
      setPopupMessage({
        img: warningImage,
        title: "One chef is only expert in 3 cuisines.", // Simplified title
        body: "Please select a maximum of 3 cuisines to continue.", // Simplified body
        button: "Continue",
      });
    }
  };

  const fetchMealBasedOnCuisine = async () => {
    if (selectedCuisines.length === 0) {
      setMealList([]);
      setSelectedDishDictionary({});
      setIsDishSelected(false);
      setSelectedDishes([]);
      setSelectedCount(0);
      setSelectedDishPrice(0);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const url = BASE_URL + GET_MEAL_DISH_ENDPOINT;
      const is_dish_type = isNonVegSelected ? 0 : 1; // 0 for non-veg, 1 for veg
      const requestData = {
        cuisineId: selectedCuisines, // Use the selected cuisines state
        is_dish: is_dish_type,
      };
      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === API_SUCCESS_CODE) {
        const filteredMealList = response.data.data.map(item => ({
          ...item,
          dish: item.dish
        }));
        setMealList(filteredMealList);
      } else {
        setMealList([]); // Clear meal list on API error or non-success status
      }
    } catch (error) {
      console.error('Error Fetching Meal Data:', error.message);
      setMealList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch meals when selectedCuisines or the veg/non-veg filter changes
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
  }, [selectedCuisines, isNonVegSelected]); // isNonVegSelected will trigger this if 'selected' state changes

  const renderDishItem = ({ item }) => {
    const dishesToRender = expandedCategories.includes(item.mealObject._id)
      ? item.dish
      : item.dish.slice(0, 7);

    return (
      <div className='w-100'>
        {item.dish.length > 0 ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "5px 4px 0px 0px" }}> {/* Changed alignItems to center */} 
              <h1 style={{ color: "#222", fontSize: "110%", marginBottom: "13px", fontWeight: "700" }} className='cat-Name'>
                {item.mealObject.name}{"  "}({item.dish.length})
              </h1>
              {item.dish.length > 7 && ( // Only show View All if there are more than 7 dishes
                <Button 
                  onClick={() => handleViewAll(item.mealObject._id)} 
                  style={{ 
                    color: expandedCategories.includes(item.mealObject._id) ? '#000' : '#fff', 
                    fontWeight: '400', 
                    textDecorationLine: 'none', 
                    fontSize: 12 
                  }}
                  className={`viewbtn ${expandedCategories.includes(item.mealObject._id) ? "clickedviewAll" : ""}`}
                >
                  {expandedCategories.includes(item.mealObject._id) ? 'View Less' : 'View All'}
                </Button>
              )}
            </div>
            <div className="dish-item">
              {dishesToRender.map((dish, index) => {
                const dishImage = dish.image ? `https://horaservices.com/api/uploads/${dish.image}` : '';
                // const specialApplianceImage = dish.special_appliance_id.length > 0 && dish.special_appliance_id[0].image
                //   ? `https://horaservices.com/api/uploads/${dish.special_appliance_id[0].image}`
                //   : ''; // This seems unused in the rendering logic below
                const isDishCurrentlySelected = selectedDishes.includes(dish._id);

                return (
                  <div 
                    key={index} 
                    className={`dish-item-inner ${dish.is_dish === 1 ? 'veg-border' : 'non-veg-border'}`}
                    style={{
                      backgroundImage: `url(${isDishCurrentlySelected ? RectanglePurple.src : RectangleWhite.src})`
                    }}
                  >
                    {dishImage ? (
                      <div 
                        className={`dish-image ${isDishCurrentlySelected ? "selected" : ""}`}
                        style={{
                            backgroundImage: `url(${dishImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                      />
                    ) : (
                      <div className={`dish-placeholder ${isDishCurrentlySelected ? 'selected' : ''}`}>Image not available</div>
                    )}
                    <p className={`dish-name ${isDishCurrentlySelected ? 'selected' : ''}`}>
                      {/* The logic for showing special_appliance_id[0].name was complex and might be simplified or re-evaluated based on exact need */}
                      {dish.name}
                    </p>
                    <div className="d-flex justify-content-between w-100 px-3 align-items-center">
                      <span className={`dish-price ${isDishCurrentlySelected ? 'selected' : ''}`}>
                        ₹ {dish.cuisineArray[0]}
                      </span>
                      <Button className="pluBtn" onClick={() => handleIncreaseQuantity(dish, isDishCurrentlySelected)}>
                        <Image
                          src={isDishCurrentlySelected ? MinusIcon : PlusIcon}
                          alt={isDishCurrentlySelected ? "Remove dish" : "Add dish"}
                          width={21}
                          height={21}
                        />
                      </Button>
                    </div>
                    <div className={`dish-indicator ${dish.is_dish === 1 ? 'veg' : 'non-veg'}`}></div>
                  </div>
                );
              })}
            </div>
            <div className='chef-divider' style={{ marginTop: "20px" }}></div>
          </>
        ) : null}
      </div>
    );
  };

  const addDish = () => {
    if (!selectedDishDictionary || Object.keys(selectedDishDictionary).length === 0) {
      console.error("selectedDishDictionary is undefined or empty, cannot proceed.");
      // Optionally, show a user-facing error message here
      return;
    }
    const selectedDishQuantities = Object.values(selectedDishDictionary).map(item => ({
      name: item.name,
      image: item.image,
      price: item.cuisineArray[0],
      quantity: item.cuisineArray[1], // Ensure this is the quantity, not a price or other value
      unit: item.cuisineArray[2],
      id: item.mealId // Ensure this is the correct ID for the dish
    }));

    router.push({
      pathname: `/party-food-delivery-live-catering-buffet-select-date/${selectedfoodCategory}`,
      query: {
        selectedDishDictionary: JSON.stringify(selectedDishDictionary),
        selectedDishPrice: selectedDishPrice.toString(), // Ensure all query params are strings
        selectedDishes: JSON.stringify(selectedDishes),
        orderType: orderType.toString(),
        isDishSelected: isDishSelected.toString(),
        selectedCount: selectedCount.toString(),
        selectedDishQuantities: JSON.stringify(selectedDishQuantities),
        selectedOption: selectedfoodCategory // Already a string from router.query
      },
    });
  };

  const addDishAndCloseModal = () => {
    // If adding the dish from modal has specific logic, add here
    // For now, it just closes the modal
    closeViewAllSheet(); 
  };

  const RenderBottomSheetContent = () => {
    if (!dishDetail) return null;
    return (
      <div className="bottom-sheet-content"> {/* Consider renaming class if it's a modal now */}
        <Image
          src={`https://horaservices.com/api/uploads/${dishDetail.image}`}
          alt={dishDetail.name}
          className="bottom-sheet-image"
          width={300} // These might need to be responsive or adjusted
          height={300}
          layout="responsive" // Consider Next/Image optimization props
        />
        <h5 className="bottom-sheet-title">{dishDetail.name}</h5>
        <hr />
        <p className="bottom-sheet-description">{dishDetail.description}</p>
        <div className="bottom-sheet-info">
          <div className="info-item">
            <strong>Per Plate Qty:</strong> {dishDetail.per_plate_qty && dishDetail.per_plate_qty.qty ? `${dishDetail.per_plate_qty.qty} ${dishDetail.per_plate_qty.unit}` : 'NA'}
          </div>
          <div className="info-item">
            <strong>Price Per Plate:</strong> {dishDetail.dish_rate ? `₹ ${dishDetail.dish_rate}` : 'NA'}
          </div>
          {/* This 'Price' might be redundant if 'Price Per Plate' is the primary one */}
          <div className="info-item">
            <strong>Price:</strong> {dishDetail.price ? `₹ ${dishDetail.price}` : 'NA'}
          </div>
        </div>
        <Button variant="primary" onClick={addDishAndCloseModal}>
          {/* Changed from "Add Dish" to "Close" if modal is informational, or clarify action */}
          Close 
        </Button>
      </div>
    );
  };

  const closeViewAllSheet = () => {
    setIsViewAllSheetOpen(false);
    setDishDetail(null); // Clear dishDetail when closing
  };

  const handleSwitchChange = value => {
    setSelected(value);
    // No need to set isVegSelected/isNonVegSelected, they are derived
  };

  const handleViewAll = categoryId => {
    // This toggles the expanded state for a given category ID
    setExpandedCategories(prevExpanded =>
      prevExpanded.includes(categoryId)
        ? prevExpanded.filter(id => id !== categoryId)
        : [...prevExpanded, categoryId]
    );
  };

  return (
    <div className="chef-create-order">
      <div className="order-container chef">
        <div style={{ flexDirection: 'row', backgroundColor: '#EFF0F3', boxShadow: "0px 0px 6px 0px rgba(0, 0, 0, 0.08)", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px 0" }}>
          <Image style={{ width: "20px", height: '20px', marginRight: "5px" }} src={InfoIcon} alt="info" />
          <p style={{ color: '#676767', fontSize: "94%", fontWeight: '400', margin: "0" }} className='billheading'>Bill value depends upon Dish selected + Number of people</p>
        </div>
        {/* Step Indicator - ensure 'active' prop is a string if required by Semantic UI */}
        <div className="range-bar">
          <Step active={true.toString()} className="step1">
            <Image src={SelectDishes} alt="Select Dishes" style={styles.dish} />
            <Label active={true.toString()}>Select Dishes</Label>
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
          <div style={{ display: "flex", margin: "10px 0 0" }}>
            <div style={{ marginRight: "10px" }}>
              <Button
                variant={selected === "veg" ? "success" : "outline-success"}
                onClick={() => handleSwitchChange("veg")}
                className="cuisinebtn" // Ensure this class is styled appropriately
              >
                Only Veg
              </Button>
            </div>
            <div>
              <Button
                variant={selected === "non-veg" ? "danger" : "outline-danger"}
                onClick={() => handleSwitchChange("non-veg")}
                className="cuisinebtn"
              >
                Non-Veg
              </Button>
            </div>
          </div>
          <div className="chef-divider" style={{ marginTop: "13px" }} />
        </Row>

        <Row className="mt-1">
          <Col>
            {/* Render Cuisines Selection Buttons */}
            <div className="cuisine-selection-container my-3 d-flex flex-wrap">
              {cuisines.map((cuisineItem) => (
                <div key={cuisineItem[0]} style={{marginRight: '10px', marginBottom: '10px'}}>
                  {renderItem({ item: cuisineItem })}
                </div>
              ))}
            </div>

            {loading? <SkeletonLoader loading={true} />:<>
            {selectedCuisines.length > 0 && mealList.length > 0 && (
              <ListGroup className="dish-list">
                {mealList.map((meal) => (
                  // Ensure meal._id is unique for keys
                  <ListGroupItem key={meal._id || meal.mealObject._id} className="dish-item p-0 border-0">
                    {renderDishItem({ item: meal })}
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
            {selectedCuisines.length > 0 && !loading && mealList.length === 0 && (
                 <p className="text-center my-4">No dishes found for the selected criteria.</p>
            )}</>}
          </Col>
        </Row>

        {/* Continue Button Footer */}
        {selectedDishes.length > 0 && (
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
                  zIndex: 1000, // Ensure it's above other content
                }}
                className="text-center" // Added for centering button
              >
                <Button
                  onClick={addDish} // Removed selectedDishPrice from here, it's in state
                  style={{
                    width: "50%", // Consider making this responsive
                    backgroundColor: isDishSelected ? "#9252AA" : "#F9E9FF",
                    borderColor: isDishSelected ? "#9252AA" : "#F9E9FF",
                    color: isDishSelected ? "white" : "#A0A0A0", // Ensure contrast for disabled state
                  }}
                  disabled={!isDishSelected}
                  className="continuebtnchef"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>Continue</span>
                    <span>{selectedCount} Item{selectedCount === 1 ? '' : 's'}</span>
                  </div>
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </div>

      {/* Modal for Dish Details */}
      <Modal show={isViewAllSheetOpen} onHide={closeViewAllSheet} centered>
        <Modal.Header closeButton>
          <Modal.Title>{dishDetail ? dishDetail.name : 'Dish Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body><RenderBottomSheetContent /></Modal.Body>
      </Modal>

      {/* Warning Popups */}
      {(isWarningVisibleForCuisineCount || isWarningVisibleForDishCount) && (
        <Popup popupMessage={popupMessage} onClose={handleWarningClose} />
      )}
    </div>
  );
};

const styles = {
  // imageContainer is not used in the component, can be removed if not planned for future use
  dish: {
    width: "32px",
    height: "32px",
  },
};

export default FoodDeliveryCreateOrder;
