import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export function WhatappIcon() {
  return (
    <div>
    <Link
      href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services"
      target="_blank"
    >
      <Image
        className="whatappicon home"
        src="https://horaservices.com/api/uploads/whatsapp-new.webp"
        alt="WhatsApp Icon"
        width={40}
        height={40}
      />
    </Link>
  </div>
  )
}

