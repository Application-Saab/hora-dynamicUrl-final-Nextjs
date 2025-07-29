// 'use client';

// import { useState } from 'react';
// import Image from 'next/image';
// import cameraIcon from '@/assets/background.png'; // fallback if no photo uploaded
// import background from '@/assets/background.png';
// import './create-event-invite.css';

// const CreateEventInvite = () => {
//   const [formData, setFormData] = useState({
//     eventName: '',
//     hostName: '',
//     eventDate: '',
//     arrivalTime: '',
//     venue: '',
//     photo: null,
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, photo: URL.createObjectURL(file) }));
//     }
//   };

//   const handleSubmit = async () => {
//     const payload = {
//       userId: '68849ffc1651b3b2e77f00c3', // Replace with dynamic ID if needed
//       eventType: 'birthday',
//       hostName: formData.hostName,
//       eventDate: new Date(formData.eventDate).toISOString(),
//       eventTime: formData.arrivalTime,
//       location: formData.venue,
//       eventTimeLines: [
//         { time: formData.arrivalTime, activityName: 'Welcome music start' },
//         { time: '10:50', activityName: 'Start magic show' },
//       ],
//     };

//     try {
//       const res = await fetch('http://localhost:3000/api/customer/event/create-event-invite', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       alert(data.message || 'Invite created!');
//     } catch (error) {
//       console.error('Error creating invite:', error);
//       alert('Failed to create invite. Try again.');
//     }
//   };

//   return (
//     <div
//       className="invite-bg-wrapper"
//       style={{ backgroundImage: `url(${background.src})` }}
//     >
//       <div className="invite-container">
//         <h2 className="invite-title">Create Event Invite</h2>
//         <p className="invite-subtitle">
//           🌟 A DAY OF JOY, A HEART FULL OF CHEER, THE PEOPLE WE LOVE, WE WISH TO HAVE NEAR. SO COME JOIN US AND MAKE MEMORIES DEAR.
//         </p>

//         <input
//           type="text"
//           placeholder="Event Name"
//           name="eventName"
//           value={formData.eventName}
//           onChange={handleInputChange}
//         />
//         <input
//           type="text"
//           placeholder="Host Name"
//           name="hostName"
//           value={formData.hostName}
//           onChange={handleInputChange}
//         />

//         <div className="row">
//           <div className="input-group">
//             <label className="date-time-label">Event Date</label>
//             <input
//               type="date"
//               name="eventDate"
//               value={formData.eventDate}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="input-group">
//             <label className="date-time-label">Arrival Time</label>
//             <input
//               type="time"
//               name="arrivalTime"
//               value={formData.arrivalTime}
//               onChange={handleInputChange}
//             />
//           </div>
//         </div>

//         <input
//           type="text"
//           placeholder="Venue"
//           name="venue"
//           value={formData.venue}
//           onChange={handleInputChange}
//         />

//         <label className="upload-box">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handlePhotoUpload}
//             style={{ display: 'none' }}
//           />
//           <Image
//             src={formData.photo || cameraIcon}
//             alt="Upload"
//             width={36}
//             height={36}
//           />
//           <p>UPLOAD PHOTO</p>
//         </label>

//         <div className="btn-group">
//           <button className="cancel-btn" onClick={() => window.location.reload()}>
//             CANCEL
//           </button>
//           <button className="save-btn" onClick={handleSubmit}>
//             SAVE
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateEventInvite;

'use client';

import { useState ,useEffect} from 'react';
import Image from 'next/image';
import cameraIcon from '@/assets/background.png';
import background from '@/assets/background.png';
import './create-event-invite.css';





const CreateEventInvite = () => {
  
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    hostName: '',
    eventDate: '',
    arrivalTime: '',
    venue: '',
    photo: null,
  });

    const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
const eventTypes = [
  'Birthday',
  'Wedding',
  'Anniversary',
  'Baby Shower',
  'Housewarming',
  'Engagement',
  'Farewell',
  'Retirement',
  'Festival',
  'Corporate Event',
];
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: URL.createObjectURL(file) }));
    }
  };

 
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const handleSubmit = async () => {
    if (!userId) {
      alert('You must be logged in to create an invite.');
      return;
    }

    setLoading(true);

    const payload = {
      userId,
      eventType: 'birthday',
      eventName: formData.eventName,
      hostName: formData.hostName,
      eventDate: new Date(formData.eventDate).toISOString(),
      eventTime: formData.arrivalTime,
      location: formData.venue,
      imageUrl: formData.imageUrl,
      eventTimeLines: [
        { time: formData.arrivalTime, activityName: 'Welcome music start' },
        { time: '10:50', activityName: 'Start magic show' },
      ],
    };

    try {
      const res = await fetch(`https://horaservices.com/api/event/createEvent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data?.data?._id) throw new Error(data.message || 'Unknown error');

      const eventId = data.data._id;

      router.push(`/wonderlandpage?id=${eventId}`);
    } catch (err) {
      console.error('Error saving invite:', err);
      alert('Failed to save invite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="invite-bg-wrapper"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <div className="invite-container">
        <h2 className="invite-title">Create Event Invite</h2>
        <p className="invite-subtitle">
          🌟 A DAY OF JOY, A HEART FULL OF CHEER, THE PEOPLE WE LOVE, WE WISH TO HAVE NEAR. SO COME JOIN US AND MAKE MEMORIES DEAR.
        </p>
       <div className="dropdown-wrapper">
      <input
        list="event-types"
        name="eventType"
        value={formData.eventType}
        onChange={handleInputChange}
        placeholder="Event Type"
        className="dropdown-input"
      />
      <datalist id="event-types">
        {eventTypes.map((type, index) => (
          <option key={index} value={type} />
        ))}
      </datalist>
    </div>

        <input
          type="text"
          placeholder="Host Name"
          name="hostName"
          value={formData.hostName}
          onChange={handleInputChange}
        />

        <div className="row">
          <div className="input-group">
            <label className="date-time-label">Event Date</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label className="date-time-label">Arrival Time</label>
            <input
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <input
          type="text"
          placeholder="Venue"
          name="venue"
          value={formData.venue}
          onChange={handleInputChange}
        />

        <label className="upload-box">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />
          <Image
            src={formData.photo || cameraIcon}
            alt="Upload"
            width={36}
            height={36}
          />
          <p>UPLOAD PHOTO</p>
        </label>

        <div className="btn-group">
          <button className="cancel-btn" onClick={() => window.location.reload()}>
            CANCEL
          </button>
          <button className="save-btn" onClick={handleSubmit}>
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventInvite;

