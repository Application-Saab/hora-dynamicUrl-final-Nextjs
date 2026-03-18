export const getCancellationPolicy = (orderType) => [
  `If the order is beyond 48 Hours: You are eligible for a 100% refund of the advance payment.`,
  `If the order is cancelled more than 24 hours before the scheduled delivery: You will not receive a refund of the advance payment.`,
  `If the order is cancelled within 24 hours: The full advance amount will be non-refundable, and 100% of the payment for ${
    orderType === 8 ? "Photography" : "Decoration"
  } has to be paid by the customer.`,
];

export  const infoList = [
    "Our Supply Team will contact you 1 day prior to your order date to confirm all details and customizations, ensuring smooth communication and flawless execution.",
    "The scheduled time slots for decoration cannot be changed on the day of order fulfillment.",
    "A power socket near the decoration area is required. If unavailable, please arrange for appropriate extensions in advance.",
    "Any rented items used for decoration will be collected within 24 hours of order completion. Please ensure accessibility for timely pickup. 🚚"
  ];
export const foodDeliveryInclusionItems = [
    "Food Delivery at Door-Step",
    "Free Delivery",
    "Hygienically Packed boxes",
    "Freshly Cooked Food",
    "Quality Disposable set of Plates & Spoons & Forks",
    "Water bottles (small bottles equal to number of people)"
  ];
export const cateringInclusionItems = [
    "Well Groomed Waiters (2 Nos)",
    "Bone-china Crockery & Quality disposal for loose items.",
    "Transport (to & fro)",
    "Dustbin with Garbage bag",
    "Head Mask for waiters & chefs",
    "Tandoor/Other cooking Utensiles",
    "Chafing Dish",
    "Cocktail Napkins",
    "2 Chef",
    "Water Can (Bisleri)(20 litres)",
    "Hand gloves"
  ];
export const chefInclusionItems = [
    "Professional Chef For Select Dishes",
    "Fresh Cooking at your Location",
    "Chef service available for up to 5 hours after arrival ",
    "All dishes prepared as per selected menu",
    "Hygiene & quality maintained throughout the service"
  ];
export const foodDeliveryPolicy = [
    "If the order is not assigned to the kitchen: You are eligible for a 100% refund of the advance payment.",
    "If the order is cancelled more than 24 hours before the scheduled delivery: You will receive a 50% refund of the advance payment.",
    "If the order is cancelled within 24 hours of the scheduled delivery: The full advance amount will be non-refundable, and 100% of the payment is required.",
  ];
export const chefPolicy = [
    "Till the order is not assign to the service provider , 100% of the amount will be refunded, othewise 50%of the advance will be deducted as a cancellation charges to componsate the service provider.",
    "The order cannot be edited after paying the advance customers can cancel the order and replace it with a new order with the required changes.",
  ];