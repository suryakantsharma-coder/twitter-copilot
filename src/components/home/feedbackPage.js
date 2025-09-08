// FeedbackDialog.jsx
// A simple React component for a feedback dialog without input field.
// Just shows some text and a CTA button to redirect users to your Telegram group.

import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import groovyWalkAnimation from '../../assets/feedback.json';

export default function FeedbackDialog({ groupLink = 'https://t.me/+elKoRPba0ZhkNDNl' }) {
  const containerStyle = {
    maxWidth: '300px',
    width: '85%',
    height: 550,
    backgroundColor: '#0f0f0f',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    color: '#fff',
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '10px',
  };

  const textStyle = {
    fontSize: '14px',
    color: '#888',
    marginBottom: '20px',
  };

  const buttonStyle = {
    height: 40,
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#0088cc',
    cursor: 'pointer',
  };

  /**
   * Handles the click event for the CTA button.
   * Opens a new tab to the Telegram group specified in `groupLink`.
   */
  /*************  ✨ Windsurf Command ⭐  *************/
  /*******  5a890516-2dde-4ef0-8313-c0f3ef0d2246  *******/
  function handleRedirect() {
    window.open(groupLink, '_blank');
    window.close();
  }

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>We’d love your feedback 💬</h3>
      <p style={textStyle}>Click below to join our Telegram group and share your thoughts.</p>
      <div
        style={{
          height: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'end',
        }}
      >
        <Lottie animationData={groovyWalkAnimation} loop={false} style={{ height: 300 }} />
        <button style={buttonStyle} onClick={handleRedirect}>
          Give us your honest feedback
        </button>
      </div>
    </div>
  );
}

/*
Integration tips:
- Place this component in your Chrome extension popup or options page.
- Replace groupLink with your actual Telegram group link (https://t.me/your_group_username).
- When user clicks CTA, a new tab will open to the Telegram group.
*/
