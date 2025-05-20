export function getSubCategory(catValue) {
    if (!catValue) {

      const path = window.location.pathname; // e.g., /balloon-decoration/kids-birthday-decoration
      const parts = path.split('/'); // Split by '/'
      const dynamicValue = parts[2];
      return dynamicValue
    }

    if (catValue === 'birthday-decoration') {
      return 'Birthday';
    }
    else if (catValue === 'anniversary-decoration') {
      return 'Anniversary';
    }
    else if (catValue === 'haldi-mehendi-decoration') {
      return 'Haldi-Mehandi';
    } else if (catValue === 'first-night-decoration') {
      return 'FirstNight';
    } else if (catValue === 'baby-shower-decoration') {
      return 'BabyShower';
    } else if (catValue === 'welcome-baby-decoration') {
      return 'WelcomeBaby';
    } else if (catValue === 'premium-decoration') {
      return 'PremiumDecoration';
    } else if (catValue === 'bachelorette-decoration') {
      return 'bachelorette';
    } else {
      const parts = catValue.split('-'); // Split by hyphens
      return parts.slice(0, 2) // Take only the first two parts
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Capitalize each part
        .join(''); // Join parts together without spaces
    }
  }