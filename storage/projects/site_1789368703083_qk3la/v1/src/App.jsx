import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { siteData } from './data/siteData';
import ShopCollectionPage from './pages/ShopCollectionPage';
import OurCraftPage from './pages/OurCraftPage';

export default function App() {
  const [activePage, setActivePage] = useState('Shop Collection');

  const pageMap = (siteData.pages || []).reduce((acc, p) => {
    acc[p.name] = p;
    return acc;
  }, {});

  const renderActivePage = () => {
    switch (activePage) {
      case 'Shop Collection':
        return <ShopCollectionPage page={pageMap['Shop Collection']} setActivePage={setActivePage} siteData={siteData} />;
      case 'Our Craft':
        return <OurCraftPage page={pageMap['Our Craft']} setActivePage={setActivePage} siteData={siteData} />;
      default:
        return <ShopCollectionPage page={pageMap['Shop Collection']} setActivePage={setActivePage} siteData={siteData} />;
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
