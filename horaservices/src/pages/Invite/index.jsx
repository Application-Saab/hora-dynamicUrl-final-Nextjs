import { useRef, useState } from 'react';
import htmlToImage from 'html-to-image';
import EventInvite from '@/components/EventInvite';

export default function InvitePage() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    address: '',
    backgroundImage: '/birthday_background.png', // default
  });

  const [showPreview, setShowPreview] = useState(false);
  const inviteRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleDownload = async () => {
    if (inviteRef.current) {
      const dataUrl = await htmlToImage.toPng(inviteRef.current);
      const link = document.createElement('a');
      link.download = 'event-invite.png';
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      {!showPreview ? (
        <form onSubmit={handleSubmit}>
          <h2>Create Your Invite</h2>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ margin: 5 }}
          />
          <br />
          <input
            name="date"
            placeholder="Date (e.g., 20 June 2024)"
            value={formData.date}
            onChange={handleChange}
            required
            style={{ margin: 5 }}
          />
          <br />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            style={{ margin: 5 }}
          />
          <br />
          <input
            name="backgroundImage"
            placeholder="Image URL or /birthday_background.png"
            value={formData.backgroundImage}
            onChange={handleChange}
            style={{ margin: 5 }}
          />
          <br />
          <button type="submit" style={{ marginTop: 10 }}>Generate Invite</button>
        </form>
      ) : (
        <>
          <div ref={inviteRef}>
            <EventInvite {...formData} />
          </div>
          {/* <button onClick={handleDownload} style={{ marginTop: 20 }}>
            Download as Image
          </button> */}
        </>
      )}
    </div>
  );
}
