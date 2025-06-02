import React from 'react';
import { FaEdit } from 'react-icons/fa';
import './FloatingEditButton.css'; // You'll create this CSS file
import editIcon from "../../assets/icon.jpeg"
import Image from "next/image";
const FloatingEditButton = ({ onClick }) => {
  return (
    <button className="fab-edit-button" onClick={onClick}>
      <Image
         src={editIcon}
        alt="Edit"
        style={{height: '50px', width: '50px', borderRadius: '50%'  }}
      />  </button>
  );
};

export default FloatingEditButton;