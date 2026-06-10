import React from 'react';

const DevelopersSection = ({ developers = [] }) => (
  <section className="home-section alternate">
    <div className="home-section-inner">
      <p className="home-section-label">Developers</p>
      <h2>System contributors</h2>
      <div className="home-grid two">
        {developers.map((developer, index) => (
          <article className="developer-card" key={`${developer.name}-${index}`}>
            <h3>{developer.name}</h3>
            <p>{developer.role}</p>
            <div className="developer-links">
              {developer.linkedin && <a href={developer.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              {developer.phone && <a href={`tel:${developer.phone}`}>{developer.phone}</a>}
              {developer.email && <a href={`mailto:${developer.email}`}>{developer.email}</a>}
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default DevelopersSection;
