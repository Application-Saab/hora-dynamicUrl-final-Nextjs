import PACKAGE1 from "@/assets/venueimages/silver.jpeg";
import PACKAGE2 from "@/assets/venueimages/Gold.png";
import PACKAGE3 from "@/assets/venueimages/non-veg.jpeg";
import PACKAGE4 from "@/assets/venueimages/non-vegetarindeluxe.webp";
import PACKAGE5 from "@/assets/venueimages/venue.jpeg";
import PACKAGE6 from "@/assets/venueimages/vegetarian.webp";

export const ICON_PREMIER_PACKAGES = [
  {
    id: 1,
    name: "EXOTIC ",
    subtitle:
      "1 Veg Soup • 2 Salads • 2 Veg Starters • 2 Veg Main Course • 1 Dal • 1 Flavored Rice • 1 Bread • Papad, Pickle, Curd • 2 Desserts",
    price: "₹ 899/-",
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
      saladsNote: "Choose any 2 Salads",

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
  },

  {
    id: 2,
    name: "PREMIUM ",
    subtitle:
      "2 Veg Soup • 2 Salads • 2 Veg Starters • 3 Veg Main Course • 1 Dal • 1 Flavored Rice • 1 Bread • Papad, Pickle, Curd • 2 Desserts",
    price: "₹ 999/-",
    tag: "Plus Taxes",
    type: "veg",
    typeLabel: "Veg",
    image: PACKAGE2,
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
      soupsNote: "Choose any 2 Veg Soup",

      salads: [
       "Garden Green Salad","Russian Salad","Greek Salad","Mexican Salad",
        "Aloo Papdi Chaat","Channa Chaat","Thai Salad"
      ],
      saladsNote: "Choose any 2 Salads",

      mainCourse: {
        items: [
            "Paneer Butter Masala","Palak Paneer","Kadhai Paneer",
          "Vegetable Kofta Curry","Mixed Vegetable Korma","Bhindi Do Pyaza"
        ],
        note: "Choose any 3 Veg Main Course"
      },

      dal: ["Dal Tadka","Dal Makhani","Dal Panchratan"],
      dalNote: "Choose any 1 Dal",

      rice: ["Jeera Rice","Vegetable Pulao","Veg Biryani"],
      riceNote: "Choose any 1 Rice",

     bread: ["Tandoori Roti","Naan"],
      breadNote: "Choose any 1 Bread",

       desserts: ["Gulab Jamun","Rasgulla","Gajar Halwa","Fruit Salad"],
      dessertsNote: "Choose any 2 Desserts",

      defaultIncludes: ["Papad","Pickle","Curd"]
    }
  },

  {
    id: 3,
    name: "GRAND ",
    subtitle:
      "2 Veg Soup • 3 Salads • 4 Veg Starters • 2 Veg Main Course • 1 Dal • 1 Flavored Rice • 1 Bread • Papad, Pickle, Curd • 2 Desserts",
    price: "₹ 1099/-",
    tag: "Plus Taxes",
    type: "veg",
    typeLabel: "Veg",
    image: PACKAGE3,
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
        note: "Choose any 4 Veg Starters"
      },

      soups: [
          "Lemon Coriander Soup","Sweet Corn Soup","Hot & Sour Soup",
        "Noodle Soup","Burnt Garlic Vegetable Soup","Cream of Tomato Soup"
      ],
      soupsNote: "Choose any 2 Veg Soup",

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
      dalNote: "1 Dal Included",

       rice: ["Jeera Rice","Vegetable Pulao","Veg Biryani"],
      riceNote: "1 Rice Included",

        bread: ["Tandoori Roti","Naan"],
      breadNote: "1 Bread Included",

       desserts: ["Gulab Jamun","Rasgulla","Gajar Halwa","Fruit Salad"],
      dessertsNote: "2 Desserts",

      defaultIncludes: ["Papad","Pickle","Curd"]
    }
  },

  {
    id: 4,
    name: "EXOTIC ",
    subtitle:
      "1 Veg Soup • 2 Salads • 1 Veg + 1 Non-Veg Starter • 1 Veg + 1 Non-Veg Main • 1 Dal • 1 Rice • 1 Bread • 2 Desserts",
    price: "₹ 999/-",
    tag: "Plus Taxes",
    type: "both",
    typeLabel: "Veg & Non-Veg",
  image: PACKAGE4,
    includes: {
      appetisers: {
        veg: ["Hara Bhara Kebab","Dahi Ke Kebab","Aloo Mutter Ki Tikki","Vegetable Sheekh Kebab",
          "Mini Masala Pungulu","Masala Wada","Mirchi Bhaji","Cauliflower 65",
          "Vegetable Manchurian","Crispy Fried Vegetables","Vegetable Spring Roll",
          "Chilli Garlic Potato","Cottage Cheese & Corn Nuggets","Falafel",
          "Spicy Cheese Balls","Vegetable Bullets"],
        nonVeg: ["Murgh Malai Kebab","Chicken Pepper Fry","Fish Amritsari"],
        note: "Choose 1 Veg + 1 Non-Veg Starter"
      },

      soups: [   "Lemon Coriander Soup","Sweet Corn Soup","Hot & Sour Soup",
        "Noodle Soup","Burnt Garlic Vegetable Soup","Cream of Tomato Soup"],
      soupsNote: "Choose any 1 Veg Soup",

      salads: [ "Garden Green Salad","Russian Salad","Greek Salad","Mexican Salad",
        "Aloo Papdi Chaat","Channa Chaat","Thai Salad"],
      saladsNote: "Choose any 2 Salads",

      mainCourse: {
        veg: [  "Paneer Butter Masala","Palak Paneer","Kadhai Paneer",
          "Vegetable Kofta Curry","Mixed Vegetable Korma","Bhindi Do Pyaza"],
        nonVeg: ["Chicken Curry","Fish Curry"],
        note: "Choose 1 Veg + 1 Non-Veg Main"
      },

      dal: ["Dal Tadka","Dal Makhani","Dal Panchratan"],
      dalNote: "1 Dal Included",

        rice: ["Jeera Rice","Vegetable Pulao","Veg Biryani"],
      riceNote: "1 Rice Included",

       bread: ["Tandoori Roti","Naan"],
      breadNote: "1 Bread Included",

       desserts: ["Gulab Jamun","Rasgulla","Gajar Halwa","Fruit Salad"],
      dessertsNote: "2 Desserts",

      defaultIncludes: ["Papad","Pickle","Curd"]
    }
  },
 {
    id: 5,
    name: "PREMIUM ",
    subtitle:
      "1 Veg Soup • 1 Non-Veg Soup • 2 Salads • 1 Veg + 1 Non-Veg Starter • 2 Veg + 1 Non-Veg Main • 1 Dal • 2 Rice • 1 Bread • 2 Desserts",
    price: "₹ 1099/-",
    tag: "Plus Taxes",
    type: "both",
    typeLabel: "Veg & Non-Veg",
    image: PACKAGE5,
    includes: {
      appetisers: {
        veg: [  "Hara Bhara Kebab","Dahi Ke Kebab","Aloo Mutter Ki Tikki","Vegetable Sheekh Kebab",
          "Mini Masala Pungulu","Masala Wada","Mirchi Bhaji","Cauliflower 65",
          "Vegetable Manchurian","Crispy Fried Vegetables","Vegetable Spring Roll",
          "Chilli Garlic Potato","Cottage Cheese & Corn Nuggets","Falafel",
          "Spicy Cheese Balls","Vegetable Bullets"],
        nonVeg: ["Chicken Tikka","Chilly Chicken"],
        note: "Choose 1 Veg + 1 Non-Veg Starter"
      },

      soups: ["Lemon Coriander Soup","Sweet Corn Soup","Hot & Sour Soup",
        "Noodle Soup","Burnt Garlic Vegetable Soup","Cream of Tomato Soup"],
      soupsNote: "1 Veg + 1 Non-Veg Soup",

      salads: [ "Garden Green Salad","Russian Salad","Greek Salad","Mexican Salad",
        "Aloo Papdi Chaat","Channa Chaat","Thai Salad"],
      saladsNote: "Choose any 2 Salads",

      mainCourse: {
        veg: ["Paneer Butter Masala","Palak Paneer","Kadhai Paneer",
          "Vegetable Kofta Curry","Mixed Vegetable Korma","Bhindi Do Pyaza"],
        nonVeg: ["Chicken Curry"],
        note: "2 Veg + 1 Non-Veg Main"
      },

     dal: ["Dal Tadka","Dal Makhani","Dal Panchratan"],
      dalNote: "1 Dal Included",

        rice: ["Jeera Rice","Vegetable Pulao","Veg Biryani"],
      riceNote: "2 Rice Included",

      bread: ["Tandoori Roti","Naan"],
      breadNote: "1 Bread Included",

       desserts: ["Gulab Jamun","Rasgulla","Gajar Halwa","Fruit Salad"],
      dessertsNote: "2 Desserts",

      defaultIncludes: ["Papad","Pickle","Curd"]
    }
  },

  {
    id: 6,
    name: "GRAND ",
    subtitle:
      "1 Veg + 1 Non-Veg Soup • 3 Salads • 2 Veg + 2 Non-Veg Starters • 2 Veg + 2 Non-Veg Main • 1 Dal • 2 Rice • 1 Bread • 2 Desserts + Ice Cream",
    price: "₹ 1199/-",
    tag: "Plus Taxes",
    type: "both",
    typeLabel: "Veg & Non-Veg",
    image: PACKAGE6,
    includes: {
      appetisers: {
        veg: [ "Hara Bhara Kebab","Dahi Ke Kebab","Aloo Mutter Ki Tikki","Vegetable Sheekh Kebab",
          "Mini Masala Pungulu","Masala Wada","Mirchi Bhaji","Cauliflower 65",
          "Vegetable Manchurian","Crispy Fried Vegetables","Vegetable Spring Roll",
          "Chilli Garlic Potato","Cottage Cheese & Corn Nuggets","Falafel",
          "Spicy Cheese Balls","Vegetable Bullets"],
        nonVeg: ["Chicken Tikka","Fish Fry"],
        note: "2 Veg + 2 Non-Veg Starters"
      },

      soups: [  "Lemon Coriander Soup","Sweet Corn Soup","Hot & Sour Soup",
        "Noodle Soup","Burnt Garlic Vegetable Soup","Cream of Tomato Soup"],
      soupsNote: "1 Veg + 1 Non-Veg Soup",

      salads: [ "Garden Green Salad","Russian Salad","Greek Salad","Mexican Salad",
        "Aloo Papdi Chaat","Channa Chaat","Thai Salad"],
      saladsNote: "Choose any 3 Salads",

      mainCourse: {
        veg: ["Paneer Butter Masala","Palak Paneer","Kadhai Paneer",
          "Vegetable Kofta Curry","Mixed Vegetable Korma","Bhindi Do Pyaza"],
        nonVeg: ["Chicken Curry","Fish Curry"],
        note: "2 Veg + 2 Non-Veg Main"
      },

      dal: ["Dal Tadka","Dal Makhani","Dal Panchratan"],
      dalNote: "1 Dal Included",

       rice: ["Jeera Rice","Vegetable Pulao","Veg Biryani"],
      riceNote: "2 Rice Included",

       bread: ["Tandoori Roti","Naan"],
      breadNote: "1 Bread Included",

        desserts: ["Gulab Jamun","Rasgulla","Gajar Halwa","Fruit Salad"],
      dessertsNote: "2 Desserts + Ice Cream",

      defaultIncludes: ["Papad","Pickle","Curd"]
    }},
];




export const ICON_PREMIUM = [
  {
    title: "Billing Instructions",
    icon: "🧾",
    key: "billing",
    points: [
      "The rates are non-commissionable and valid only for this function.",
      "Rates are applicable on a per person basis.",
      "Rates are exclusive of current applicable taxes. Any change in tax structure will impact the final rate.",
      "Audio-visual services, if required, will be charged separately as per applicable rates."
    ]
  },
  {
    title: "Advance Policy",
    icon: "💰",
    key: "advance",
    points: [
      "50% of the guaranteed billing is required at the time of booking.",
      "Advance payment is non-refundable and non-transferable.",
      "Balance payment must be completed 7 days before the event based on guaranteed guest count.",
      "Any excess amount payable by the hotel will be refunded within 7 working days via cheque.",
      "Demand Draft should be in favor of 'BHAGINI HOSPITALITIES PVT. LTD'."
    ]
  },
  {
    title: "Cancellation & Refund Policy",
    icon: "⚠️",
    key: "cancellation",
    points: [
      "Cancellation between 60 to 30 days before the event — 25% of estimated billing will be charged.",
      "Cancellation between 30 to 15 days before the event — 50% of estimated billing will be charged.",
      "Cancellation within 15 days of the event — 100% of estimated billing will be charged.",
      "Postponement within 30 days of the event — 100% of estimated billing will be charged."
    ]
  }
];