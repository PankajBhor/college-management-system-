import React, { useEffect, useState } from 'react';
import { getHomePageContent } from '../services/homePageService';
import HeroSection from './home/HeroSection';
import AboutCollege from './home/AboutCollege';
import LeadershipSection from './home/LeadershipSection';
import FacultySection from './home/FacultySection';
import DevelopersSection from './home/DevelopersSection';
import ContactSection from './home/ContactSection';
import './HomePage.css';

const HomePage = ({ onLoginClick }) => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let mounted = true;
    getHomePageContent()
      .then(data => { if (mounted) setContent(data); })
      .catch(() => { if (mounted) setContent({}); });
    return () => { mounted = false; };
  }, []);

  return (
    <main className="public-home">
      <HeroSection hero={content?.hero} onLoginClick={onLoginClick} />
      <AboutCollege about={content?.about} />
      <LeadershipSection leadership={content?.leadership || []} />
      <FacultySection principal={content?.principal} hods={content?.hods || []} />
      <DevelopersSection developers={content?.developers || []} />
      <ContactSection contact={content?.contact || {}} />
    </main>
  );
};

export default HomePage;
