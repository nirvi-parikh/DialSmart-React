import React, { useEffect } from 'react';
import Header from './Header'; // Adjust the path if needed

const favicon = 'https://dialsmart.com/favicon.ico'; // Replace with your actual favicon URL if different

const AcknowledgePage: React.FC = () => {
  useEffect(() => {
    document.title = "CVS DialSmart";

    const faviconLink = document.createElement("link");
    faviconLink.rel = "icon";
    faviconLink.href = favicon;
    document.head.appendChild(faviconLink);

    return () => {
      document.head.removeChild(faviconLink);
    };
  }, []);

  const handleAcknowledge = () => {
    window.location.href = 'https://dialsmart.com';
  };

  return (
    <div>
      <Header />
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>
          I acknowledge that I have reviewed AI-generated content understand that what effect it will make.
        </p>
        <button onClick={handleAcknowledge}>Acknowledge</button>
      </div>
    </div>
  );
};

export default AcknowledgePage;
