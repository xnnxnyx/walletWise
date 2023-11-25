import React, { useEffect, useRef } from 'react';
import QRCodeStyling from "qr-code-styling";

const QRcomp = ({ username }) => {
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const encodedUsername = encodeURIComponent(username);
    const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLSegfDHMs8kLda5nswiIH4LFUmAw396kBWxMvY5h49wQTikLzA/viewform?entry.1076970991=${encodedUsername}`;
    // const logo =require('./wallet.png');
    
    const qrCode = new QRCodeStyling({
      data: formUrl,
      width: 180,
      height: 180,
      dotsOptions: {
        color: '#645075',
        type: 'rounded',
      },
      backgroundOptions: {
        color: 'transparent', // Set the background color to transparent
      }
    //   image: {
    //     src: logo, // replace with your image URL
    //     x: null,
    //     y: null,
    //     height: 50,
    //     width: 50,
    //     excavate: true,
    //   },
    });

    qrCode.append(qrCodeRef.current);
    // qrCode.update({
    //   data: formUrl,
    //   dotsOptions: {
    //     color: '#645075;',
    //     type: 'rounded',
    //   },
    // });
  }, [username]);

  return <div ref={qrCodeRef}></div>;
};

export default QRcomp;