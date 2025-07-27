'use client';

import { useState } from 'react';
import Image from 'next/image';
import cameraIcon from '@/assets/background.png'; // optional: use a real camera icon
import background from '@/assets/background.png';
import './create-event-invite.css';

const CreateEventInvite = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    hostName: '',
    eventDate: '',
    arrivalTime: '',
    venue: '',
    photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async () => {
    const payload = {
      userId: '68849ffc1651b3b2e77f00c3',
      eventType: 'birthday',
      hostName: formData.hostName,
      eventDate: new Date(formData.eventDate).toISOString(),
      eventTime: formData.arrivalTime,
      location: formData.venue,
      eventTimeLines: [
        {
          time: formData.arrivalTime,
          activityName: 'Welcome music start',
        },
        {
          time: '10:50',
          activityName: 'Start magic show',
        },
      ],
    };

    try {
      const res = await fetch('http://localhost:3000/api/customer/event/create-event-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('API response:', data);
      alert(data.message || 'Invite created!');
    } catch (error) {
      console.error('Submit error:', error);
      alert('Something went wrong!');
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

        <input
          type="text"
          placeholder="Event Name"
          name="eventName"
          value={formData.eventName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Host Name"
          name="hostName"
          value={formData.hostName}
          onChange={handleInputChange}
        />

        <div className="row">
          <div className="input-group">
            <label className='date-time-label'>Event Date</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label className='date-time-label'>Arrival Time</label>
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
          <Image src={formData.photo || cameraIcon} alt="Upload" width={36} height={36} />
          <p>UPLOAD PHOTO</p>
        </label>

        <div className="btn-group">
          <button className="cancel-btn" onClick={() => window.location.reload()}>CANCEL</button>
          <button className="save-btn" onClick={handleSubmit}>SAVE</button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventInvite;
