import React, { useEffect, useRef, useState } from "react";
import "./CreateInviteModal.css";

const TimeModal = ({ show, onClose, selectedTime, setSelectedTime }) => {
<<<<<<< HEAD
  const modalRef = useRef(null);
  const [hour, setHour] = useState(6);
  const [minute, setMinute] = useState(30);
  const [period, setPeriod] = useState("PM");
=======
  const [hour, setHour] = useState(1);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState("AM");
const isTouching = useRef(false);
>>>>>>> 115cbc6a2c9e0756f52c835f416c3b3ed21eb5de

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Set wheel to selectedTime when modal opens
  useEffect(() => {
    if (show && selectedTime) {
      const [time, per] = selectedTime.split(" ");
      const [h, m] = time.split(":");
      setHour(parseInt(h, 10));
      setMinute(parseInt(m, 10));
      setPeriod(per);
    }
  }, [show, selectedTime]);

  if (!show) return null;

  const handleSave = () => {
    const formatted = `${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")} ${period}`;
    setSelectedTime(formatted);
    onClose();
  };

<<<<<<< HEAD
  const Wheel = ({ range, value, setValue }) => (
    <div className="wheel">
      {range.map((num) => (
=======
const InfiniteWheel = ({ range, value, setValue }) => {
  const ref = useRef(null);
  const data = [...range, ...range, ...range];
  const scrollTimeout = useRef(null);

  useEffect(() => {
    if (show && ref.current) {
      const index = range.indexOf(value);
      ref.current.scrollTop =
        (range.length + index) * ITEM_HEIGHT;
    }
  }, [show]); // ❗ value dependency hata di
const onTouchStart = () => {
  isTouching.current = true;
  clearTimeout(scrollTimeout.current);
};

const onTouchEnd = () => {
  isTouching.current = false;

  if (!ref.current) return;

  const el = ref.current;
  const index = Math.round(el.scrollTop / ITEM_HEIGHT);
  const actualIndex =
    ((index % range.length) + range.length) % range.length;

  // ❌ smooth on mobile
  el.scrollTop = index * ITEM_HEIGHT;

  setValue(range[actualIndex]);
};

const handleScroll = () => {
  if (!ref.current) return;

  const el = ref.current;
  const scrollTop = el.scrollTop;
  const totalHeight = ITEM_HEIGHT * range.length;

  // infinite illusion ONLY at edges
  if (scrollTop < totalHeight * 0.25) {
    el.scrollTop = scrollTop + totalHeight;
    return;
  }

  if (scrollTop > totalHeight * 2.75) {
    el.scrollTop = scrollTop - totalHeight;
    return;
  }

  // desktop snap only
  if (isTouching.current) return;

  clearTimeout(scrollTimeout.current);

  scrollTimeout.current = setTimeout(() => {
    if (!ref.current) return;

    const index = Math.round(el.scrollTop / ITEM_HEIGHT);
    const actualIndex =
      ((index % range.length) + range.length) % range.length;

    el.scrollTo({
      top: index * ITEM_HEIGHT,
      behavior: "smooth",
    });

    setValue(range[actualIndex]);
  }, 180);
};




  const handleClick = (i) => {
    const baseIndex = range.length + i;
    ref.current.scrollTo({
      top: baseIndex * ITEM_HEIGHT,
      behavior: "smooth",
    });
    setValue(range[i]);
  };

  return (
    <div className="wheel" ref={ref}  onScroll={handleScroll}
  onTouchStart={onTouchStart}
  onTouchEnd={onTouchEnd}>
      <div className="wheel-item buffer" />

      {data.map((num, i) => (
        <div
          key={i}
          className={`wheel-item ${
            num === value ? "wheel-item-active" : ""
          }`}
          onClick={() => handleClick(i % range.length)}
        >
          {String(num).padStart(2, "0")}
        </div>
      ))}

      <div className="wheel-item buffer" />
    </div>
  );
};


 const AmPmWheel = () => {
  const ref = useRef(null);
  const range = ["AM", "PM"];

  
  useEffect(() => {
    if (show && ref.current) {
      const index = range.indexOf(period);
      ref.current.scrollTop = index * ITEM_HEIGHT;
    }
  }, [show, period]);

  // Scroll par active item detect karo
  const handleScroll = () => {
    if (!ref.current) return;

    const index = Math.round(ref.current.scrollTop / ITEM_HEIGHT);

    // Ensure AM/PM ke beech hi rahe
    const safeIndex = Math.max(0, Math.min(index, range.length - 1));

    setPeriod(range[safeIndex]);
  };

  // Click par smooth scroll + center highlight
  const handleClick = (i) => {
    if (!ref.current) return;

    ref.current.scrollTo({
      top: i * ITEM_HEIGHT,
      behavior: "smooth",
    });

    setPeriod(range[i]);
  };

  return (
    <div className="wheel" ref={ref} onScroll={handleScroll}>
      <div className="wheel-item buffer"></div>

      {range.map((p, i) => (
>>>>>>> 115cbc6a2c9e0756f52c835f416c3b3ed21eb5de
        <div
          key={num}
          className={`wheel-item ${num === value ? "wheel-item-active" : ""}`}
          onClick={() => setValue(num)}
        >
          {String(num).padStart(2, "0")}
        </div>
      ))}
    </div>
  );

  return (
    <div className="custom-modal-backdrop align-items-center justify-content-center">
      <div ref={modalRef} className="custom-time-modal">
        <h3 className="time-modal-title">Set time</h3>

        <div className="time-wheel-container my-5">
          <Wheel
            range={[...Array(12).keys()].map((i) => i + 1)}
            value={hour}
            setValue={setHour}
          />
          <span className="colon">:</span>
          <Wheel
            range={[...Array(60).keys()]}
            value={minute}
            setValue={setMinute}
          />
          <span className="colon">:</span>
          <Wheel range={["AM", "PM"]} value={period} setValue={setPeriod} />
        </div>

        <div className="time-modal-actions mt-5">
          <button className="cancel-btn w-100" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn w-100" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeModal;
