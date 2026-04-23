import PACKAGE1 from "@/assets/venueimages/silver.jpeg";
export const ZURI_PACKAGES = [
  {
    id: 1,
    name: "Buffet Dinner ",
    subtitle:"  2 veg starter • 2 Non Veg starter • 3 veg Salads • 1 Veg soup • 2 Veg main course •2 Non veg main course (Fish&chicken)• 1 Dal or sambhar • 2 Assorted indian breads • 1 flavoured rice • + 1 Steamed rice Accompaniments pickle • papad • curd Rice Green salad & Spicy Rogan,2 Desserts, 1 ice cream ",
    price: "₹ 1950/-",
    tag: "Plus Taxes",
    tag: "Plus Taxes",
    type: "veg",
    typeLabel: "Veg",
    image: PACKAGE1,
    includes: {
      appetisers: {
        veg: [
          "Hara Bhara Kebab","Dahi Ke Kebab","Aloo Mutter Ki Tikki","Vegetable Sheekh Kebab",
          "Mini Masala Pungulu","Masala Wada","Mirchi Bhaji","Cauliflower 65",
          "Vegetable Manchurian","Crispy Fried Vegetables","Vegetable Spring Roll",
          "Chilli Garlic Potato","Cottage Cheese & Corn Nuggets","Falafel",
          "Spicy Cheese Balls","Vegetable Bullets"
        ],
        nonVeg: [],
        note: "Choose any 2 Veg Starters"
      },

      soups: [
        "Lemon Coriander Soup","Sweet Corn Soup","Hot & Sour Soup",
        "Noodle Soup","Burnt Garlic Vegetable Soup","Cream of Tomato Soup"
      ],
      soupsNote: "Choose any 1 Veg Soup",

      salads: [
        "Garden Green Salad","Russian Salad","Greek Salad","Mexican Salad",
        "Aloo Papdi Chaat","Channa Chaat","Thai Salad"
      ],
      saladsNote: "Choose any 3 Salads",

      mainCourse: {
        items: [
          "Paneer Butter Masala","Palak Paneer","Kadhai Paneer",
          "Vegetable Kofta Curry","Mixed Vegetable Korma","Bhindi Do Pyaza"
        ],
        note: "Choose any 2 Veg Main Course"
      },

      dal: ["Dal Tadka","Dal Makhani","Dal Panchratan"],
      dalNote: "Choose any 1 Dal",

      rice: ["Jeera Rice","Vegetable Pulao","Veg Biryani"],
      riceNote: "Choose any 1 Flavored Rice",

      bread: ["Tandoori Roti","Naan"],
      breadNote: "Choose any 1 Bread",

      desserts: ["Gulab Jamun","Rasgulla","Gajar Halwa","Fruit Salad"],
      dessertsNote: "Choose any 2 Desserts",

      defaultIncludes: ["Papad","Pickle","Curd"]
    }
  },];



export const ZURI_TERMS = [
  {
    title: "Note",
    icon: "📌",
    key: "note",
    points: [
      "Live counters will be charged between INR 350/- + taxes to INR 450/- + taxes.",
      "Rates valid for 48 hours only.",
      "Billing based on actual plate count.",
      "Music licenses (PPL, IPRS, Novex) required."
    ]
  },
  {
    title: "Vendor Policy",
    icon: "🏢",
    key: "vendorPolicy",
    points: [
      "Security deposit of INR 10,000 required.",
      "Ensures compliance and covers damages.",
      "Refundable if terms are met."
    ]
  },
  {
    title: "Billing Instructions",
    icon: "🧾",
    key: "billingInstructions",
    points: [
      "50% at confirmation",
      "50% before 10 days of event"
    ]
  }
];