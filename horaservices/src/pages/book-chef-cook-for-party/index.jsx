// import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
// import { Step, Label, Divider } from 'semantic-ui-react'; // Replace with actual library
// import { ListGroup, ListGroupItem } from "react-bootstrap";
// import { Modal, Button, Container, Row, Col, Spinner } from "react-bootstrap";
// import {
//     BASE_URL,
//     GET_CUISINE_ENDPOINT,
//     API_SUCCESS_CODE,
//     GET_MEAL_DISH_ENDPOINT,
// } from "../../utils/apiconstants";
// import Head from "next/head";
// // import { useNavigate } from "react-router-dom";
// import RectanglePurple from "../../assets/Rectanglepurple.png";
// import RectangleWhite from "../../assets/rectanglewhite.png";
// import MinusIcon from "../../assets/minus.png";
// import PlusIcon from "../../assets/plus.png";
// import warningImage from "../../assets/Group.png";
// import SkeletonLoader from "../../utils/chefSkeleton";
// import '../../css/Toggle.css';
// import '../../css/chefOrder.css';
// import SelectDishes from "../../assets/selectDish.png";
// import SelectDateTime from "../../assets/event.png";
// import SelectConfirmOrder from "../../assets/confirm_order.png";
// import separator from "../../assets/separator.png";
// import styled from 'styled-components';
// import InfoIcon from '../../assets/info.png';
// import Image from "next/image";
// import { useRouter } from "next/router";
// import Popup from '../../utils/popup';
// import SearchBar from "@/components/SearchBar";
// import axiosApi from "@/utils/axiosApi";
// const orangeColor = '#FF6F61';
// const defaultColor = '#B0BEC5';

// const CreateOrder = ({ history, currentStep }) => {
//     const [isMobile, setIsMobile] = useState(false);
//     const viewBottomSheetRef = useRef(null);
//     const bottomSheetRef = useRef(null);
//     const [orderType, setOrderType] = useState(2);
//     const [isDishSelected, setIsDishSelected] = useState(false);
//     const [selected, setSelected] = useState("veg");
//     const [cuisines, setCuisines] = useState([]);
//     const [selectedCuisines, setSelectedCuisines] = useState([]);
//     const [expandedCategories, setExpandedCategories] = useState([]);
//     const [mealList, setMealList] = useState([]);
//     const [isSelectedDish, setIsSelectedDish] = useState(false);
//     const [dishDetail, setDishDetail] = useState(null);
//     const [selectedCount, setSelectedCount] = useState(0);
//     const [selectedDishes, setSelectedDishes] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const [isViewAllSheetOpen, setIsViewAllSheetOpen] = useState(false);
//     const [selectedDishPrice, setSelectedDishPrice] = useState(0);
//     const [selectedDishDictionary, setSelectedDishDictionary] = useState({});
//     const [isNonVegSelected, setIsNonVegSelected] = useState(false);
//     const [isVegSelected, setIsVegSelected] = useState(true);
//     const [isPopupVisible, setPopupVisible] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [isWarningVisibleForTotalAmount, setWarningVisibleForTotalAmount] = useState(false);
//     const [isWarningVisibleForDishCount, setWarningVisibleForDishCount] = useState(false);
//     const [isWarningVisibleForCuisineCount, setWarningVisibleForCuisineCount] = useState(false);
//     const [isViewAllExpanded, setIsViewAllExpanded] = useState(false);
//     const [isSearching, setIsSearching] = useState(false);
// const [selectedSearchDishes, setSelectedSearchDishes] = useState([]);
//     const [popupMessage, setPopupMessage] = useState({
//         img: "",
//         title: "",
//         body: "",
//         button: "",
//     });
// const [searchTerm, setSearchTerm] = useState("");
//     // Handler for 'Only Veg' toggle switch
//     const handleVegSwitch = () => {
//         if (isNonVegSelected) return; // Prevent switching if 'Non-Veg' is selected
//         setIsVegSelected(prev => !prev); // Toggle 'Only Veg' state
//     };

//     // Handler for 'Non-Veg' toggle switch
//     const handleNonVegSwitch = () => {
//         setIsNonVegSelected(prev => !prev); // Toggle 'Non-Veg' state
//     };

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth <= 768);
//         };
//         // Initial setting
//         if (typeof window !== "undefined") {
//             setIsMobile(window.innerWidth <= 768);
//             window.addEventListener('resize', handleResize);
//         }

//         return () => {
//             if (typeof window !== "undefined") {
//                 window.removeEventListener('resize', handleResize);
//             }
//         };
//     }, []);
//     const maxItems = isMobile ? 3 : 7;

//     // Filter the cuisines based on selected state
//     const filteredCuisines = cuisines.filter(cuisine => {
//         if (isVegSelected && !isNonVegSelected) {
//             return cuisine.type !== 'veg'; // Show only non-veg items if 'Only Veg' is selected
//         } else if (!isVegSelected && isNonVegSelected) {
//             return cuisine.type !== 'non-veg'; // Show only veg items if 'Non-Veg' is selected
//         } else if (isVegSelected && isNonVegSelected) {
//             return true; // Show all items if both are selected
//         }
//         return false; // Show nothing if neither are selected
//     });
// const allDishes = mealList.flatMap((meal) => meal.dish);
// const suggestions = allDishes.filter((dish) =>
//   dish.name.toLowerCase().includes(searchTerm.toLowerCase())
// );
//     // Filter the meal list based on selected state
//     const filteredMealList = mealList.filter(meal => {
//         if (isVegSelected && !isNonVegSelected) {
//             return meal.type !== 'veg'; // Show only non-veg items if 'Only Veg' is selected
//         } else if (!isVegSelected && isNonVegSelected) {
//             return meal.type !== 'non-veg'; // Show only veg items if 'Non-Veg' is selected
//         } else if (isVegSelected && isNonVegSelected) {
//             return true; // Show all items if both are selected
//         }
//         return false; // Show nothing if neither are selected
//     });

//     const router = useRouter();

//     const handleWarningClose = () => {
//         setWarningVisibleForDishCount(false);
//         setWarningVisibleForCuisineCount(false);
//         setWarningVisibleForTotalAmount(false);
//     };

//     // get category of cuisines
//     useEffect(() => {
//         const fetchCuisineData = async () => {
//             try {
//                 const url = BASE_URL + GET_CUISINE_ENDPOINT;
//                 const requestData = {
//                     type: "cuisine",
//                 };
//                 const response = await axiosApi.post(url, requestData, {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 });
//                 if (response.status === API_SUCCESS_CODE) {
//                     const names = response.data.data.configuration.map(
//                         ({ _id, name }) => [_id, name]
//                     );
//                     setCuisines(names);
//                 }
//             } catch (error) {
//                 console.log("Error Fetching Data:", error.message);
//             }
//         };
//         fetchCuisineData();
//     }, []);

//     useEffect(() => {
//         if (cuisines.length > 0 && selectedCuisines.length === 0) {
//             handleCuisinePress(cuisines[0][0]);
//         }
//     }, [cuisines, selectedCuisines]);

//     const renderItem = ({ item }) => {
//         const isSelected = selectedCuisines.includes(item[0]);

//         return (
//             <div className="d-flex align-items-center justify-content-between mb-2">
//                 <Button
//                     variant={isSelected ? "primary" : "outline-primary"}
//                     onClick={() => handleCuisinePress(item[0])}
//                     className="cusinebtn"
//                 >
//                     {item[1]}
//                 </Button>
//                 {expandedCategories.includes(item[0]) && (
//                     <ListGroup className="d-flex flex-wrap">
//                         {cuisines.map((cuisine, index) => (
//                             <ListGroupItem
//                                 key={index}
//                                 className="flex-grow-1"
//                                 style={{ flexBasis: "calc(25% - 10px)", margin: "5px" }} // Adjust margin and flexBasis as needed
//                             >
//                                 {renderItem({ item: cuisine })}
//                             </ListGroupItem>
//                         ))}
//                     </ListGroup>
//                 )}
//             </div>
//         );
//     };

//     const handleIncreaseQuantity = (dish, isSelected) => {
//         if (selectedDishes.length >= 0 && !isSelected) {
//             //setIsButtonVisible(true);
//         }
//         if (selectedDishes.length > 11 && !isSelected) {
//             setWarningVisibleForDishCount(true);
//             setPopupMessage({
//                 img: warningImage,
//                 title: "Total Dishes Selected can not be more than 12 Dish.",
//                 body: "Total dish selected can not be more than 12 dish, for more help contact us.",
//                 button: "Contact Us",
//             });
//         } else {
//             const updatedSelectedDishes = [...selectedDishes];
//             const updatedSelectedDishDictionary = { ...selectedDishDictionary };
//             if (updatedSelectedDishes.includes(dish._id)) {
//                 const index = updatedSelectedDishes.indexOf(dish._id);
//                 updatedSelectedDishes.splice(index, 1);
//             } else {
//                 updatedSelectedDishes.push(dish._id);
//             }
//             setSelectedDishes(updatedSelectedDishes);
//             setSelectedCount(updatedSelectedDishes.length);
//             if (isSelected) {
//                 const updatedPrice = selectedDishPrice - parseInt(dish.dish_rate, 10);
//                 setSelectedDishPrice(updatedPrice);
//             } else {
//                 const updatedPrice = selectedDishPrice + parseInt(dish.dish_rate, 10);
//                 setSelectedDishPrice(updatedPrice);
//             }
//             if (updatedSelectedDishDictionary[dish._id]) {
//                 delete updatedSelectedDishDictionary[dish._id];
//             } else {
//                 updatedSelectedDishDictionary[dish._id] = dish;
//             }
//             setSelectedDishDictionary(updatedSelectedDishDictionary);
//             setIsDishSelected(updatedSelectedDishes.length > 0);
//         }
//     };

//     const handleCuisinePress = (cuisineId) => {
//         if (selectedCuisines.length < 3 || selectedCuisines.includes(cuisineId)) {
//             setSelectedCuisines((prevSelected) => {
//                 if (prevSelected.includes(cuisineId)) {
//                     return prevSelected.filter((item) => item !== cuisineId);
//                 } else {
//                     return [...prevSelected, cuisineId];
//                 }
//             });
//         } else {
//             setWarningVisibleForCuisineCount(true);
//             setPopupMessage({
//                 img: warningImage,
//                 title: "One chef is only expert in 3 cuisine only.",
//                 body: "Our chef is expert in cuisines only please select appropriate number of cuisines to continue",
//                 button: "Continue",
//             });
//         }
//     };

//     const fetchMealBasedOnCuisine = async () => {
//         try {
//             setLoading(true);
//             const url = BASE_URL + GET_MEAL_DISH_ENDPOINT;
//             const is_dish = isNonVegSelected ? 0 : 1;
//             const requestData = {
//                 cuisineId: selectedCuisines,
//                 is_dish: is_dish,
//             };
//             const response = await axiosApi.post(url, requestData, {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });
//             if (response.status === API_SUCCESS_CODE) {
//                 setMealList(response.data.data);
//             }
//         } catch (error) {
//             console.log("Error Fetching Data:", error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (selectedCuisines.length > 0 && selectedCuisines.length <= 3) {
//             fetchMealBasedOnCuisine();
//         } else {
//             setMealList([]);
//             setSelectedDishDictionary({});
//             setIsDishSelected(false);
//             setSelectedDishes([]);
//             setSelectedCount(0);
//             setSelectedDishPrice(0);
//         }
//     }, [selectedCuisines, isNonVegSelected]);

  

//     const renderDishItem = ({ item }) => (
//         <div className="w-100">
//             {item.dish.length > 0 ? (
//                 <div>
//                     <div
//                         style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "top",
//                             margin: "9px 19px 0px 6px",
//                         }}
//                     >
//                         <h1
//                             style={{ color: "#000", fontSize: "16px", marginBottom: "0px" }}
//                         >
//                             {item.mealObject.name}
//                             {"  "}
//                             {"(" + item.dish.length + ")"}
//                         </h1>
//                         <Button
//                             onClick={() => handleViewAll(item.mealObject._id)}
//                             style={{
//                                 color: expandedCategories.includes(item.mealObject._id)
//                                     ? "#000"
//                                     : "#fff",
//                                 fontWeight: "400",
//                                 textDecorationLine: "none",
//                                 fontSize: 12,
//                             }}
//                             className={`viewbtn ${expandedCategories.includes(item.mealObject._id)
//                                 ? "clickedviewAll"
//                                 : ""
//                                 }`}
//                         >
//                             View All
//                         </Button>
//                     </div>
//                     <div className="dish-item 12">
//                         {expandedCategories.includes(item.mealObject._id)
//                             ? item.dish.map((dish, index) => {
//                                 const dishImage = dish.image
//                                     ? `https://horaservices.com/api/uploads/${dish.image}`
//                                     : "";
//                                 const specialApplianceImage =
//                                     dish.special_appliance_id.length > 0 &&
//                                         dish.special_appliance_id[0].image
//                                         ? `https://horaservices.com/api/uploads/${dish.special_appliance_id[0].image}`
//                                         : "";
//                                 const selectedImage = selectedDishes.includes(dish._id)
//                                     ? dishImage
//                                     : dishImage;

//                                 return (
//                                     <div
//                                         key={index}
//                                         className={`dish-item-inner ${dish.is_dish === 1 ? "veg-border" : "non-veg-border"
//                                             }`}
//                                         style={{
//                                             backgroundImage: `url(${selectedDishes.includes(dish._id)
//                                                 ? RectanglePurple.src
//                                                 : RectangleWhite.src
//                                                 })`,
//                                         }}
//                                     >
//                                         {selectedImage ? (
//                                             <div 
//                                             className={`dish-image ${selectedDishes.includes(dish._id) ? "selected" : ""}`}
//                                             style={{
//                                                 backgroundImage: `url(${selectedImage})`,
//                                                 backgroundSize: 'cover, cover', // Ensures both images cover the element
//                                                 backgroundPosition: 'center, center' // Centers both images
//                                             }}
//                                             >
                                           
//                                             </div>
                                           
                                            
//                                         ) : (
//                                             <div
//                                                 className={`dish-placeholder ${selectedDishes.includes(dish._id) ? "selected" : ""
//                                                     }`}
//                                             >
//                                                 Image not available
//                                             </div>
//                                         )}
//                                         <p
//                                             className={`dish-name ${selectedDishes.includes(dish._id) ? "selected" : ""
//                                                 }`}
//                                         >
//                                             {isDishSelected &&
//                                                 dish.special_appliance_id.length > 0 &&
//                                                 selectedDishes.includes(dish._id)
//                                                 ? dish.special_appliance_id[0].name
//                                                 : dish.name}
//                                         </p>
//                                         <div className="d-flex justify-content-between w-100 px-3 dishPrice">
//                                             {/* <span
//                                                 className={`dish-price ${selectedDishes.includes(dish._id) ? "selected" : ""
//                                                     }`}
//                                             >
//                                                 ₹ {dish.dish_rate}
//                                             </span> */}
//                                             <Button
//                                                 className="pluBtn"
//                                                 onClick={() =>
//                                                     handleIncreaseQuantity(
//                                                         dish,
//                                                         selectedDishes.includes(dish._id)
//                                                     )
//                                                 }
//                                             >                                   
//                                                          <Image
//                                                     src={
//                                                         selectedDishes.includes(dish._id)
//                                                             ? MinusIcon
//                                                             : PlusIcon
//                                                     }
//                                                     alt="icon"
//                                                     style={{ width: 21, height: 21 }}
//                                                 /> 
//                                             </Button>
//                                         </div>
//                                         <div
//                                             className={`dish-indicator ${dish.is_dish === 1 ? "veg" : "non-veg"
//                                                 }`}
//                                         ></div>
//                                     </div>
//                                 );
//                             })
//                             : item.dish.slice(0, maxItems).map((dish, index) => {
//                                 const dishImage = dish.image
//                                     ? `https://horaservices.com/api/uploads/${dish.image}`
//                                     : "";
//                                 const specialApplianceImage =
//                                     dish.special_appliance_id.length > 0 &&
//                                         dish.special_appliance_id[0].image
//                                         ? `https://horaservices.com/api/uploads/${dish.special_appliance_id[0].image}`
//                                         : "";
//                                 const selectedImage = selectedDishes.includes(dish._id)
//                                     ? dishImage
//                                     : dishImage;

//                                 return (
//                                     <div
//                                         key={index}
//                                         className={`dish-item-inner ${dish.is_dish === 1 ? "veg-border" : "non-veg-border"
//                                             }`}
//                                         style={{
//                                             backgroundImage: `url(${selectedDishes.includes(dish._id)
//                                                 ? RectanglePurple.src
//                                                 : RectangleWhite.src
//                                                 })`,
//                                         }}
//                                     >
//                                         {selectedImage ? (
//                                              <div 
//                                              className={`dish-image ${selectedDishes.includes(dish._id) ? "selected" : ""}`}
//                                              style={{
//                                                  backgroundImage: `url(${selectedImage})`,
//                                                  backgroundSize: 'cover, cover', // Ensures both images cover the element
//                                                  backgroundPosition: 'center, center' // Centers both images
//                                              }}
//                                              >
//                                                 </div>
//                                         ) : (
//                                             <div
//                                                 className={`dish-placeholder ${selectedDishes.includes(dish._id) ? "selected" : ""
//                                                     }`}
//                                             >
//                                                 Image not available
//                                             </div>
//                                         )}
//                                         <p
//                                             className={`dish-name ${selectedDishes.includes(dish._id) ? "selected" : ""
//                                                 }`}
//                                         >
//                                             {isDishSelected &&
//                                                 dish.special_appliance_id.length > 0 &&
//                                                 selectedDishes.includes(dish._id)
//                                                 ? dish.special_appliance_id[0].name
//                                                 : dish.name}
//                                         </p>
//                                         <div className="d-flex justify-content-between w-100 px-3 dishPrice">
//                                             {/* <span
//                                                 className={`dish-price ${selectedDishes.includes(dish._id) ? "selected" : ""
//                                                     }`}
//                                             >
//                                                 ₹ {dish.dish_rate}
//                                             </span> */}
//                                             <Button
//                                                 className="pluBtn"
//                                                 onClick={() =>
//                                                     handleIncreaseQuantity(
//                                                         dish,
//                                                         selectedDishes.includes(dish._id)
//                                                     )
//                                                 }
//                                             >
//                                                 <Image
//                                                     src={
//                                                         selectedDishes.includes(dish._id)
//                                                             ? MinusIcon
//                                                             : PlusIcon
//                                                     }
//                                                     alt="icon"
//                                                     style={{ width: 21, height: 21 }}
//                                                 />
//                                             </Button>
//                                         </div>
//                                         <div
//                                             className={`dish-indicator ${dish.is_dish === 1 ? "veg" : "non-veg"
//                                                 }`}
//                                         ></div>
//                                     </div>
//                                 );
//                             })}
//                     </div>
//                     <div className="chef-divider" style={{ marginTop: "20px" }}></div>
//                 </div>
//             ) : null}
//         </div>
//     );

//  const addDish = (selectedDishPrice) => {
//     let totalDishPrice = 0;

//     // ✅ Only calculate base dish price (NO 700 here)
//     selectedDishes.forEach((dishId) => {
//         const dish = selectedDishDictionary[dishId];
//         if (dish) {
//             totalDishPrice += Number(dish.dish_rate) || 0;
//         }
//     });

//     console.log("✅ Total Dish Base Price Before Routing (without 700):", totalDishPrice);

//     router.push({
//         pathname: '/book-chef-cook-for-party/order-details',
//         query: {
//             orderType,
//             selectedDishDictionary: JSON.stringify(selectedDishDictionary),
//             selectedDishPrice: totalDishPrice + 49,
//             selectedDishes: JSON.stringify(selectedDishes),
//             isDishSelected,
//             selectedCount,
//         }
//     });
// };


//     const closeBottomSheet = () => {
//         setDishDetail(null);
//         bottomSheetRef.current.close();
//     };

//     const addDishAndCloseBottomSheet = () => {
//         closeBottomSheet();
//     };

//     const RenderBottomSheetContent = () => (
//         <div className="bottom-sheet-content">
//             <Image
//                 src={`https://horaservices.com/api/uploads/${dishDetail.image}`}
//                 alt={dishDetail.name}
//                 className="bottom-sheet-image"
//             />
//             <h5 className="bottom-sheet-title">{dishDetail.name}</h5>
//             <hr />
//             <p className="bottom-sheet-description">{dishDetail.description}</p>
//             <div className="bottom-sheet-info">
//                 <div className="info-item">
//                     <strong>Per Plate Qty:</strong>{" "}
//                     {dishDetail.per_plate_qty.qty
//                         ? `${dishDetail.per_plate_qty.qty} ${dishDetail.per_plate_qty.unit}`
//                         : "NA"}
//                 </div>
//                 <div className="info-item">
//                     <strong>Price Per Plate:</strong>{" "}
//                     {dishDetail.dish_rate ? `₹ ${dishDetail.dish_rate}` : "NA"}
//                 </div>
//                 <div className="info-item">
//                     <strong>Price:</strong>{" "}
//                     {dishDetail.price ? `₹ ${dishDetail.price}` : "NA"}
//                 </div>
//             </div>
//             <Button variant="primary" onClick={addDishAndCloseBottomSheet}>
//                 Add Dish
//             </Button>
//         </div>
//     );

//     const openBottomSheet = (dish, ref) => {
//         setDishDetail(dish);
//         ref.current.open();
//     };

//     const closeViewAllSheet = () => {
//         setIsViewAllSheetOpen(false);
//     };

//     const openViewAllSheet = (dish, ref) => {
//         setDishDetail(dish);
//         setIsViewAllSheetOpen(true);
//     };

//     const handleSwitchChange = (value) => {
//         setSelected(value);
//         if (value === "veg") {
//             setIsVegSelected(true);
//             setIsNonVegSelected(false);
//         } else {
//             setIsVegSelected(false);
//             setIsNonVegSelected(true);
//         }
//     };
//     useEffect(() => {
//   const handleClickOutside = (e) => {
//     if (!e.target.closest(".search-bar-container")) {
//       setIsSearching(false);
//     }
//   };

//   document.addEventListener("click", handleClickOutside);

//   return () => {
//     document.removeEventListener("click", handleClickOutside);
//   };
// }, []);

//     const handleViewAll = (categoryId) => {
//         setIsViewAllExpanded(!isViewAllExpanded);

//         setExpandedCategories((prevExpanded) =>
//             categoryId === prevExpanded[0]
//                 ? prevExpanded.length === 1
//                     ? []
//                     : prevExpanded.slice(1) // If the first category is clicked, toggle its expansion state only if it's not the only expanded category
//                 : prevExpanded.includes(categoryId)
//                     ? prevExpanded.filter((id) => id !== categoryId)
//                     : [...prevExpanded, categoryId]
//         );
//     };
// const sortedMealList = [...filteredMealList].sort((a, b) => {
//   if (selectedSearchDishes.length === 0) return 0;

//   const aIndex = selectedSearchDishes.findIndex((selectedDish) =>
//     a.dish.some((d) => d._id === selectedDish._id)
//   );

//   const bIndex = selectedSearchDishes.findIndex((selectedDish) =>
//     b.dish.some((d) => d._id === selectedDish._id)
//   );

//   // 🔥 jisme selected dish hai → wo upar
//   if (aIndex !== -1 && bIndex === -1) return -1;
//   if (aIndex === -1 && bIndex !== -1) return 1;

//   // 🔥 order maintain (jo pehle select hua wo upar)
//   if (aIndex !== -1 && bIndex !== -1) {
//     return aIndex - bIndex;
//   }

//   return 0;
// });
// const matched = [];
// const unmatched = [];

// filteredMealList.forEach((meal) => {
//   const hasMatch = meal.dish.some((dish) =>
//     dish.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (hasMatch) matched.push(meal);
//   else unmatched.push(meal);
// });


// const finalMealList = sortedMealList.map((meal) => {
//   if (selectedSearchDishes.length === 0) return meal;

//   const sortedDishes = [...meal.dish].sort((a, b) => {
//     const aIndex = selectedSearchDishes.findIndex((d) => d._id === a._id);
//     const bIndex = selectedSearchDishes.findIndex((d) => d._id === b._id);

//     if (aIndex !== -1 && bIndex === -1) return -1;
//     if (aIndex === -1 && bIndex !== -1) return 1;

//     if (aIndex !== -1 && bIndex !== -1) {
//       return aIndex - bIndex;
//     }

//     return 0;
//   });

//   return {
//     ...meal,
//     dish: sortedDishes,
//   };
// });
//     if (loading) {
//         return <SkeletonLoader loading={true} />;
//     };

//     return (
//         <div className="chef-create-order">
//               <Head>
//             <title>HORA book-chef-cook-for-party</title>
//             <meta 
//               name="description" 
//               content="🎉 Explore a wide range of stunning decoration designs for every event and party, including 🎂 birthdays, 🧸 kids' parties, 💍 anniversaries, 💃 bachelorette parties, 👶 baby showers, 🍼 naming ceremonies, and 🌙 first nights. Choose your ideal design and book directly through our website for a seamless experience. Need help? Reach out to us at 7338584828 for friendly support and personalised assistance. 😊" 
//             />
//             <meta 
//               name="keywords" 
//               content="balloon decoration, birthday decoration, anniversary decoration, haldi mehendi decoration, baby shower decoration, welcome baby decor, room decoration, party decoration" 
//             />
//             <meta 
//               property="og:title" 
//               content="HORA Decorations : Professional Balloons & Flowers Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199" 
//             />
//             <meta 
//               property="og:description" 
//               content="🎉 Explore a wide range of stunning decoration designs for every event and party, including 🎂 birthdays, 🧸 kids' parties, 💍 anniversaries, 💃 bachelorette parties, 👶 baby showers, 🍼 naming ceremonies, and 🌙 first nights. Choose your ideal design and book directly through our website for a seamless experience. Need help? Reach out to us at 7338584828 for friendly support and personalised assistance. 😊" 
//             />
//             <meta 
//               property="og:image" 
//               content="https://horaservices.com/api/uploads/attachment-1706520980436.png" 
//             />
//             <meta name="robots" content="index, follow" />
//             <meta name="author" content="Hora Services" />
//             <link 
//               rel="icon" 
//               href="https://horaservices.com/api/uploads/logo-icon.png" 
//               type="image/x-icon" 
//             />
//             <meta 
//               property="og:url" 
//               content="https://horaservices.com/book-chef-cook-for-party" 
//             />
//             <meta property="og:type" content="website" />
//           </Head>
//             <div className="order-container chef">
//                 <div style={{ flexDirection: 'row', backgroundColor: '#EFF0F3', boxShadow: "0px 0px 6px 0px rgba(0, 0, 0, 0.23)", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px 0" }}>
//                     <Image style={{ width: "20px", height: "20px", marginRight: "10px" }} src={InfoIcon} alt="info" />
//                     <p style={{ color: '#676767', fontSize: "94%", fontWeight: '400', margin: "0" }} className='billheading'>Bill value depends upon Dish selected + Number of people</p>
//                 </div>
//                 <div className="range-bar">
//                     <Step active className="step1">
//                         <Image src={SelectDishes} alt="Select Dishes" style={styles.dish} />
//                         <Label active>Select Dishes</Label>
//                     </Step>
//                     <div className="sep-image">
//                         <Image src={separator} alt="separator" />
//                     </div>
//                     <Step className="step2">
//                         <Image src={SelectDateTime} alt="Select Date & Time" style={styles.dish} />
//                         <Label>Select Date & Time</Label>
//                     </Step>
//                     <div className="sep-image">
//                         <Image src={separator} alt="separator" />
//                     </div>
//                     <Step className="step3">
//                         <Image src={SelectConfirmOrder} alt="Confirm Order" style={styles.dish} />
//                         <Label>Select Confirm Order</Label>
//                     </Step>
//                 </div>
//             </div>
         
//             <div className="order-container chef-bottum">
//                 <Row className="d-flex justify-content-start">
//                     <div style={{ display: "flex", margin: "5px 0 0" }}>
                 
// <div
//   style={{
//     display: "flex",
//     alignItems: "center",
//     width: "100%",
//   }}
// >
//   {!isSearching && (
//     <div style={{ display: "flex", gap: "10px" }}>
//       <Button
//         variant={selected === "veg" ? "success" : "outline-success"}
//         onClick={() => handleSwitchChange("veg")}
//         className="cuisinebtn"
//       >
//         Veg
//       </Button>

//       <Button
//         variant={selected === "non-veg" ? "danger" : "outline-danger"}
//         onClick={() => handleSwitchChange("non-veg")}
//         className="cuisinebtn"
//       >
//         Non-Veg
//       </Button>
//     </div>
//   )}

//   <div
//     className="search-bar-container"
//     style={{
//       flex: 1,
//       marginLeft: isSearching ? 0 : "10px",
//       transition: "all 0.3s ease",
//     }}
//   >
//     <SearchBar
//   searchTerm={searchTerm}
//   setSearchTerm={setSearchTerm}
//   suggestions={suggestions}
//   isSearching={isSearching}   // 🔥 add this
//   onFocus={() => setIsSearching(true)}
// onSelect={(dish) => {
//   setSelectedSearchDishes((prev) => {
//     // 🔥 duplicate avoid
//     if (prev.find((d) => d._id === dish._id)) return prev;
//     return [...prev, dish];
//   });

//   const parentMeal = mealList.find((meal) =>
//     meal.dish.some((d) => d._id === dish._id)
//   );

//   if (parentMeal) {
//     setExpandedCategories((prev) => {
//       if (!prev.includes(parentMeal.mealObject._id)) {
//         return [...prev, parentMeal.mealObject._id];
//       }
//       return prev;
//     });
//   }

//   handleIncreaseQuantity(dish, selectedDishes.includes(dish._id));
//   setIsSearching(false);

//   setTimeout(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, 100);
// }}
// />
//   </div>
// </div>
//                     </div>
//                     <div className="chef-divider" style={{ marginTop: "10px" }}></div>
//                     <div style={{ margin: "10px 0 0 0" }}>
//                         <h1
//                             style={{
//                                 fontSize: "14px",
//                                 color: "#000",
//                                 marginTop: "0px",
//                                 marginBottom: "0",
//                             }}
//                         >
//                             Select Cusinies
//                         </h1>
//                         <ListGroup className="cuisine-list d-flex flex-row flex-wrap justify-content-start">
//                             {cuisines.map((cuisine, index) => (
//                                 <ListGroupItem key={index} className="cuisine-item">
//                                     {renderItem({ item: cuisine })}
//                                 </ListGroupItem>
//                             ))}
//                         </ListGroup>
//                     </div>
//                 </Row>
//                 <div className="chef-divider"></div>
//                 <Row className="mt-1">
//                     <Col>
//                         {selectedCuisines.length > 0 && (
//                             <ListGroup className="dish-list">
//                                 {finalMealList.map((meal) => (
//                                     <div className='w-100' id={meal.mealObject._id}>
//                                         <ListGroupItem key={meal._id} className="dish-item">
//                                             {renderDishItem({ item: meal })}
//                                         </ListGroupItem>
//                                     </div>
//                                 ))}
//                             </ListGroup>
//                         )}
//                     </Col>
//                 </Row>
//                 <Row>
//                     <Col>
//                         <div
//                             style={{
//                                 position: "fixed",
//                                 bottom: 0,
//                                 width: "100%",
//                                 backgroundColor: "#EDEDED",
//                                 borderTop: "1px solid #efefef",
//                                 padding: "15px 0",
//                                 left: "0",
//                             }}
//                         >
//                             <Button
//                                 onClick={() => addDish(selectedDishPrice)}
//                                 style={{
//                                     width: "50%",
//                                     backgroundColor: isDishSelected
//                                         ? "#9252AA"
//                                         : "#F9E9FF",
//                                     borderColor: isDishSelected ? "#9252AA" : "#F9E9FF",
//                                 }}
//                                 disabled={!isDishSelected}
//                                 className="continuebtnchef"
//                             >
//                                 <div
//                                     style={{
//                                         className: "continueButtonLeftText",
//                                         color: isDishSelected ? "white" : "#fff",
//                                     }}
//                                 >
//                                     Continue
//                                 </div>
//                                 <div
//                                     style={{
//                                         className: "continueButtonRightText",
//                                         color: isDishSelected ? "white" : "#fff",
//                                     }}
//                                 >
//                                     {selectedCount} Items
//                                 </div>
//                             </Button>
//                         </div>
//                     </Col>
//                 </Row>
//             </div>
//             {isWarningVisibleForCuisineCount && (<Popup popupMessage={popupMessage} onClose={handleWarningClose} />)}
//             {isWarningVisibleForDishCount && (<Popup popupMessage={popupMessage} onClose={handleWarningClose} />)}
//         </div>
//     )
// }

// const styles = {
//     imageContainer: {
//         position: "relative",
//         width: "270px",
//         backgroundColor: "#fff",
//         marginBottom: 40,
//         boxShadow: "0 6px 16px 0 rgba(0,0,0,.14)",
//         borderRadius: "5px",
//         overflow: "hidden",
//         transition: "transform 0.3s ease-in-out",
//         margin: "10px 12px 20px",
//         padding: "6px 5px 10px",
//     },
//     dish: {
//         width: "32px",
//         height: "32px",
//     },
// };

// export default CreateOrder;


import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { Step, Label } from 'semantic-ui-react';
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Button, Row, Col, Spinner } from "react-bootstrap";
import {
    BASE_URL,
    GET_CUISINE_ENDPOINT,
    API_SUCCESS_CODE,
    GET_MEAL_DISH_ENDPOINT,
} from "../../utils/apiconstants";
import Head from "next/head";
import RectanglePurple from "../../assets/Rectanglepurple.png";
import RectangleWhite from "../../assets/rectanglewhite.png";
import MinusIcon from "../../assets/minus.png";
import PlusIcon from "../../assets/plus.png";
import warningImage from "../../assets/Group.png";
import SkeletonLoader from "../../utils/chefSkeleton";
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
import SearchBar from "@/components/SearchBar";
import axiosApi from "@/utils/axiosApi";
const orangeColor = '#FF6F61';
const defaultColor = '#B0BEC5';

const CreateOrder = ({ 
    history, 
    currentStep,
    initialCuisines = [],
    initialMealList = []
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const viewBottomSheetRef = useRef(null);
    const bottomSheetRef = useRef(null);
    const [orderType, setOrderType] = useState(2);
    const [isDishSelected, setIsDishSelected] = useState(false);
    const [selected, setSelected] = useState("veg");
    const [cuisines, setCuisines] = useState(initialCuisines);
    
    // SSR ke liye pehle cuisine already selected rakha (taaki dishes HTML me aaye)
    const [selectedCuisines, setSelectedCuisines] = useState(
        initialCuisines.length > 0 ? [initialCuisines[0][0]] : []
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
    const [isWarningVisibleForTotalAmount, setWarningVisibleForTotalAmount] = useState(false);
    const [isWarningVisibleForDishCount, setWarningVisibleForDishCount] = useState(false);
    const [isWarningVisibleForCuisineCount, setWarningVisibleForCuisineCount] = useState(false);
    const [isViewAllExpanded, setIsViewAllExpanded] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedSearchDishes, setSelectedSearchDishes] = useState([]);
    const [popupMessage, setPopupMessage] = useState({
        img: "",
        title: "",
        body: "",
        button: "",
    });
    const [searchTerm, setSearchTerm] = useState("");

    // Handler for 'Only Veg' toggle switch
    const handleVegSwitch = () => {
        if (isNonVegSelected) return; // Prevent switching if 'Non-Veg' is selected
        setIsVegSelected(prev => !prev); // Toggle 'Only Veg' state
    };

    // Handler for 'Non-Veg' toggle switch
    const handleNonVegSwitch = () => {
        setIsNonVegSelected(prev => !prev); // Toggle 'Non-Veg' state
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

    // Filter the cuisines based on selected state
    const filteredCuisines = cuisines.filter(cuisine => {
        if (isVegSelected && !isNonVegSelected) {
            return cuisine.type !== 'veg'; // Show only non-veg items if 'Only Veg' is selected
        } else if (!isVegSelected && isNonVegSelected) {
            return cuisine.type !== 'non-veg'; // Show only veg items if 'Non-Veg' is selected
        } else if (isVegSelected && isNonVegSelected) {
            return true; // Show all items if both are selected
        }
        return false; // Show nothing if neither are selected
    });
    const allDishes = mealList.flatMap((meal) => meal.dish);
    const suggestions = allDishes.filter((dish) =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Filter the meal list based on selected state
    const filteredMealList = mealList.filter(meal => {
        if (isVegSelected && !isNonVegSelected) {
            return meal.type !== 'veg'; // Show only non-veg items if 'Only Veg' is selected
        } else if (!isVegSelected && isNonVegSelected) {
            return meal.type !== 'non-veg'; // Show only veg items if 'Non-Veg' is selected
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
                        ({ _id, name }) => [_id, name]
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
    let totalDishPrice = 0;

    // ✅ Only calculate base dish price (NO 700 here)
    selectedDishes.forEach((dishId) => {
        const dish = selectedDishDictionary[dishId];
        if (dish) {
            totalDishPrice += Number(dish.dish_rate) || 0;
        }
    });

    console.log("✅ Total Dish Base Price Before Routing (without 700):", totalDishPrice);

    router.push({
        pathname: '/book-chef-cook-for-party/order-details',
        query: {
            orderType,
            selectedDishDictionary: JSON.stringify(selectedDishDictionary),
            selectedDishPrice: totalDishPrice + 49,
            selectedDishes: JSON.stringify(selectedDishes),
            isDishSelected,
            selectedCount,
        }
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
    useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".search-bar-container")) {
      setIsSearching(false);
    }
  };

  document.addEventListener("click", handleClickOutside);

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, []);

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
const sortedMealList = [...filteredMealList].sort((a, b) => {
  if (selectedSearchDishes.length === 0) return 0;

  const aIndex = selectedSearchDishes.findIndex((selectedDish) =>
    a.dish.some((d) => d._id === selectedDish._id)
  );

  const bIndex = selectedSearchDishes.findIndex((selectedDish) =>
    b.dish.some((d) => d._id === selectedDish._id)
  );

  // 🔥 jisme selected dish hai → wo upar
  if (aIndex !== -1 && bIndex === -1) return -1;
  if (aIndex === -1 && bIndex !== -1) return 1;

  // 🔥 order maintain (jo pehle select hua wo upar)
  if (aIndex !== -1 && bIndex !== -1) {
    return aIndex - bIndex;
  }

  return 0;
});
const matched = [];
const unmatched = [];

filteredMealList.forEach((meal) => {
  const hasMatch = meal.dish.some((dish) =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (hasMatch) matched.push(meal);
  else unmatched.push(meal);
});


const finalMealList = sortedMealList.map((meal) => {
  if (selectedSearchDishes.length === 0) return meal;

  const sortedDishes = [...meal.dish].sort((a, b) => {
    const aIndex = selectedSearchDishes.findIndex((d) => d._id === a._id);
    const bIndex = selectedSearchDishes.findIndex((d) => d._id === b._id);

    if (aIndex !== -1 && bIndex === -1) return -1;
    if (aIndex === -1 && bIndex !== -1) return 1;

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    return 0;
  });

  return {
    ...meal,
    dish: sortedDishes,
  };
});
    if (loading) {
        return <SkeletonLoader loading={true} />;
    };

    return (
        <div className="chef-create-order">
              <Head>
            <title>HORA book-chef-cook-for-party</title>
            <meta 
              name="description" 
              content="🎉 Explore a wide range of stunning decoration designs for every event and party, including 🎂 birthdays, 🧸 kids' parties, 💍 anniversaries, 💃 bachelorette parties, 👶 baby showers, 🍼 naming ceremonies, and 🌙 first nights. Choose your ideal design and book directly through our website for a seamless experience. Need help? Reach out to us at 7338584828 for friendly support and personalised assistance. 😊" 
            />
            <meta 
              name="keywords" 
              content="balloon decoration, birthday decoration, anniversary decoration, haldi mehendi decoration, baby shower decoration, welcome baby decor, room decoration, party decoration" 
            />
            <meta 
              property="og:title" 
              content="HORA Decorations : Professional Balloons & Flowers Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199" 
            />
            <meta 
              property="og:description" 
              content="🎉 Explore a wide range of stunning decoration designs for every event and party, including 🎂 birthdays, 🧸 kids' parties, 💍 anniversaries, 💃 bachelorette parties, 👶 baby showers, 🍼 naming ceremonies, and 🌙 first nights. Choose your ideal design and book directly through our website for a seamless experience. Need help? Reach out to us at 7338584828 for friendly support and personalised assistance. 😊" 
            />
            <meta 
              property="og:image" 
              content="https://horaservices.com/api/uploads/attachment-1706520980436.png" 
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
              content="https://horaservices.com/book-chef-cook-for-party" 
            />
            <meta property="og:type" content="website" />
          </Head>
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
                 
<div
  style={{
    display: "flex",
    alignItems: "center",
    width: "100%",
  }}
>
  {!isSearching && (
    <div style={{ display: "flex", gap: "10px" }}>
      <Button
        variant={selected === "veg" ? "success" : "outline-success"}
        onClick={() => handleSwitchChange("veg")}
        className="cuisinebtn"
      >
        Veg
      </Button>

      <Button
        variant={selected === "non-veg" ? "danger" : "outline-danger"}
        onClick={() => handleSwitchChange("non-veg")}
        className="cuisinebtn"
      >
        Non-Veg
      </Button>
    </div>
  )}

  <div
    className="search-bar-container"
    style={{
      flex: 1,
      marginLeft: isSearching ? 0 : "10px",
      transition: "all 0.3s ease",
    }}
  >
    <SearchBar
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  suggestions={suggestions}
  isSearching={isSearching}   // 🔥 add this
  onFocus={() => setIsSearching(true)}
onSelect={(dish) => {
  setSelectedSearchDishes((prev) => {
    // 🔥 duplicate avoid
    if (prev.find((d) => d._id === dish._id)) return prev;
    return [...prev, dish];
  });

  const parentMeal = mealList.find((meal) =>
    meal.dish.some((d) => d._id === dish._id)
  );

  if (parentMeal) {
    setExpandedCategories((prev) => {
      if (!prev.includes(parentMeal.mealObject._id)) {
        return [...prev, parentMeal.mealObject._id];
      }
      return prev;
    });
  }

  handleIncreaseQuantity(dish, selectedDishes.includes(dish._id));
  setIsSearching(false);

  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 100);
}}
/>
  </div>
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
                                {finalMealList.map((meal) => (
                                    <div className='w-100' id={meal.mealObject._id}>
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

// ====================== SSR ======================
export async function getServerSideProps(context) {
  let initialCuisines = [];
  let initialMealList = [];

  try {
    // 1. Fetch Cuisines
    const cuisineRes = await axiosApi.post(
      BASE_URL + GET_CUISINE_ENDPOINT,
      { type: "cuisine" },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (cuisineRes.status === API_SUCCESS_CODE) {
      initialCuisines = cuisineRes.data.data.configuration.map(
        ({ _id, name }) => [_id, name]
      );
    }

    // 2. Initial meals (pehle cuisine + default veg)
    if (initialCuisines.length > 0) {
      const firstCuisineId = initialCuisines[0][0];

      const mealRes = await axiosApi.post(
        BASE_URL + GET_MEAL_DISH_ENDPOINT,
        {
          cuisineId: [firstCuisineId],
          is_dish: 1, // default veg
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
      initialCuisines,
      initialMealList,
    },
  };
}

export default CreateOrder;
