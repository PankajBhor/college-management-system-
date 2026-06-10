import React from 'react';

const HeroSection = ({ hero, onLoginClick }) => (
  <section className="home-hero">
    <nav className="home-nav">
      <div className="home-brand">Jaihind Polytechnic</div>
      <button type="button" onClick={onLoginClick}>Login</button>
    </nav>
    <div className="home-hero-content">
      <p className="home-kicker">Jaihind Comprehensive Educational Institute</p>
      <h1>{hero?.title || 'Jaihind Polytechnic, Kuran'}</h1>
      <p className="home-tagline">{hero?.tagline}</p>
      <div className="home-hero-panel">
        <span>Diploma Engineering</span>
        <span>Admissions</span>
        <span>Student Support</span>
      </div>
      <p className="home-highlight">{hero?.highlight}</p>
    </div>
  </section>
);

export default HeroSection;
