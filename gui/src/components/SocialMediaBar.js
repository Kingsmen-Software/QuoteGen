import React from 'react';
import './SocialMediaBar.css';

const SocialMediaBar = () => {
  return (
    <div className="social-media-bar">
      <a href="https://www.facebook.com" className="social-media-link" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-facebook-f"></i>
      </a>
      <a href="https://www.twitter.com" className="social-media-link" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-twitter"></i>
      </a>
      <a href="https://www.instagram.com" className="social-media-link" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-instagram"></i>
      </a>
      <a href="https://www.linkedin.com" className="social-media-link" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-linkedin-in"></i>
      </a>
      <a href="https://www.youtube.com" className="social-media-link" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-youtube"></i>
      </a>
      <a href="https://www.pinterest.com" className="social-media-link" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-pinterest-p"></i>
      </a>
    </div>
  );
};

export default SocialMediaBar;