import React from 'react';
import PersonCard from './PersonCard';

const LeadershipSection = ({ leadership = [] }) => (
  <section className="home-section alternate">
    <div className="home-section-inner">
      <p className="home-section-label">Leadership</p>
      <h2>Guidance behind the institution</h2>
      <div className="home-grid three">
        {leadership.map((person, index) => <PersonCard key={`${person.name}-${index}`} person={person} />)}
      </div>
    </div>
  </section>
);

export default LeadershipSection;
