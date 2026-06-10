import React from 'react';
import PersonCard from './PersonCard';

const FacultySection = ({ principal, hods = [] }) => (
  <section className="home-section">
    <div className="home-section-inner">
      <p className="home-section-label">Faculty Leadership</p>
      <h2>Academic heads and department mentors</h2>
      <div className="principal-band">
        <PersonCard person={principal} />
      </div>
      <div className="home-grid hod-grid">
        {hods.map((person, index) => <PersonCard key={`${person.name}-${index}`} person={person} compact />)}
      </div>
    </div>
  </section>
);

export default FacultySection;
