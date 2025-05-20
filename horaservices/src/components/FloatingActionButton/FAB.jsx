import React from 'react';
import { FaEdit } from 'react-icons/fa';
import './FloatingEditButton.css'; // You'll create this CSS file

const FloatingEditButton = ({ onClick }) => {
  return (
    <button className="fab-edit-button" onClick={onClick}>
      <FaEdit size={20} />
    </button>
  );
};

export default FloatingEditButton;
