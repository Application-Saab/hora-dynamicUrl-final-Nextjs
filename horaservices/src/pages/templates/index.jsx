'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import "./template.css"
const templates = [
{ id: 1, image: '/assets/template1.svg' },
  { id: 2, image: '/assets/template2.svg' },
  { id: 3, image: '/assets/template3.svg' },
  { id: 4, image: '/assets/template6.svg' },
  { id: 5, image: '/assets/template7.svg' },
  { id: 6, image: '/assets/template9.svg' },
  { id: 7, image: '/assets/template10.svg' },
  { id: 8, image: '/assets/template11.svg' },
];

const TemplateGrid = () => {
  const router = useRouter();

  const handleApplyClick = (template) => {
      router.push(`/wonderland/create-invite-template?templateId=${template.id}`);
  };

 

  return (
    <div className="templateWrapper">
      <h2 className="templateTitle">Choose From 50+ Invites </h2>
      <div className="templateGrid">
        {templates.map((template) => (
          <div key={template.id} className="templateCard">
            <object
              data={template.image}
              type="image/svg+xml"
              className="templatePreview"
            >
              Template Preview
            </object>
            
    
          <div className='button-container'
            >
          <button
              className="templateApplyBtn"
              onClick={() => handleApplyClick(template)}
            >
              Apply
            </button>
            </div>
              </div>
        ))}
      </div>


    </div>
  );
};

export default TemplateGrid;
