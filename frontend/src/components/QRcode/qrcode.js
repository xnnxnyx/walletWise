import React, { useEffect, useRef } from 'react';
import QRCodeStyling from "qr-code-styling";
import { getUsername, getUserID, getUserType } from '../../api.mjs';

const QRcomp = () => {
  const userID = getUserID();
  const userType = getUserType();
  // const username = getUsername();
  const type = userID + "/" + userType;
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const encodedUsername = encodeURIComponent(type);
    const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLSegfDHMs8kLda5nswiIH4LFUmAw396kBWxMvY5h49wQTikLzA/viewform?entry.1076970991=${encodedUsername}`;

    const qrCode = new QRCodeStyling({
      data: formUrl,
      width: 180,
      height: 180,
      dotsOptions: {
        color: '#0D0447',
        type: 'rounded',
      },
      backgroundOptions: {
        color: 'transparent',
      }
    });

    qrCode.append(qrCodeRef.current);
  }, [type]);

  return <div ref={qrCodeRef}></div>;
};

export default QRcomp;
