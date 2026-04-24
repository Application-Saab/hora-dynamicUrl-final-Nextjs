import PACKAGE1 from "@/assets/venueimages/silver.jpeg";
export const HITLON_PACKAGES = [
{
  id: 1,
  name: "Set Menu",
  subtitle: "1 Veg soup • 1 Non Veg soup • 2 Veg starters • 2 Non Veg starters • 1 Veg salad • 1 Non Veg salad • 4 Veg main course • 3 Non Veg main courses • 1 Veg Rice • 1 Non Veg Biryani • 1 Dal • 4 Desserts",
  price: "₹ 2500/-",
  tag: "Plus Taxes",
  type: "nonveg",
  typeLabel: "Veg + Non Veg",
  image: PACKAGE1,
  includes: {
    soups: {
      veg: ["Minestrone Veg Soup"],
      nonVeg: ["Hot & Sour Chicken Soup"],
      note: "1 Veg Soup & 1 Non Veg Soup — Served"
    },

    appetisers: {
      veg: ["Bharwa Mushroom", "Kung Pao Cottage Cheese"],
      nonVeg: ["Achari Fish Tikka", "Butter Milk Fried Chicken"],
      note: "2 Veg Starters & 2 Non Veg Starters — Served"
    },

    salads: {
      veg: ["Watermelon And Feta Salad"],
      nonVeg: ["Chicken Caesar Salad"],
      note: "1 Veg Salad & 1 Non Veg Salad — Served"
    },

    mainCourse: {
      veg: [
        "Fussili Ala Tartuffe",
        "Chilly Garlic Noodle Veg",
        "Wok Tossed Asian Greens and Vegetable",
        "Aloo Gobi Adraki"
      ],
      nonVeg: [
        "Tamda Rassa",
        "Chinna Vang Yam Meen Kozhambu",
        "Stir Fry Chicken and Beans in Black Bean Sauce"
      ],
      note: "4 Veg Main Course & 3 Non Veg Main Course — Served"
    },

    dal: ["Langar Wali Dal"],
    dalNote: "Served",

    rice: {
      veg: ["Awadhi Veg Biryani"],
      nonVeg: ["Dindigul Chicken Biryani"],
      note: "1 Veg Rice & 1 Non Veg Biryani — Served"
    },

    bread: ["Assorted Breads"],
    breadNote: "Served",

    desserts: [
      "Red Velvet Pastry",
      "Chocolate Ganache Pastry",
      "Gulab Jamun with Vanilla Ice Cream"
    ],
    dessertsNote: "Served",

    defaultIncludes: ["Steam Rice"]
  }
},];