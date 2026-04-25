import SLIVER from "@/assets/venueimages/silver.jpeg";
import GOLD from "@/assets/venueimages/Gold.png";
import PLATINUM from "@/assets/venueimages/non-veg.jpeg";
export const ARBOR_BREWING = [
  {
    id: 1,
    name: "Silver",
    subtitle: "2 Veg starters • 2 Non Veg starters • 1 Veg main course • 1 Non Veg main course • 1 Veg pizza • 1 Non Veg pizza • 1 Dessert • 1 Ice cream",
    price: "₹ 1000/-",
    tag: "Plus Taxes",
    type: "nonveg",
    typeLabel: "Veg + Non Veg",
    image: SLIVER,
    includes: {
      appetisers: {
        veg: [
          "Jalapeno Corn Cheese Ball", "Grilled Cottage Cheese",
          "Spinach & Artichoke Stuffed Mushroom", "Honey Chilli Crispy Vegetable",
          "Cauliflower & Baby Corn Manchurian", "Mexican Tostadas Bites",
          "Fancy Potato Skins", "Hummus with Pita Chips",
          "Spinach Artichoke Dip", "Mini Cheese Quesadillas",
          "Cheese Garlic Breads", "Corn & Cheese Croquette",
          "Veg Croquette", "Falafels", "Veg Mexican Tarts",
          "Veg Spring Roll", "Baby Corn Salt and Pepper", "Beer Batter Onion Rings"
        ],
        nonVeg: [
          "Five Spice Chicken Bites", "Chicken Drumstick",
          "Flaming Chicken", "Sticky Chicken Wings",
          "Mini Chicken Quesadilla", "Moroccan Chicken Strips",
          "Honey Garlic Chicken", "Crispy Chicken Nuggets",
          "Chicken Spring Roll", "Pulled Chicken Wanton Cup",
          "Cajun Chicken Finger", "Chicken & Cheese Croquette",
          "Chicken Roll", "Chicken Salt & Pepper",
          "Pulled Chicken Tostadas", "Mexican Chicken Tart",
          "Thai Pai Chicken", "Chili Basil Chicken",
          "Leefu Chicken", "Chicken Slider",
          "Citrus Marinated Fish Finger", "Chilly Fish",
          "Cajun Fish Nuggets", "Fish Salt & Pepper",
          "Pan Fried Ginger Fish", "Fish Butter Garlic",
          "Crispy Ginger Soya Fish", "Grilled Peri Peri Fish",
          "Fish & Cheese Croquette", "Fish Teriyaki with Sesame Seeds"
        ],
        note: "Choose any 2 Veg Starters & 2 Non Veg Starters"
      },

      pizza: {
        veg: ["Mushroom Royal", "Garden", "Greek Passion", "Peri Peri Paneer"],
        nonVeg: ["Pepperoni", "Spicy BBQ Chicken", "Buffalo Soldier"],
        note: "Choose any 1 Veg Pizza & 1 Non Veg Pizza"
      },

      mainCourse: {
        veg: [
          "Veg Ball Manchurian", "Grilled Cottage Cheese with Spanish Rice",
          "Stir Fried Green", "Sweet & Sour Vegetable",
          "Veg Red Thai Curry", "Veg Green Thai Curry",
          "Kung Pao Cauliflower", "Sichuan Paneer",
          "Seasonal Vegetable in Hot Garlic", "Macaroni & Cheese",
          "Veg Lasagne", "Vegetable Moussaka"
        ],
        nonVeg: [
          "Chicken & Spinach Lasagna", "Red Thai Curry with Steam Rice",
          "Chicken Fajitas", "Grilled Jerk Chicken with Potato Mash & Grilled Vegetables",
          "Slice Fish in Oyster Chilly Sauce", "Stir Fried Chicken in Soya Ginger Sauce",
          "Grilled Fish with Lemon Butter Sauce", "Lamb Shepherd's Pie",
          "Lamb Moussaka", "Prawns Thai Curry",
          "Prawns Fajita", "Prawns in Oyster Chilly Sauce",
          "Irish Lamb Stew", "Lamb Lasagne",
          "Spaghetti with Bolognaise Sauce"
        ],
        note: "Choose any 1 Veg Main Course & 1 Non Veg Main Course"
      },

      desserts: [
        "Chocolate Mousse", "Chocolate Brownie with Ice Cream",
        "Banoffee Pie Tart", "Assorted Pastries",
        "Apple Pie", "Chocolate & Walnut Pudding",
        "Lemon Tart", "Milk Chocolate Crème Catalan"
      ],
      dessertsNote: "Choose any 1 Dessert",

      iceCream: ["Vanilla", "Chocolate", "Strawberry"],
      iceCreamNote: "Choose any 1 Ice Cream",

      defaultIncludes: []
    }
  },

  {
    id: 2,
    name: "Gold",
    subtitle: "2 Veg starters • 2 Non Veg starters • 2 Veg main courses • 2 Non Veg main courses • 1 Veg pizza • 1 Non Veg pizza • 2 Desserts • 1 Ice cream",
    price: "₹ 1200/-",
    tag: "Plus Taxes",
    type: "nonveg",
    typeLabel: "Veg + Non Veg",
    image: GOLD,
    includes: {
      appetisers: {
        veg: [
          "Jalapeno Corn Cheese Ball", "Grilled Cottage Cheese",
          "Spinach & Artichoke Stuffed Mushroom", "Honey Chilli Crispy Vegetable",
          "Cauliflower & Baby Corn Manchurian", "Mexican Tostadas Bites",
          "Fancy Potato Skins", "Hummus with Pita Chips",
          "Spinach Artichoke Dip", "Mini Cheese Quesadillas",
          "Cheese Garlic Breads", "Corn & Cheese Croquette",
          "Veg Croquette", "Falafels", "Veg Mexican Tarts",
          "Veg Spring Roll", "Baby Corn Salt and Pepper", "Beer Batter Onion Rings"
        ],
        nonVeg: [
          "Five Spice Chicken Bites", "Chicken Drumstick",
          "Flaming Chicken", "Sticky Chicken Wings",
          "Mini Chicken Quesadilla", "Moroccan Chicken Strips",
          "Honey Garlic Chicken", "Crispy Chicken Nuggets",
          "Chicken Spring Roll", "Pulled Chicken Wanton Cup",
          "Cajun Chicken Finger", "Chicken & Cheese Croquette",
          "Chicken Roll", "Chicken Salt & Pepper",
          "Pulled Chicken Tostadas", "Mexican Chicken Tart",
          "Thai Pai Chicken", "Chili Basil Chicken",
          "Leefu Chicken", "Chicken Slider",
          "Citrus Marinated Fish Finger", "Chilly Fish",
          "Cajun Fish Nuggets", "Fish Salt & Pepper",
          "Pan Fried Ginger Fish", "Fish Butter Garlic",
          "Crispy Ginger Soya Fish", "Grilled Peri Peri Fish",
          "Fish & Cheese Croquette", "Fish Teriyaki with Sesame Seeds"
        ],
        note: "Choose any 2 Veg Starters & 2 Non Veg Starters"
      },

      pizza: {
        veg: ["Mushroom Royal", "Garden", "Greek Passion", "Peri Peri Paneer"],
        nonVeg: ["Pepperoni", "Spicy BBQ Chicken", "Buffalo Soldier"],
        note: "Choose any 1 Veg Pizza & 1 Non Veg Pizza"
      },

      mainCourse: {
        veg: [
          "Veg Ball Manchurian", "Grilled Cottage Cheese with Spanish Rice",
          "Stir Fried Green", "Sweet & Sour Vegetable",
          "Veg Red Thai Curry", "Veg Green Thai Curry",
          "Kung Pao Cauliflower", "Sichuan Paneer",
          "Seasonal Vegetable in Hot Garlic", "Macaroni & Cheese",
          "Veg Lasagne", "Vegetable Moussaka"
        ],
        nonVeg: [
          "Chicken & Spinach Lasagna", "Red Thai Curry with Steam Rice",
          "Chicken Fajitas", "Grilled Jerk Chicken with Potato Mash & Grilled Vegetables",
          "Slice Fish in Oyster Chilly Sauce", "Stir Fried Chicken in Soya Ginger Sauce",
          "Grilled Fish with Lemon Butter Sauce", "Lamb Shepherd's Pie",
          "Lamb Moussaka", "Prawns Thai Curry",
          "Prawns Fajita", "Prawns in Oyster Chilly Sauce",
          "Irish Lamb Stew", "Lamb Lasagne",
          "Spaghetti with Bolognaise Sauce"
        ],
        note: "Choose any 2 Veg Main Course & 2 Non Veg Main Course"
      },

      desserts: [
        "Chocolate Mousse", "Chocolate Brownie with Ice Cream",
        "Banoffee Pie Tart", "Assorted Pastries",
        "Apple Pie", "Chocolate & Walnut Pudding",
        "Lemon Tart", "Milk Chocolate Crème Catalan"
      ],
      dessertsNote: "Choose any 2 Desserts",

      iceCream: ["Vanilla", "Chocolate", "Strawberry"],
      iceCreamNote: "Choose any 1 Ice Cream",

      defaultIncludes: []
    }
  },

  {
    id: 3,
    name: "Premium",
    subtitle: "3 Veg starters • 2 Non Veg starters • 2 Veg main courses • 2 Non Veg main courses • 1 Veg pizza • 1 Non Veg pizza • 2 Desserts • 1 Ice cream",
    price: "₹ 1500/-",
    tag: "Plus Taxes",
    type: "nonveg",
    typeLabel: "Veg + Non Veg",
    image: PLATINUM,
    includes: {
      appetisers: {
        veg: [
          "Jalapeno Corn Cheese Ball", "Grilled Cottage Cheese",
          "Spinach & Artichoke Stuffed Mushroom", "Honey Chilli Crispy Vegetable",
          "Cauliflower & Baby Corn Manchurian", "Mexican Tostadas Bites",
          "Fancy Potato Skins", "Hummus with Pita Chips",
          "Spinach Artichoke Dip", "Mini Cheese Quesadillas",
          "Cheese Garlic Breads", "Corn & Cheese Croquette",
          "Veg Croquette", "Falafels", "Veg Mexican Tarts",
          "Veg Spring Roll", "Baby Corn Salt and Pepper", "Beer Batter Onion Rings"
        ],
        nonVeg: [
          "Five Spice Chicken Bites", "Chicken Drumstick",
          "Flaming Chicken", "Sticky Chicken Wings",
          "Mini Chicken Quesadilla", "Moroccan Chicken Strips",
          "Honey Garlic Chicken", "Crispy Chicken Nuggets",
          "Chicken Spring Roll", "Pulled Chicken Wanton Cup",
          "Cajun Chicken Finger", "Chicken & Cheese Croquette",
          "Chicken Roll", "Chicken Salt & Pepper",
          "Pulled Chicken Tostadas", "Mexican Chicken Tart",
          "Thai Pai Chicken", "Chili Basil Chicken",
          "Leefu Chicken", "Chicken Slider",
          "Citrus Marinated Fish Finger", "Chilly Fish",
          "Cajun Fish Nuggets", "Fish Salt & Pepper",
          "Pan Fried Ginger Fish", "Fish Butter Garlic",
          "Crispy Ginger Soya Fish", "Grilled Peri Peri Fish",
          "Fish & Cheese Croquette", "Fish Teriyaki with Sesame Seeds"
        ],
        note: "Choose any 3 Veg Starters & 2 Non Veg Starters"
      },

      pizza: {
        veg: ["Mushroom Royal", "Garden", "Greek Passion", "Peri Peri Paneer"],
        nonVeg: ["Pepperoni", "Spicy BBQ Chicken", "Buffalo Soldier"],
        note: "Choose any 1 Veg Pizza & 1 Non Veg Pizza"
      },

      mainCourse: {
        veg: [
          "Veg Ball Manchurian", "Grilled Cottage Cheese with Spanish Rice",
          "Stir Fried Green", "Sweet & Sour Vegetable",
          "Veg Red Thai Curry", "Veg Green Thai Curry",
          "Kung Pao Cauliflower", "Sichuan Paneer",
          "Seasonal Vegetable in Hot Garlic", "Macaroni & Cheese",
          "Veg Lasagne", "Vegetable Moussaka"
        ],
        nonVeg: [
          "Chicken & Spinach Lasagna", "Red Thai Curry with Steam Rice",
          "Chicken Fajitas", "Grilled Jerk Chicken with Potato Mash & Grilled Vegetables",
          "Slice Fish in Oyster Chilly Sauce", "Stir Fried Chicken in Soya Ginger Sauce",
          "Grilled Fish with Lemon Butter Sauce", "Lamb Shepherd's Pie",
          "Lamb Moussaka", "Prawns Thai Curry",
          "Prawns Fajita", "Prawns in Oyster Chilly Sauce",
          "Irish Lamb Stew", "Lamb Lasagne",
          "Spaghetti with Bolognaise Sauce"
        ],
        note: "Choose any 2 Veg Main Course & 2 Non Veg Main Course"
      },

      desserts: [
        "Chocolate Mousse", "Chocolate Brownie with Ice Cream",
        "Banoffee Pie Tart", "Assorted Pastries",
        "Apple Pie", "Chocolate & Walnut Pudding",
        "Lemon Tart", "Milk Chocolate Crème Catalan"
      ],
      dessertsNote: "Choose any 2 Desserts",

      iceCream: ["Vanilla", "Chocolate", "Strawberry"],
      iceCreamNote: "Choose any 1 Ice Cream",

      defaultIncludes: []
    }
  },
];

export const ARBOR_TERMS = [
  {
    title: "General",
    icon: "📋",
    key: "general",
    points: [
      "Final guest count as determined by Arbor management will be considered final.",
      "Last order for food is at 11:30 PM and for drinks at 12:00 AM.",
      "Any items ordered outside the selected package will be charged as per à la carte pricing.",
      "Food and beverages included in the package cannot be packed or taken away.",
      "As per government regulations, all guests must vacate the premises by 12:30 AM.",
      "Package can be extended at an additional 30% cost per hour per person (excluding taxes)."
    ]
  },
  {
    title: "Beverages",
    icon: "🍸",
    key: "beverages",
    points: [
      "Outside beverages are strictly not allowed.",
      "All beverages must be consumed within the Arbor premises.",
      "Liquor service will not be permitted after 12:15 AM as per excise laws."
    ]
  },
  {
    title: "Taxes",
    icon: "💰",
    key: "taxes",
    points: [
      "GST will be applicable as per government regulations.",
      "Applicable taxes at the time of the event will be charged irrespective of current quotations."
    ]
  },
  {
    title: "Payment Terms",
    icon: "💳",
    key: "payment",
    points: [
      "A non-refundable deposit of 50% is required to confirm the booking at least 7 days prior to the event.",
      "The event will not be confirmed until the advance payment is received.",
      "Final bill must be settled immediately after the event via cash or credit card.",
      "Cheques are not accepted unless prior credit arrangements are approved with a valid purchase order.",
      "Arbor reserves the right to cancel bookings if the advance is not paid by the due date."
    ]
  },
  {
    title: "Cancellation Policy",
    icon: "❌",
    key: "cancellation",
    points: [
      "Once the agreement is signed, the party is liable for full payment as per agreed terms.",
      "In case of cancellation after confirmation, the advance amount will be forfeited."
    ]
  },
  {
    title: "Special Notes",
    icon: "⚠️",
    key: "special",
    points: [
      "Service may be refused to guests who appear intoxicated.",
      "Management reserves the right to ask guests to leave in case of inappropriate behavior.",
      "Arbor is not responsible for any loss, theft, or damage to personal belongings."
    ]
  }
];