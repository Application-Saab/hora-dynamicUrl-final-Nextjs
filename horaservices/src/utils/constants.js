export const eventOptions = [
  "Birthday",
  "Baby Shower",
  "Seemantham",
  "Dohale Jevan",
  "Godh Bharai",
  "Chatti",
  "Naming Ceremony",
  "Namkaran",
  "Annaprashan",
  "Choroonu",
  "Hatey Khori",
  "Vidyarambham",

  // Sahaj's Events
  "First Birthday",
  "Half Birthday",
  "First Tooth Celebration",
  "First Walk Ceremony",
  "Ayush Homam",
  "Pet Birthday",

  // Richa & Ramesh's Events
  "Proposal Party",
  "Dating Anniversary",
  "Valentine's Day Party",
  "Pre-Engagement",
  "Engagement",
  "Roka Ceremony",
  "Haldi",
  "Mehendi",
  "Sangeet",
  "Tilak Ceremony",
  "Bou Bhaat",
  "Mameru",
  "Wedding",
  "Reception",
  "Post-Wedding Party",
  "Gender Reveal",

  // Richa & Ramesh's House Events
  "Housewarming",
  "Griha Pravesh",

  // Celebration Events
  "Satyanarayan Puja",
  "Ramayan Katha",
  "Vrat Udyapan",
  "Thread Ceremony (Upanayan)",
  "Thread Ceremony for Girls",
  "Baptism",
  "Christening",
  "Eid",
  "Iftar",
  "Diwali",
  "Holi",
  "Karva Chauth Udyapan",
  "Kitty Party",
  "Farewell Party",
  "Raksha Bandhan",
  "Navratri",
  "Dussehra",
  "Ganesh Chaturthi",
  "Onam",
  "Durga Puja",
  "Pongal",
  "Makar Sankranti",
  "Lohri",
  "Bihu",
  "Ugadi",
  "Gudi Padwa",
  "Vishu",
  "Mahavir Jayanti",
  "Guru Nanak Jayanti",
  "Janmashtami",
  "Baisakhi",
  "Karva Chauth",
  "Chhath Puja",

  // Party Events
  "Game Night",
  "Tambola",
  "Housie Party",
  "Poker Night",
  "Retirement",
  "Pet Welcome",
];

export const RSVP_STATUS = {
  WILL_COME: "will Come",
  WILL_TRY: "Sure, will try",
};

export const mobileBreakPoints = {
  extraSmall : 320,
  small : 360,
  medium : 390,
  large : 480
}

export function getScreenSize(width) {
  if (width >= mobileBreakPoints.medium) return "large";
  if (width >= mobileBreakPoints.small) return "medium";
  return "small";
}

export const defaultFontSizeMap = {
  large: { fontSize: "2.5rem", lineHeight: "45px", top: "38%" },
  medium: { fontSize: "2rem", lineHeight: "42px", top: "40%" },
  small: { fontSize: "1.7rem", lineHeight: "34px", top: "42%" },
};

export const PUBLIC_VAPID =
  "BHBPued2H9tMC6x97EOQchgTE8P5d6QGaoTsfN3diqNq5oYa8nZoBv0Qb29iabLpi43C9-fFTalSAJdqCYNSA-0";

export const FIREBASE_VAPID_KEY =
  "BOZNXy9qbUIXWfQ2KiAbapxBegzkO6pE1s6cDcNFVRCELKjsLXTPoxob0OwGmv1-oUAp-7ngNiHdify3j39OuZw";