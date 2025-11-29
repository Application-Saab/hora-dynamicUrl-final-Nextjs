import React, { useEffect, useRef, useState } from "react";
import CustomModal from "../common/CustomModal";
import "./CreateInviteModal.css";

const ITEM_HEIGHT = 50;

const TimeModal = ({ show, onClose, selectedTime, setSelectedTime }) => {
  const [hour, setHour] = useState(1);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState("AM");

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

    useEffect(() => {
      if (show && ref.current) {
        const index = range.indexOf(value);
        ref.current.scrollTop =
          (range.length + index) * ITEM_HEIGHT;
      }
    }, [show]);

    const updateValue = () => {
      const index = Math.round(ref.current.scrollTop / ITEM_HEIGHT);
      const actualIndex = ((index % range.length) + range.length) % range.length;
      setValue(range[actualIndex]);
    };

    const loopScroll = () => {
      const scrollTop = ref.current.scrollTop;
      const maxIndex = ITEM_HEIGHT * range.length * 2;
      const minIndex = ITEM_HEIGHT * range.length * 0.5;

      if (scrollTop > maxIndex) {
        ref.current.scrollTop = scrollTop - ITEM_HEIGHT * range.length;
      }
      if (scrollTop < minIndex) {
        ref.current.scrollTop = scrollTop + ITEM_HEIGHT * range.length;
      }
    };

    const handleScroll = () => {
      loopScroll();
      updateValue();
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
  <div className="wheel" ref={ref} onScroll={handleScroll}>
    <div className="wheel-item buffer"></div>
    

    {data.map((num, i) => (
      <div
        key={i}
        className={`wheel-item ${num === value ? "wheel-item-active" : ""}`}
        onClick={() => handleClick(i % range.length)}
      >
        {String(num).padStart(2, "0")}
      </div>
    ))}

    <div className="wheel-item buffer"></div>
 
  </div>
);

  };

  const AmPmWheel = () => (
    <div className="wheel no-scroll">
      {["AM", "PM"].map((p) => (
        <div
          key={p}
          className={`wheel-item ${p === period ? "wheel-item-active" : ""}`}
          onClick={() => setPeriod(p)}
        >
          {p}
        </div>
      ))}
    </div>
  );

  if (!show) return null;

  return (
    <CustomModal
      isOpen={show}
      onClose={onClose}
      showHeader={false}
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
