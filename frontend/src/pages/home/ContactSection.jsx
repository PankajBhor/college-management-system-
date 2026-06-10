import React from 'react';

const ContactSection = ({ contact = {} }) => (
  <footer className="home-contact">
    <div className="home-section-inner contact-layout">
      <div>
        <h2>Jaihind Polytechnic, Kuran</h2>
        <p>{contact.address}</p>
      </div>
      <div className="contact-list">
        {(contact.phones || []).map(phone => <a key={phone} href={`tel:${phone}`}>{phone}</a>)}
        {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
        {(contact.socialLinks || []).map(link => <a key={link.url || link.label} href={link.url} target="_blank" rel="noreferrer">{link.label || link.url}</a>)}
      </div>
    </div>
  </footer>
);

export default ContactSection;
