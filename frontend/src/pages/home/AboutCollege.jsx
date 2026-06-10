import React from 'react';

const AboutCollege = ({ about }) => (
  <section className="home-section">
    <div className="home-section-inner about-layout">
      <div>
        <p className="home-section-label">About The College</p>
        <h2>Technical education with discipline, mentorship and practical learning.</h2>
      </div>
      <p>{about}</p>
    </div>
  </section>
);

export default AboutCollege;
