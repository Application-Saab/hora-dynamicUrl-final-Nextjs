'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import './create-event-invite.css';

const CreateEventInvite = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    hostName: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const payload = {
      userId: '68849ffc1651b3b2e77f00c3',
      eventType: 'birthday',
      hostName: formData.hostName,
      eventDate: new Date(formData.eventDate).toISOString(),
      eventTime: formData.eventTime,
      location: formData.venue,
      eventTimeLines: [
        {
          time: formData.eventTime,
          activityName: 'Welcome music start',
        },
        {
          time: '10.50',
          activityName: 'Start magic show',
        },
      ],
    };

    const res = await fetch('http://localhost:3000/api/customer/event/create-event-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log('API response:', data);
    alert(data.message || 'Invite created!');
  };

  return (
    <div className="invite-container">
      <h2 className="invite-title">Create Event Invite</h2>
      <p className="invite-subtitle">
        🌟 A DAY OF JOY, A HEART FULL OF CHEER, THE PEOPLE WE LOVE, WE WISH TO HAVE NEAR.<br />
        SO COME JOIN US AND MAKE MEMORIES DEAR.
      </p>

      <input name="eventName" placeholder="Event Name" value={formData.eventName} onChange={handleChange} />
      <input name="hostName" placeholder="Host Name" value={formData.hostName} onChange={handleChange} />

      <div className="row">
        <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} />
        <input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} />
      </div>

      <input name="venue" placeholder="Venue" value={formData.venue} onChange={handleChange} />

      <label className="photo-upload">
        <input type="file" name="photo" accept="image/*" onChange={handleChange} hidden />
        <div className="upload-box">
          <Image src="/camera-icon.png" alt="Upload" width={40} height={40} />
          <p>UPLOAD PHOTO</p>
        </div>
      </label>

      <div className="btn-group">
        <button className="cancel-btn" type="button">Cancel</button>
        <button className="save-btn" onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
};

export default CreateEventInvite;
