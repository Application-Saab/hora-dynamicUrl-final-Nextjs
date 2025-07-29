'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import './create-invite-template.css'; // Import your CSS file here

const templates = {
  1: '/assets/template1.svg',
  2: '/assets/template2.svg',
  3: '/assets/template3.svg',
  4: '/assets/template6.svg',
  5: '/assets/template7.svg',
  6: '/assets/template9.svg',
  7: '/assets/template10.svg',
  8: '/assets/template11.svg',
};

export default function CreateInviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  const templateImage = templates[templateId];

  const [formData, setFormData] = useState({
    hostName: '',
    eventDate: '',
    arrivalTime: '',
    venue: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted:\n' + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="templateinfo-wrapper">
      {templateImage && (
        <img
          src={templateImage}
          alt="Selected Template"
          className="templateinfo-image"
        />
      )}

      <form onSubmit={handleSubmit} className="templateinfo-form">
        <input
          type="text"
          name="hostName"
          placeholder="Host Name"
          value={formData.hostName}
          onChange={handleChange}
          required
          className="templateinfo-input"
        />

        <div className="templateinfo-row">
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
            className="templateinfo-input"
          />
          <input
            type="time"
            name="arrivalTime"
            value={formData.arrivalTime}
            onChange={handleChange}
            required
            className="templateinfo-input"
          />
        </div>

        <input
          type="text"
          name="venue"
          placeholder="Venue"
          value={formData.venue}
          onChange={handleChange}
          required
          className="templateinfo-input"
        />

        <button type="button" className="templateinfo-uploadBtn">
          📷 UPLOAD PHOTO WITH SAHAJ
        </button>

        <div className="templateinfo-actionRow">
          <button
            type="button"
            onClick={() => router.back()}
            className="templateinfo-cancelBtn"
          >
            Cancel
          </button>
          <button type="submit" className="templateinfo-submitBtn">
            Apply
          </button>
        </div>
      </form>
    </div>
  );
}
