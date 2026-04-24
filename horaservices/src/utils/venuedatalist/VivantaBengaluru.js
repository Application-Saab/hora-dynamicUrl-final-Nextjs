import PACKAGE1 from "@/assets/venueimages/silver.jpeg";
export const VIVANTA_BENGALURU = [
  {
    id: 1,
    name: "Dinner Session",
    subtitle: "2 Veg starters • 2 Non Veg starters • 1 Veg soup • 3 Salads • 3 Veg main courses • 2 Non Veg main courses • 1 Dal • 1 Rice • Assorted Indian breads • Papad / Pickle / Chutney • 1 Yogurt • 3 Desserts",
    price: "₹ 5400/-",
    tag: "Plus Taxes",
    type: "nonveg",
    typeLabel: "Veg + Non Veg",
    image: PACKAGE1,
    includes: {
      appetisers: {
        veg: [
          "Hara Bhara Kebab", "Dahi Ke Kebab", "Aloo Mutter Ki Tikki", "Vegetable Sheekh Kebab",
          "Mini Masala Pungulu", "Masala Wada", "Mirchi Bhaji", "Cauliflower 65",
          "Vegetable Manchurian", "Crispy Fried Vegetables", "Vegetable Spring Roll",
          "Chilli Garlic Potato", "Cottage Cheese & Corn Nuggets", "Falafel",
          "Spicy Cheese Balls", "Vegetable Bullets"
        ],
        nonVeg: [ "Chicken Banjara Kebab", "Achari Chicken Kebab", "Yummy Chicken Seekh",
          "Murgh Malai Kebab", "Ajwaini Fish Tikka", "Local Chicken Kebab",
          "South Indian Chicken Varuval", "Andhra Chilli Chicken Dry", "Pepper Chicken Fry",
          "Fish Koliwada", "OG Chicken 65", "Hot Basil Fish",
          "Red Dragon Chicken", "Roasted Chicken Chili", "Thai Basil Wings",
          "Hot Chili Wings", "BBQ Chicken Wings", "Peri-Peri Chicken Wings",
          "Chilli Cilantro Wings"],
        note: "Choose any 2 Veg Starters & 2 Non Veg Starters"
      },

      soups: [
        "Lemon Coriander Soup", "Sweet Corn Soup", "Hot & Sour Soup",
        "Noodle Soup", "Burnt Garlic Vegetable Soup", "Cream of Tomato Soup"
      ],
      soupsNote: "Choose any 1 Veg Soup",

      salads: [
        "Garden Green Salad", "Russian Salad", "Greek Salad", "Mexican Salad",
        "Aloo Papdi Chaat", "Channa Chaat", "Thai Salad"
      ],
      saladsNote: "Choose any 3 Salads",

      mainCourse: {
        veg: [
          "Paneer Butter Masala", "Palak Paneer", "Kadhai Paneer",
          "Vegetable Kofta Curry", "Mixed Vegetable Korma", "Bhindi Do Pyaza"
        ],
        nonVeg: [ "Handi Ka Bhuna Murgh", "Methi Murgh Masala", "Mumbai Butter Chicken",
          "Chicken Kolhapuri", "Murgh Hara Pyaaz", "South Indian Chicken Gassi",
          "Nilgiri Chicken Korma", "Malabar Fish Curry", "Nadan Chicken Curry",
          "Mangalorean Fish Curry", "Thai Green Curry Chicken",
          "Stir Fried Broccoli with Chicken", "Chicken & Veggies Schezwan Sauce"],
        note: "Choose any 3 Veg Main Course & 2 Non Veg Main Course"
      },

      dal: ["Dal Tadka", "Dal Makhani", "Dal Panchratan"],
      dalNote: "Choose any 1 Dal",

      rice: ["Jeera Rice", "Vegetable Pulao", "Veg Biryani"],
      riceNote: "Choose any 1 Rice",

      bread: ["Tandoori Roti", "Naan"],
      breadNote: "Assorted Indian Breads",

      desserts: ["Gulab Jamun", "Rasgulla", "Gajar Halwa", "Fruit Salad"],
      dessertsNote: "Choose any 3 Desserts",

      defaultIncludes: ["Papad", "Pickle", "Chutney", "Yogurt"]
    }
  },
];
