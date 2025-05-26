import { Form } from "react-bootstrap"

export const CustomTimePicker = ({ selectedTimeSlot, handleTimeSlotChange, generateTimeSlots, selectedTimeSlotError, combinedDateTimeError }) => {
    return (
      <div className={`timepkerSec d-flex flex-column border border-1 ${combinedDateTimeError ? 'border-danger' : ''}  ${selectedTimeSlotError ? 'border-danger' : ""} rounded-4 `}>
        <p style={{ marginBottom: "4px", color: "rgb(146, 82, 170)", fontSize: "12px" }} className='p-0 m-0'>Select Time Slot</p>
        <div>
          <Form.Control
            as="select"
            value={selectedTimeSlot}
            onChange={handleTimeSlotChange}
            style={{ fontSize: "14px", cursor: 'pointer', padding: 0, background: 'none', border: 'none' }}
            className="timeslot"
          >
            <option value="">Executor Arrival Time</option>
            {generateTimeSlots().map((timeSlot, index) => (
              <option key={index} value={timeSlot}>
                {timeSlot}
              </option>
            ))}
          </Form.Control>
        </div>
      </div>
    )
  }