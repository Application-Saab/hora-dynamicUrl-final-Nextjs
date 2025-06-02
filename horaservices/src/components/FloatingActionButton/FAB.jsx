import React from 'react';
import { FaEdit } from 'react-icons/fa';
import './FloatingEditButton.css'; // You'll create this CSS file

const FloatingEditButton = ({ onClick }) => {
  return (
    <button className="fab-edit-button" onClick={onClick}>
      <img
        src="/icon.jpeg" 
        alt="Edit"
        style={{height: '50px', width: '50px', borderRadius: '50%'  }}
      />  </button>
  );
};

export default FloatingEditButton;