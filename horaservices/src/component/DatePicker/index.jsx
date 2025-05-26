import { Dropdown } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

export const CustomDatePicker = ({ handleDateChange, selectedDate, showDatePicker, setShowDatePicker, selectedDateError, combinedDateTimeError }) => {

    const toggleDatePicker = () => {
      setShowDatePicker((prev) => !prev);
    };
  
    return (
      <div className={`d-flex flex-column border border-1 rounded-4  timepkerSec ${combinedDateTimeError ? 'border-danger' : ''} `}>
        <p style={{ marginBottom: "4px", color: "rgb(146, 82, 170)", fontSize: "12px" }} className='p-0 m-0'>Booking Date</p>
        <Dropdown show={showDatePicker} onToggle={toggleDatePicker} className='border-none p-0'>
          <Dropdown.Toggle
            variant="outline-secondary"
            className={`w-100 m-0 p-0 d-flex justify-content-between align-items-center text-black ${selectedDateError ? 'border-danger' : ''}`}
            style={{ cursor: 'pointer', padding: 0, background: 'none', border: 'none' }}        >
            <span style={{ fontSize: '12px' }} className='m-0 p-0 '>{selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}</span>
          </Dropdown.Toggle>
  
          <Dropdown.Menu
            show={showDatePicker}
            className="p-2"
            style={{ minWidth: 'auto' }}
          >
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              minDate={new Date()}
              inline // Use inline to show the calendar
            />
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };