import React, { useEffect, useRef, useState } from "react";
import CustomModal from "../common/CustomModal";
import "./CreateInviteModal.css";

const ITEM_HEIGHT = 50;

const TimeModal = ({ show, onClose, selectedTime, setSelectedTime }) => {
  const [hour, setHour] = useState(1);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState("AM");
const isTouching = useRef(false);

  useEffect(() => {
    if (!show) return;
    if (selectedTime) {
      const [time, per] = selectedTime.split(" ");
      const [h, m] = time.split(":");
      setHour(parseInt(h));
      setMinute(parseInt(m));
      setPeriod(per);
    }
  }, [show, selectedTime]);

  const handleSave = () => {
    const formatted = `${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")} ${period}`;
    setSelectedTime(formatted);
    onClose();
  };

const InfiniteWheel = ({ range, value, setValue }) => {
  const ref = useRef(null);
  const data = [...range, ...range, ...range];
  const scrollTimeout = useRef(null);
  const isTouching = useRef(false);

  useEffect(() => {
    if (show && ref.current) {
      const index = range.indexOf(value);
      ref.current.scrollTop =
        (range.length + index) * ITEM_HEIGHT;
    }
  }, [show]); // ❗ value dependency nahi deni

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

    // ❌ mobile pe smooth snap nahi
    el.scrollTop = index * ITEM_HEIGHT;

    // ✅ value sirf yahin set hogi
    setValue(range[actualIndex]);
  };

  const handleScroll = () => {
    if (!ref.current) return;

    const el = ref.current;
    const scrollTop = el.scrollTop;
    const totalHeight = ITEM_HEIGHT * range.length;

    // ✅ infinite illusion
    if (scrollTop < totalHeight * 0.25) {
      el.scrollTop = scrollTop + totalHeight;
      return;
    }

    if (scrollTop > totalHeight * 2.75) {
      el.scrollTop = scrollTop - totalHeight;
      return;
    }

    // ❌ mobile pe snap disable
    if (isTouching.current) return;

    // ✅ desktop snap only
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
    }, 150);
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
    <div
      className="wheel"
      ref={ref}
      onScroll={handleScroll}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
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
        <div
          key={i}
          className={`wheel-item ${p === period ? "wheel-item-active" : ""}`}
          onClick={() => handleClick(i)}
        >
          {p}
        </div>
      ))}

      <div className="wheel-item buffer"></div>
    </div>
  );
};


  if (!show) return null;

  return (
    <CustomModal
      isOpen={show}
      onClose={onClose}
      showHeader={false}
        verticalCenter={false}
      modalClass="calendar-modal-body"
      body={
        <div className="custom-time-modal">
          <h3 className="time-modal-title">Set time</h3>

          <div className="time-wheel-container">
             <div className="center-highlight"></div>
            <InfiniteWheel
              range={[...Array(12).keys()].map((i) => i + 1)}
              value={hour}
              setValue={setHour}
            />
            <span className="colon">:</span>
            <InfiniteWheel
              range={[...Array(60).keys()]}
              value={minute}
              setValue={setMinute}
            />
            <AmPmWheel />
          </div>

          <div className="time-modal-actions">
            <button className="cancel-btn w-100" onClick={onClose}>Cancel</button>
            <button className="save-btn w-100" onClick={handleSave}>Save</button>
          </div>
        </div>
      }
    />
  );
};

export default TimeModal;
