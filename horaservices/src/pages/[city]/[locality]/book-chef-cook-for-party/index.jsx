import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { Step, Label, Divider } from "semantic-ui-react"; // Replace with actual library
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Modal, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import {
  BASE_URL,
  GET_CUISINE_ENDPOINT,
  API_SUCCESS_CODE,
  GET_MEAL_DISH_ENDPOINT,
} from "../../../../utils/apiconstants";
import RectanglePurple from "../../../../assets/Rectanglepurple.png";
import RectangleWhite from "../../../../assets/rectanglewhite.png";
import MinusIcon from "../../../../assets/minus.png";
import PlusIcon from "../../../../assets/plus.png";
import warningImage from "../../../../assets/Group.png";
import SkeletonLoader from "../../../../utils/chefSkeleton";
import "../../../../css/Toggle.css";
import "../../../../css/chefOrder.css";
import SelectDishes from "../../../../assets/selectDish.png";
import SelectDateTime from "../../../../assets/event.png";
import SelectConfirmOrder from "../../../../assets/confirm_order.png";
import separator from "../../../../assets/separator.png";
import InfoIcon from "../../../../assets/info.png";
import Image from "next/image";
import { useRouter } from "next/router";
import axiosApi from "@/utils/axiosApi";
import Head from "next/head";
import Link from "next/link";
import { validateCityLocality } from "@/utils/validCities";
import { ChefFAQS } from "@/components/ChefCookForParty/ChefLocalitiesSection";

const CreateOrder = ({ initialCuisines = [], initialMealList = [] }) => {
  const [isMobile, setIsMobile] = useState(false);
  const bottomSheetRef = useRef(null);
  const [orderType, setOrderType] = useState(2);
  const [isDishSelected, setIsDishSelected] = useState(false);
  const [selected, setSelected] = useState("veg");
  const [cuisines, setCuisines] = useState(initialCuisines);
  const [selectedCuisines, setSelectedCuisines] = useState(
    initialCuisines.length > 0 ? [initialCuisines[0][0]] : [],
  );
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [mealList, setMealList] = useState(initialMealList);
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
  const [loading, setLoading] = useState(initialMealList.length === 0);
  const [isWarningVisibleForTotalAmount, setWarningVisibleForTotalAmount] =
    useState(false);
  const [isWarningVisibleForDishCount, setWarningVisibleForDishCount] =
    useState(false);
  const [isWarningVisibleForCuisineCount, setWarningVisibleForCuisineCount] =
    useState(false);
  const [isViewAllExpanded, setIsViewAllExpanded] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    image: "",
    title: "",
    body: "",
    button: "",
  });

  // Handler for 'Only Veg' toggle switch
  const handleVegSwitch = () => {
    if (isNonVegSelected) return; // Prevent switching if 'Non-Veg' is selected
    setIsVegSelected((prev) => !prev); // Toggle 'Only Veg' state
  };

  // Handler for 'Non-Veg' toggle switch
  const handleNonVegSwitch = () => {
    setIsNonVegSelected((prev) => !prev); // Toggle 'Non-Veg' state
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    // Initial setting
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= 768);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);
  const maxItems = isMobile ? 3 : 7;

  // Filter the cuisines based on selected state
  const filteredCuisines = cuisines.filter((cuisine) => {
    if (isVegSelected && !isNonVegSelected) {
      return cuisine.type !== "veg"; // Show only non-veg items if 'Only Veg' is selected
    } else if (!isVegSelected && isNonVegSelected) {
      return cuisine.type !== "non-veg"; // Show only veg items if 'Non-Veg' is selected
    } else if (isVegSelected && isNonVegSelected) {
      return true; // Show all items if both are selected
    }
    return false; // Show nothing if neither are selected
  });

  // Filter the meal list based on selected state
  const filteredMealList = mealList.filter((meal) => {
    if (isVegSelected && !isNonVegSelected) {
      return meal.type !== "veg"; // Show only non-veg items if 'Only Veg' is selected
    } else if (!isVegSelected && isNonVegSelected) {
      return meal.type !== "non-veg"; // Show only veg items if 'Non-Veg' is selected
    } else if (isVegSelected && isNonVegSelected) {
      return true; // Show all items if both are selected
    }
    return false; // Show nothing if neither are selected
  });

  const router = useRouter();

  const handleWarningClose = () => {
    setWarningVisibleForDishCount(false);
    setWarningVisibleForCuisineCount(false);
    setWarningVisibleForTotalAmount(false);
  };

  // get category of cuisines
  useEffect(() => {
    // Agar SSR se data already aa gaya hai to skip
    if (initialCuisines.length > 0) return;

    const fetchCuisineData = async () => {
      try {
        const url = BASE_URL + GET_CUISINE_ENDPOINT;
        const requestData = {
          type: "cuisine",
        };
        const response = await axiosApi.post(url, requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === API_SUCCESS_CODE) {
          const names = response.data.data.configuration.map(
            ({ _id, name }) => [_id, name],
          );
          setCuisines(names);
        }
      } catch (error) {
        console.log("Error Fetching Data:", error.message);
      }
    };
    fetchCuisineData();
  }, [initialCuisines]);

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
        image: warningImage,
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
        image: warningImage,
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
      const response = await axiosApi.post(url, requestData, {
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
              className={`viewbtn ${
                expandedCategories.includes(item.mealObject._id)
                  ? "clickedviewAll"
                  : ""
              }`}
            >
              View All
            </Button>
          </div>
          <div className="dish-item">
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
                      className={`dish-item-inner ${
                        dish.is_dish === 1 ? "veg-border" : "non-veg-border"
                      }`}
                      style={{
                        backgroundImage: `url(${
                          selectedDishes.includes(dish._id)
                            ? RectanglePurple.src
                            : RectangleWhite.src
                        })`,
                      }}
                    >
                      {selectedImage ? (
                        <Image
                          src={selectedImage}
                          alt={dish.name}
                          className={`dish-image ${
                            selectedDishes.includes(dish._id) ? "selected" : ""
                          }`}
                          width={300}
                          height={300}
                        />
                      ) : (
                        <div
                          className={`dish-placeholder ${
                            selectedDishes.includes(dish._id) ? "selected" : ""
                          }`}
                        >
                          Image not available
                        </div>
                      )}
                      <p
                        className={`dish-name ${
                          selectedDishes.includes(dish._id) ? "selected" : ""
                        }`}
                      >
                        {isDishSelected &&
                        dish.special_appliance_id.length > 0 &&
                        selectedDishes.includes(dish._id)
                          ? dish.special_appliance_id[0].name
                          : dish.name}
                      </p>
                      <div className="d-flex justify-content-between w-100 px-3 dishPrice">
                        <span
                          className={`dish-price ${
                            selectedDishes.includes(dish._id) ? "selected" : ""
                          }`}
                        >
                          ₹ {dish.dish_rate}
                        </span>

                        <Button
                          className="pluBtn"
                          onClick={() =>
                            handleIncreaseQuantity(
                              dish,
                              selectedDishes.includes(dish._id),
                            )
                          }
                        >
                          <Image
                            src={
                              selectedDishes.includes(dish._id)
                                ? MinusIcon
                                : PlusIcon
                            }
                            style={{ width: 21, height: 21 }}
                          />
                        </Button>
                      </div>
                      <div
                        className={`dish-indicator ${
                          dish.is_dish === 1 ? "veg" : "non-veg"
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
                      className={`dish-item-inner ${
                        dish.is_dish === 1 ? "veg-border" : "non-veg-border"
                      }`}
                      style={{
                        backgroundImage: `url(${
                          selectedDishes.includes(dish._id)
                            ? RectanglePurple.src
                            : RectangleWhite.src
                        })`,
                      }}
                    >
                      {selectedImage ? (
                        <Image
                          src={selectedImage}
                          alt={dish.name}
                          className={`dish-image ${
                            selectedDishes.includes(dish._id) ? "selected" : ""
                          }`}
                          width={300}
                          height={300}
                        />
                      ) : (
                        <div
                          className={`dish-placeholder ${
                            selectedDishes.includes(dish._id) ? "selected" : ""
                          }`}
                        >
                          Image not available
                        </div>
                      )}
                      <p
                        className={`dish-name ${
                          selectedDishes.includes(dish._id) ? "selected" : ""
                        }`}
                      >
                        {isDishSelected &&
                        dish.special_appliance_id.length > 0 &&
                        selectedDishes.includes(dish._id)
                          ? dish.special_appliance_id[0].name
                          : dish.name}
                      </p>
                      <div className="d-flex justify-content-between w-100 px-3 dishPrice">
                        {/* <span
                                                className={`dish-price ${selectedDishes.includes(dish._id) ? "selected" : ""
                                                    }`}
                                            >
                                                ₹ {dish.dish_rate}
                                            </span> */}
                        <Button
                          className="pluBtn"
                          onClick={() =>
                            handleIncreaseQuantity(
                              dish,
                              selectedDishes.includes(dish._id),
                            )
                          }
                        >
                          <Image
                            src={
                              selectedDishes.includes(dish._id)
                                ? MinusIcon
                                : PlusIcon
                            }
                            style={{ width: 21, height: 21 }}
                          />
                        </Button>
                      </div>
                      <div
                        className={`dish-indicator ${
                          dish.is_dish === 1 ? "veg" : "non-veg"
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
    let totalDishPrice = 0;

    // ✅ Only calculate base dish price (NO 700 here)
    selectedDishes.forEach((dishId) => {
      const dish = selectedDishDictionary[dishId];
      if (dish) {
        totalDishPrice += Number(dish.dish_rate) || 0;
      }
    });

    console.log(
      "✅ Total Dish Base Price Before Routing (without 700):",
      totalDishPrice,
    );

    router.push({
      pathname: "/book-chef-cook-for-party/order-details",
      query: {
        orderType,
        selectedDishDictionary: JSON.stringify(selectedDishDictionary),
        selectedDishPrice: totalDishPrice,
        selectedDishes: JSON.stringify(selectedDishes),
        isDishSelected,
        selectedCount,
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
      />
      <h5 className="bottom-sheet-title">{dishDetail.name}</h5>
      <hr />
      <p className="bottom-sheet-description">{dishDetail.description}</p>
      <div className="bottom-sheet-info">
        <div className="info-item">
          <strong>Per Plate Qty:</strong>{" "}
          {dishDetail.per_plate_qty.qty
            ? `${dishDetail.per_plate_qty.qty} ${dishDetail.per_plate_qty.unit}`
            : "NA"}
        </div>
        <div className="info-item">
          <strong>Price Per Plate:</strong>{" "}
          {dishDetail.dish_rate ? `₹ ${dishDetail.dish_rate}` : "NA"}
        </div>
        <div className="info-item">
          <strong>Price:</strong>{" "}
          {dishDetail.price ? `₹ ${dishDetail.price}` : "NA"}
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
          : [...prevExpanded, categoryId],
    );
  };

  if (loading) {
    return <SkeletonLoader loading={true} />;
  }

  return (
    <div className="chef-create-order">
      <Head>
        <link
          rel="canonical"
          href="https://horaservices.com/book-chef-cook-for-party"
        />
      </Head>
      <div className="order-container chef">
        <div
          style={{
            flexDirection: "row",
            backgroundColor: "#EFF0F3",
            boxShadow: "0px 0px 6px 0px rgba(0, 0, 0, 0.23)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px 0",
          }}
        >
          <Image
            style={{ width: "20px", height: "20px", marginRight: "10px" }}
            src={InfoIcon}
          />
          <p
            style={{
              color: "#676767",
              fontSize: "94%",
              fontWeight: "400",
              margin: "0",
            }}
            className="billheading"
          >
            Bill value depends upon Dish selected + Number of people
          </p>
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
            <Image
              src={SelectDateTime}
              alt="Select Date & Time"
              style={styles.dish}
            />
            <Label>Select Date & Time</Label>
          </Step>
          <div className="sep-image">
            <Image src={separator} />
          </div>
          <Step className="step3">
            <Image
              src={SelectConfirmOrder}
              alt="Confirm Order"
              style={styles.dish}
            />
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
                variant={selected === "non-veg" ? "danger" : "outline-danger"}
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
        <Row className="mt-1">
          <Col>
            {selectedCuisines.length > 0 && (
              <ListGroup className="dish-list">
                {mealList.map((meal) => (
                  <div className="w-100">
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
                  backgroundColor: isDishSelected ? "#9252AA" : "#F9E9FF",
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
    </div>
  );
};

// const styles = {
//   imageContainer: {
//     position: "relative",
//     width: "270px",
//     backgroundColor: "#fff",
//     marginBottom: 40,
//     boxShadow: "0 6px 16px 0 rgba(0,0,0,.14)",
//     borderRadius: "5px",
//     overflow: "hidden",
//     transition: "transform 0.3s ease-in-out",
//     margin: "10px 12px 20px",
//     padding: "6px 5px 10px",
//   },
//   dish: {
//     width: "32px",
//     height: "32px",
//   },
// };

const ChefCitypage = ({
  city: ssrCity = "",
  initialCuisines = [],
  initialMealList = [],
}) => {
  const [showButton, setShowButton] = useState(false);
  const [city, setCity] = useState(ssrCity || "");
  const openLink = () => {
    window.open(
      "https://play.google.com/store/apps/details?id=com.hora",
      "_blank",
    );
  };

  useEffect(() => {
    setShowButton(window.innerWidth > 800);
    function handleResize() {
      setShowButton(window.innerWidth > 800);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const router = useRouter();

  // Client-side navigation pe bhi city update ho jaye
  useEffect(() => {
    if (router.isReady) {
      const { city: queryCity } = router.query;
      if (queryCity) {
        setCity(queryCity);
      }
    }
  }, [router.isReady, router.query]);

  // SSR pe city props se aayega, isliye loading gate hata diya
  const displayCity = city || ssrCity || "";

  return (
    <>
      <Head>
        <title>
          {displayCity
            ? `HORA Chef Services in ${displayCity} | Hire Private Chef & Cook for Parties, Events & Home – Book Now`
            : `HORA Chef Services | Hire Private Chef & Cook for Parties, Events & Home – Book Now`}
        </title>

        <meta
          name="description"
          content={
            displayCity
              ? `🍽️ Book a Professional Chef in ${displayCity}! ✨ HORA Chef Services — Hire trained & verified private chefs and cooks for birthdays, house parties, weddings, corporate events & more. Starting at affordable prices.`
              : `🍽️ Book a Professional Chef Near You! ✨ HORA Chef Services — Hire trained & verified private chefs and cooks for birthdays, house parties, weddings, corporate events & more.`
          }
        />

        <meta
          name="keywords"
          content={
            displayCity
              ? `hire chef in ${displayCity}, book a cook in ${displayCity}, private chef ${displayCity}, personal chef ${displayCity}, chef for party ${displayCity}, catering services ${displayCity}, home chef ${displayCity}, cook near me ${displayCity}`
              : `hire chef, book a cook, private chef, personal chef, chef for party, catering services, home chef, cook near me`
          }
        />

        <meta
          property="og:title"
          content={
            displayCity
              ? `Hire Professional Chef & Cook in ${displayCity} | HORA Chef Services`
              : `Hire Professional Chef & Cook | HORA Chef Services`
          }
        />
        <meta
          property="og:description"
          content="🍽️ Explore a wide range of professional chef and cook services for every event and party. Book your ideal chef directly through our website for a seamless experience. Need help? Contact us at 7338584828."
        />
        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
        />
        <meta
          property="og:image:alt"
          content="hire chef, private chef, cook for party, catering services, home chef"
        />
        <link
          rel="canonical"
          href={
            displayCity
              ? `https://horaservices.com/${displayCity.toLowerCase()}/book-chef-cook-for-party`
              : `https://horaservices.com/book-chef-cook-for-party`
          }
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link
          rel="icon"
          href="https://horaservices.com/api/uploads/logo-icon.png"
          type="image/x-icon"
        />
        <meta
          property="og:url"
          content={
            displayCity
              ? `https://horaservices.com/${displayCity.toLowerCase()}/book-chef-cook-for-party`
              : `https://horaservices.com/book-chef-cook-for-party`
          }
        />
        <meta property="og:type" content="website" />
      </Head>

      <div>
        {/* ★★★ CreateOrder ko SSR data props me pass kiya */}
        <CreateOrder
          initialCuisines={initialCuisines}
          initialMealList={initialMealList}
        />

        <section id="section6" className="sectionidsec">
          <div style={styles.pageWidth}>
            <ChefFAQS city={displayCity} />
          </div>
        </section>

        <section id="section7" className="sectionidsec">
          <div style={styles.pageWidth}>
            <p
              style={{
                fontSize: "70px",
                textTransform: "uppercase",
                fontWeight: "bold",
                color: "#E6756B",
                margin: "35px 0 2px",
                textAlign: "center",
              }}
              className="other-cities"
            >
              Other Cities
            </p>
            <div className="tab-inner">
              <ul style={{ listStyle: "none", padding: "20px 20px" }}>
                <li
                  className="city-link"
                  data-city="Delhi"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Delhi</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Gurugram"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Gurugram</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Ghaziabad"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Ghaziabad</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Faridabad"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Faridabad</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Noida"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Noida</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Bengaluru"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Bengaluru</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Bangalore"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Bangalore</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Hyderabad"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Hyderabad</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Mumbai"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Mumbai</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Indore"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Indore</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Chennai"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Chennai</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Pune"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Pune</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Surat"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Surat</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Bhopal"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Bhopal</Link>
                </li>
                <li
                  className="city-link"
                  data-city="kanpur"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Kanpur</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Lucknow"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Lucknow</Link>
                </li>
                <li
                  className="city-link"
                  data-city="kolkata"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Kolkata</Link>
                </li>
                <li
                  className="city-link"
                  data-city="Goa"
                  style={{ padding: "0 10px", display: "inline-block" }}
                >
                  <Link href="#">Goa</Link>
                </li>
              </ul>

              <div id="city-content">
                <div className="des-city-area">
                  <h1
                    style={{
                      fontSize: "70px",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      color: "#E6756B",
                      margin: "35px 0 0px",
                      textAlign: "center",
                    }}
                  >
                    Description
                  </h1>
                  <p id="city-description">
                    Book professional Cooks and Chefs in {displayCity} for House
                    Parties, Birthday Parties, Special Breakfast, Lunch and
                    Dinner at Home. Hire trained and verified personal Chefs and
                    Cooks near you for a private dining experience at home with
                    the best cooks and chef services at home.
                  </p>
                </div>
              </div>
            </div>
            <p
              id="city-seo-content"
              style={{ fontSize: "5px", margin: "20px 0 20px " }}
            >
              Online chef for hire in {displayCity}, Chef in {displayCity}, Best
              caterers for small parties in {displayCity}, Best home-made
              cooking service in {displayCity}, Mini party caterers in{" "}
              {displayCity}, Book a chef in {displayCity}, Book a cook in{" "}
              {displayCity}, Book a private chef in {displayCity}, Book a
              private cook in {displayCity}, Book a trained verified cook near
              you in {displayCity}, Bookacook in {displayCity}, Caterers for
              small parties in {displayCity}, Top caterers in {displayCity},
              Chef for a party in {displayCity}, Catering services in{" "}
              {displayCity}, Chef at home service in {displayCity}, Chef for a
              day in {displayCity}, Chef for a night in {displayCity}, Chef for
              hire in {displayCity}, Chef cooking at my home in {displayCity},
              Chef near me in {displayCity}, Chef on demand in {displayCity},
              Chef required at home in {displayCity}, Chefs for hire in{" "}
              {displayCity}, Chefs for home in {displayCity}, Hire a private
              chef in {displayCity}, Chefs on hire in {displayCity}, Cook chef
              near me in {displayCity}, Cook at home services in {displayCity},
              Cook for a day in {displayCity}, Cook for a night in {displayCity}
              , Cook for one day in {displayCity}, Cook for a party in{" "}
              {displayCity}, Cook service near me in {displayCity}, Cook home
              services in {displayCity}, Cook near me in {displayCity}, Cook on
              demand in {displayCity}, Cook on hire near me in {displayCity},
              Cook required at home in {displayCity}, Cooking as a service in{" "}
              {displayCity}, Cooking maids near me in {displayCity}, Cooking
              services near me in {displayCity}, Cooks for hire in {displayCity}
              , Cooks for home in {displayCity}, Cooks near me in {displayCity},
              Cooks on hire in {displayCity}, Domestic cook near me in{" "}
              {displayCity}, Find a chef in {displayCity}, Find a cook in{" "}
              {displayCity}, Hire a chef in {displayCity}, Hire a chef for a day
              in {displayCity}, Hire personal chef in {displayCity}, Hire a chef
              for home in {displayCity}, Hire a chef near me in {displayCity},
              Take a Chef in {displayCity}, Hire a cook in {displayCity}, Hire a
              cook at home in {displayCity}, Hire a cook for home in{" "}
              {displayCity}, Hire a cook near me in {displayCity}, Hire a
              personal chef for a night in {displayCity}, Hire a personal cook
              in {displayCity}, Hire a professional chef in {displayCity}, Hire
              chef at home in {displayCity}, Hire cook near me in {displayCity},
              Hire cook online in {displayCity}, Hire private chef in{" "}
              {displayCity}, Hire someone to cook for you in {displayCity},
              Hiring a personal chef in {displayCity}, Home caterers in{" "}
              {displayCity}, Home chef near me in {displayCity}, Home cook near
              me in {displayCity}, Home cooking service in {displayCity}, Home
              cooking service near me in {displayCity}, Home party catering in{" "}
              {displayCity}, House chef near me in {displayCity}, House cook
              near me in {displayCity}, In-home cooking service in {displayCity}
              , In-house cooking service in {displayCity}, Local chefs for hire
              in {displayCity}, Looking for chef in {displayCity}, Looking for
              cook in {displayCity}, Mini caterers in {displayCity}, Need a chef
              in {displayCity}, Need a cook in {displayCity}, Online cook
              service in {displayCity}, Party caterers in {displayCity},
              Personal chef in {displayCity}, Personal chefs for hire near me in{" "}
              {displayCity}, Personal Cook in {displayCity}, Personal cook near
              me in {displayCity}, Private chef in {displayCity}, Private chef
              hire in {displayCity}, Private chef near me in {displayCity},
              Private chef services near me in {displayCity}, Private cook in{" "}
              {displayCity}, Private cook for hire in {displayCity}, Private
              personal chef in {displayCity}, Professional chef for hire in{" "}
              {displayCity}, Top rated chefs in {displayCity}, Top rated cooks
              in {displayCity}, Want to hire a cook in {displayCity}
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

const styles = {
  homebanner: {
    marginTop: "-76px",
  },
  pageWidth: {
    maxWidth: "100%",
    width: "1200px",
    margin: "0 auto",
  },
  bgImg: {
    backgroundSize: "cover",
    paddingTop: "110px",
    paddingBottom: "30px",
  },
  textContainer: {
    textAlign: "center",
    color: "white",
    margin: "0 0 70px 0",
  },
  bannerBottomSec: {
    display: "flex",
    justifyContent: "center",
    alignItems: "top",
    flexDirection: "row",
    padding: "0px 6%",
    margin: "0 auto",
    flexWrap: "wrap",
  },
  celebrateBottomSec: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    margin: "0 auto",
    flexWrap: "wrap",
  },
  celebrateBox: {
    margin: "0 1%",
    width: "20%",
  },
  bannerDecorationImage: {
    margin: "0 1%",
    width: "14%",
  },
  serviceSec: {
    backgroundColor: "rgba(230, 117, 107, 0.2)",
    borderRadius: "59px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "60px",
    marginBottom: "50px",
  },
  serviceSecRight: {
    width: "53%",
  },
  serviceSecLeft: {
    width: "40%",
  },
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

// ====================== SSR ======================
export async function getServerSideProps(context) {
  const citySlug =
    context.params?.city?.toLowerCase() || context.query?.city || "";
  const localitySlug =
    context.params?.locality?.toLowerCase() || context.query?.locality || "";

  const validation = validateCityLocality(citySlug, localitySlug);
  if (!validation.valid) {
    return {
      notFound: true,
    };
  }

  let initialCuisines = [];
  let initialMealList = [];

  try {
    // 1. Cuisines fetch
    const cuisineRes = await axiosApi.post(
      BASE_URL + GET_CUISINE_ENDPOINT,
      { type: "cuisine" },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (cuisineRes.status === API_SUCCESS_CODE) {
      initialCuisines = cuisineRes.data.data.configuration.map(
        ({ _id, name }) => [_id, name],
      );
    }

    // 2. Initial meals (first cuisine + default veg)
    if (initialCuisines.length > 0) {
      const firstCuisineId = initialCuisines[0][0];

      const mealRes = await axiosApi.post(
        BASE_URL + GET_MEAL_DISH_ENDPOINT,
        {
          cuisineId: [firstCuisineId],
          is_dish: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (mealRes.status === API_SUCCESS_CODE) {
        initialMealList = mealRes.data.data;
      }
    }
  } catch (error) {
    console.log("SSR Error Fetching Data:", error.message);
  }

  return {
    props: {
      city: context.params?.city || context.query?.city || "",
      locality: context.params?.locality || context.query?.locality || "",
      initialCuisines,
      initialMealList,
    },
  };
}

export default ChefCitypage;
