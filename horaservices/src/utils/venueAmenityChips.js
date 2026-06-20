import guestIcon from "@/assets/venuelanding/users.svg";
import parkingIcon from "@/assets/venuelanding/parking.svg";
import hallIcon from "@/assets/venuelanding/halls.svg";
import bedIcon from "@/assets/venuelanding/rooms.svg";

export const getVenueAmenityChips = (venue) => {
  return [
    venue?.guestCapacity && {
      icon: guestIcon,
      colorClass: "purple",
      label: `${venue.guestCapacity}`,
      sub: "Guests",
    },

    venue?.isParkingAvailable && {
      icon: parkingIcon,
      colorClass: "green",
      label: "Parking",
      sub: "Available",
    },

    venue?.hallType?.length > 0 && {
      icon: hallIcon,
      colorClass: "amber",
      label: `${venue.hallType.length} Hall${
        venue.hallType.length !== 1 ? "s" : ""
      }`,
      sub: venue.hallType.join(" & "),
    },

    venue?.totalRoomsAvailable > 0 && {
      icon: bedIcon,
      colorClass: "blue",
      label: `${venue.totalRoomsAvailable} Rooms`,
      sub: "Available",
    },
  ].filter(Boolean);
};