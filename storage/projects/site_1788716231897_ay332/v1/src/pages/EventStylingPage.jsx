import React from 'react';
import SectionRenderer from '../components/SectionRenderer';

export default function EventStylingPage({ page, setActivePage, siteData }) {
  const sections = page?.sections || [];

  return (
    <div className="page-container page-page_event_styling">
      {sections.map((section) => (
        <SectionRenderer
          key={section.id || Math.random().toString()}
          section={section}
          setActivePage={setActivePage}
          siteData={siteData}
        />
      ))}
    </div>
  );
}
