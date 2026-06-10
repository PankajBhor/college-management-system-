import React from 'react';
import { assetUrl, initials } from './homeUtils';

const PersonCard = ({ person, compact = false }) => {
  const image = assetUrl(person?.imagePath || person?.imageUrl);

  return (
    <article className={`home-person-card ${compact ? 'compact' : ''}`}>
      <div className="home-person-image">
        {image ? <img src={image} alt={person.name} /> : <span>{initials(person?.name)}</span>}
      </div>
      <div>
        <h3>{person?.name}</h3>
        <p className="designation">{person?.designation || person?.role}</p>
        {person?.summary && <p className="summary">{person.summary}</p>}
        {person?.email && <p className="contact-line">{person.email}</p>}
      </div>
    </article>
  );
};

export default PersonCard;
