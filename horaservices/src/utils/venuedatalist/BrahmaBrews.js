import PACKAGE1 from "@/assets/venueimages/silver.jpeg";
export const BRAHMA_BREWS = [
  {
    id: 1,
    name: "Party-Celebration",
    subtitle: "3 Veg starters • 3 Non Veg starters • 1 Veg Pizza • 1 Non Veg Pizza • 2 Veg main course • 1 Dal • 1 Non Veg main course • 1 Veg Rice/Noodles/Pasta • 1 Non Veg Rice/Noodles/Pasta • Tandoori Roti • Tandoori Naan • Steamed Rice • Curd Rice • Raita • Green Salad • Beverages (Coke, Sprite, Fresh Lime Soda, Fresh Lime Water) • 1 Ice cream • 2 Desserts",
    price: "₹ 1349/-",
    tag: "All Inclusive",
    type: "nonveg",
    typeLabel: "Veg + Non Veg",
    image: PACKAGE1,
    includes: {
      appetisers: {
        veg: [
          "Paneer Tikka", "Achari Aloo Tikka", "Cheesy-Cheesy Cottage Melt",
          "Hara Bhara Kebab", "Charcoal Mushroom Tikka", "Paneer Ghee Roast",
          "Mushroom Pepper Dry", "South Indian Gobi 65", "Onion Palak Pakoda",
          "Sabudana Vada", "Moong Dal Vada", "Vegetable Ball Manchurian",
          "Salt and Pepper Baby Corn", "Paneer Chilli", "Crispy Corn Salt & Pepper",
          "Gobi Manchurian", "Jalapeno Cheese Poppers", "Brahma House Crispy Onion Rings",
          "Macaroni Cheese Balls", "Spicy Potato Wedges"
        ],
        nonVeg: [
          "Chicken Banjara Kebab", "Achari Chicken Kebab", "Yummy Chicken Seekh",
          "Murgh Malai Kebab", "Ajwaini Fish Tikka", "Local Chicken Kebab",
          "South Indian Chicken Varuval", "Andhra Chilli Chicken Dry", "Pepper Chicken Fry",
          "Fish Koliwada", "OG Chicken 65", "Hot Basil Fish",
          "Red Dragon Chicken", "Roasted Chicken Chili", "Thai Basil Wings",
          "Hot Chili Wings", "BBQ Chicken Wings", "Peri-Peri Chicken Wings",
          "Chilli Cilantro Wings"
        ],
        note: "Choose any 3 Veg Starters & 3 Non Veg Starters"
      },
      pizza: {
        veg: ["Margherita", "Garden City", "Spicy Affair", "Pesto Fresco"],
        nonVeg: ["Red Rooster", "Smoke House", "Chicken Tikka", "BBQ Chicken"],
        note: "Choose any 1 Veg Pizza & 1 Non Veg Pizza"
      },
      mainCourse: {
        veg: [
          "Kadai Vegetables", "Veg Kolhapuri", "Miloni Tarakari",
          "Palak and Khumb Masala", "Paneer Khurchan", "Paneer Lababdar",
          "South Indian Veg Gassi", "Thai Green Curry Veg",
          "Stir Fried Veggies and Water Chestnuts",
          "Hot & Sour Tofu with Vegetables Sauce",
          "Broccoli Baby Corn Hot Bean Sauce"
        ],
        nonVeg: [
          "Handi Ka Bhuna Murgh", "Methi Murgh Masala", "Mumbai Butter Chicken",
          "Chicken Kolhapuri", "Murgh Hara Pyaaz", "South Indian Chicken Gassi",
          "Nilgiri Chicken Korma", "Malabar Fish Curry", "Nadan Chicken Curry",
          "Mangalorean Fish Curry", "Thai Green Curry Chicken",
          "Stir Fried Broccoli with Chicken", "Chicken & Veggies Schezwan Sauce"
        ],
        note: "Choose any 2 Veg Main Course (includes 1 Dal) & 1 Non Veg Main Course"
      },
      dal: ["Dal Tadka", "Dal Makhani"],
      dalNote: "Included as part of Veg Main Course selection",
      rice: {
        veg: [
          "Vegetable Biriyani", "Green Peas Pulao", "Burnt Garlic Fried Rice",
          "Hakka Noodles", "Pasta – Penne Arrabbiata Sauce with Vegetables",
          "Pasta – Penne Alfredo Sauce with Vegetables"
        ],
        nonVeg: [
          "Chicken Biriyani", "Chicken Fried Rice", "Chicken Hakka Noodles",
          "Egg Noodles", "Pasta – Penne Arrabbiata Sauce with Chicken",
          "Pasta – Penne Alfredo Sauce with Chicken"
        ],
        note: "Choose any 1 Veg Rice/Noodles/Pasta & 1 Non Veg Rice/Noodles/Pasta"
      },
      desserts: [
        "Mini Milky-Milky Way Cake", "Mini Opera Gateaux", "Gulab Jamun",
        "Moong Dal Halwa", "Gajar Ka Halwa", "Chocolate Brownie"
      ],
      dessertsNote: "Choose any 2 Desserts",
      iceCream: ["Vanilla", "Chocolate", "Strawberry"],
      iceCreamNote: "Choose any 1 Ice Cream",
      defaultIncludes: [
        "Tandoori Roti", "Tandoori Naan", "Steamed Rice", "Curd Rice",
        "Raita", "Green Salad", "Papad", "Pickle",
        "Coke", "Sprite", "Fresh Lime Soda", "Fresh Lime Water"
      ]
    }
  }
];