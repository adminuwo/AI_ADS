import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { siteData } from './data/siteData';
import HomePage from './pages/HomePage';
import ShopCatalogPage from './pages/ShopCatalogPage';
import EventStylingPage from './pages/EventStylingPage';

export default function App() {
  const [activePage, setActivePage] = useState('Home');

  const pageMap = (siteData.pages || []).reduce((acc, p) => {
    acc[p.name] = p;
    return acc;
  }, {});

  const renderActivePage = () => {
    switch (activePage) {
      case 'Home':
        return <HomePage page={pageMap['Home']} setActivePage={setActivePage} siteData={siteData} />;
      case 'Shop Catalog':
        return <ShopCatalogPage page={pageMap['Shop Catalog']} setActivePage={setActivePage} siteData={siteData} />;
      case 'Event Styling':
        return <EventStylingPage page={pageMap['Event Styling']} setActivePage={setActivePage} siteData={siteData} />;
      default:
        return <HomePage page={pageMap['Home']} setActivePage={setActivePage} siteData={siteData} />;
    }
  };

  return (
    <div className="app-root">
      <Navbar siteData={siteData} activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        {renderActivePage()}
      </main>
      <Footer siteData={siteData} setActivePage={setActivePage} />
    </div>
  );
}
