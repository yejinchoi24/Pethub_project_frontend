import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert('검색어를 입력하세요.');
      return;
    }
    // 검색어와 함께 병원 리스트 페이지로 이동
    navigate('/hospitals', { state: { searchTerm } });
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">Pet Hub</h1>
        <p className="header-subtitle">반려견을 위한<br />최고의 정보 중심지</p>
        <p className="header-description">모든 반려인이 선택한 합리적인 선택</p>
        <div className="header-search">
          <input
            type="text"
            placeholder="병원 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button" onClick={handleSearch}>
            검색
          </button>
        </div>
      </div>
      <div className="header-images">
        <img 
          src="https://res.cloudinary.com/dqpwsqx9o/image/upload/v1731895691/%E1%84%80%E1%85%A1%E1%86%BC%E1%84%8B%E1%85%A1%E1%84%8C%E1%85%B5_ioyknm.png"
          alt="강아지1 이미지" className="header-image" />
        <img 
          src="https://res.cloudinary.com/dqpwsqx9o/image/upload/v1731895890/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-11-18_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_10.24.12_z7g2ep.png"
          alt="강아지2 이미지" className="header-image" />
         <img 
          src="https://res.cloudinary.com/dqpwsqx9o/image/upload/v1731896325/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-11-18_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_11.16.28_dphe75.png" 
            alt="강아지3 이미지" className="header-image" />
        <img 
          src="https://res.cloudinary.com/dqpwsqx9o/image/upload/v1731896229/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-11-18_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_11.16.08_oijeja.png" 
            alt="고양이 이미지" className="header-image" />
      </div>
    </header>
  );
};

export default Header;
