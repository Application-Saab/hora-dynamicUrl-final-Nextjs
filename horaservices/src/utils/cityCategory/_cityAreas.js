// Shared city area data reused across every category file.
// Each key matches the lowercase city name used in getCityCategoryLanding.

export const cityAreasData = {
  mumbai: {
    areasHeading: "Where we set up in Mumbai",
    areasIntro:
      "We cover the western suburbs from Andheri to Borivali, the central belt around Powai, Ghatkopar and Chembur, plus Navi Mumbai and Thane. We cover:",
    areas: [
      { zone: "Western suburbs", localities: "Andheri, Bandra, Juhu, Vile Parle, Goregaon, Malad, Kandivali, Borivali" },
      { zone: "Central", localities: "Powai, Ghatkopar, Chembur, Kurla, Mulund, Vikhroli" },
      { zone: "South Mumbai", localities: "Dadar, Worli, Lower Parel, Parel" },
      { zone: "Navi Mumbai", localities: "Vashi, Nerul, Kharghar, Airoli" },
      { zone: "Thane", localities: "Thane West, Ghodbunder Road" },
    ],
    areasNote: "Share your pincode at booking and we will confirm a slot near you.",
    areasAnswer: "Andheri, Bandra, Powai, Ghatkopar, Chembur, Mulund, Borivali, Kandivali, the Navi Mumbai nodes and Thane, among others. Add your pincode at booking to confirm your area.",
  },
  bangalore: {
    areasHeading: "Where we set up in Bangalore",
    areasIntro:
      "We cover the east around Whitefield and Marathahalli, the south through Koramangala, HSR, BTM and Electronic City, the central areas, and the north. We cover:",
    areas: [
      { zone: "East", localities: "Whitefield, Marathahalli, Brookefield, KR Puram, Mahadevapura" },
      { zone: "South", localities: "Koramangala, HSR Layout, BTM, Jayanagar, JP Nagar, Electronic City, Sarjapur Road" },
      { zone: "Central and north", localities: "Indiranagar, Domlur, Hebbal, Yelahanka, Malleshwaram" },
      { zone: "West", localities: "Rajajinagar, Vijayanagar, Nagarbhavi" },
    ],
    areasNote: "Share your pincode at booking and we will confirm a slot near you.",
    areasAnswer: "Whitefield, Marathahalli, Koramangala, HSR Layout, BTM, Indiranagar, Jayanagar, Electronic City, Hebbal and Rajajinagar, among others. Add your pincode at booking to confirm your area.",
  },
  hyderabad: {
    areasHeading: "Where we set up in Hyderabad",
    areasIntro:
      "We cover the west and tech corridor from Gachibowli to HITEC City, the north through Kompally and Secunderabad, and the central and old city areas. We cover:",
    areas: [
      { zone: "West and tech corridor", localities: "Gachibowli, HITEC City, Madhapur, Kondapur, Manikonda" },
      { zone: "North", localities: "Kompally, Kukatpally, Bachupally, Miyapur, Secunderabad" },
      { zone: "Central", localities: "Banjara Hills, Jubilee Hills, Begumpet, Himayatnagar" },
      { zone: "East and south", localities: "LB Nagar, Dilsukhnagar, Uppal, Hayathnagar" },
    ],
    areasNote: "Share your pincode at booking and we will confirm a slot near you.",
    areasAnswer: "Gachibowli, HITEC City, Madhapur, Kondapur, Kompally, Kukatpally, Banjara Hills, Jubilee Hills, Secunderabad and LB Nagar, among others. Add your pincode at booking to confirm your area.",
  },
  delhi: {
    areasHeading: "Where we set up in Delhi",
    areasIntro:
      "We cover south Delhi, east Delhi, west Delhi and the north. We cover:",
    areas: [
      { zone: "South Delhi", localities: "Vasant Kunj, Saket, Greater Kailash, Defence Colony, Green Park, Hauz Khas" },
      { zone: "East Delhi", localities: "Preet Vihar, Mayur Vihar, Laxmi Nagar, Shahdara" },
      { zone: "West Delhi", localities: "Janakpuri, Uttam Nagar, Dwarka, Vikaspuri" },
      { zone: "North Delhi", localities: "Rohini, Pitampura, Shalimar Bagh, Model Town" },
    ],
    areasNote: "Share your pincode at booking and we will confirm a slot near you.",
    areasAnswer: "Vasant Kunj, Saket, Greater Kailash, Dwarka, Rohini, Pitampura, Preet Vihar, Mayur Vihar and Janakpuri, among others. Add your pincode at booking to confirm your area.",
  },
  noida: {
    areasHeading: "Where we set up in Noida",
    areasIntro:
      "We cover the central sectors, the Expressway belt, Greater Noida and Noida Extension. We cover:",
    areas: [
      { zone: "Central sectors", localities: "Sectors 50, 55, 56, 47, 62, 44, 45" },
      { zone: "Expressway belt", localities: "Sectors 137, 150, 168, 76, 78" },
      { zone: "Greater Noida", localities: "Alpha 1 and 2, Beta, Gamma, Knowledge Park" },
      { zone: "Noida Extension", localities: "Gaur City, Supertech Eco Village, Crossing Republik side" },
    ],
    areasNote: "Share your sector and pincode at booking and we will confirm a slot.",
    areasAnswer: "Central sectors like 50, 55, 56, 47 and 62, the Expressway sectors 137 and 150, plus Noida Extension, Gaur City and Greater Noida. Add your pincode at booking to confirm your area.",
  },
  gurugram: {
    areasHeading: "Where we set up in Gurugram",
    areasIntro:
      "We cover the Cyber City side and central sectors, Golf Course Road and its Extension, the Sohna Road belt, Old Gurugram and New Gurugram out towards the Dwarka Expressway. We cover:",
    areas: [
      { zone: "Cyber City and central", localities: "DLF Cyber City, DLF Phases 1 to 5, MG Road, Sector 29" },
      { zone: "Golf Course Road and Extension", localities: "Sushant Lok, Sectors 42 to 43, Golf Course Extension Road" },
      { zone: "Sohna Road belt", localities: "Sectors 47 to 49, Sohna Road, South City 1 and 2" },
      { zone: "Old Gurugram", localities: "Sectors 14, 15 and 17, Palam Vihar, Udyog Vihar" },
      { zone: "New Gurugram", localities: "Sectors 80 to 95, Dwarka Expressway, and out towards Manesar" },
    ],
    areasNote: "Add your sector or pincode at booking to confirm a slot.",
    areasAnswer: "DLF Cyber City and Phases 1 to 5, Golf Course Road, Sohna Road, Sushant Lok, Palam Vihar, Old Gurugram and New Gurugram out to Sectors 80 to 95. Add your pincode at booking to confirm your area.",
  },
  ghaziabad: {
    areasHeading: "Where we set up in Ghaziabad",
    areasIntro:
      "We cover the Trans-Hindon side across Indirapuram, Vaishali, Vasundhara and Kaushambi, the Raj Nagar areas, and the older parts of the city. We cover:",
    areas: [
      { zone: "Trans-Hindon, near the Delhi and Noida border", localities: "Indirapuram, Vaishali, Vasundhara, Kaushambi" },
      { zone: "Raj Nagar and around", localities: "Raj Nagar, Raj Nagar Extension, Nehru Nagar" },
      { zone: "Older Ghaziabad", localities: "Kavi Nagar, Shastri Nagar, Rajendra Nagar" },
      { zone: "Along the highway and Noida side", localities: "Crossings Republik, Wave City" },
    ],
    areasNote: "Share your society and pincode at booking to confirm a slot.",
    areasAnswer: "Indirapuram, Vaishali, Vasundhara, Kaushambi, Raj Nagar, Raj Nagar Extension, Crossings Republik and the older Ghaziabad areas. Add your pincode at booking to confirm your area.",
  },
  faridabad: {
    areasHeading: "Where we set up in Faridabad",
    areasIntro:
      "We cover the old Faridabad sectors like 14, 15, 16, 21 and 37, the NIT area, and Greater Faridabad across the Neharpar sectors. We cover:",
    areas: [
      { zone: "Old Faridabad sectors", localities: "Sectors 14, 15, 16, 21, 37" },
      { zone: "NIT and central", localities: "the NIT blocks, Old Faridabad" },
      { zone: "Greater Faridabad, Neharpar", localities: "Sectors 75 to 89" },
      { zone: "Along the highway", localities: "Ballabhgarh, Sectors 86 and 88" },
    ],
    areasNote: "Add your sector or pincode at booking to confirm a slot.",
    areasAnswer: "The old sectors like 14, 15, 16, 21 and 37, the NIT area, Greater Faridabad (Neharpar) sectors 75 to 89, and Ballabhgarh. Add your pincode at booking to confirm your area.",
  },
};
