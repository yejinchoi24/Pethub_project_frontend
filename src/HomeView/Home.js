import React from 'react';
import Header from './Header/Header';
import Main from './Main/Main';
import Footer from './Footer/Footer';

const Home = () => {
  return (
    <div className="app-container">
      <div className="section">
        <Header />
      </div>
      <div className="section">
        <Main />
      </div>
      <div className="section">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
