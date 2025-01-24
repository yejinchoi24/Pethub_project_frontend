import React, { useState } from 'react';
import './RecommendPage.css';
import HospitalRecommendation from './HospitalRecommendation';

const RecommendPage = () => {
  const [selectedTab, setSelectedTab] = useState(''); // 'emergency' or 'general'

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="recommend-page">
      <h1 className="page-title">병원 추천 시스템</h1>
      <div className="tab-container">
        <button
          className={`tab-button ${selectedTab === 'emergency' ? 'active' : ''}`}
          onClick={() => handleTabClick('emergency')}
        >
          응급 병원 추천
        </button>
        <button
          className={`tab-button ${selectedTab === 'general' ? 'active' : ''}`}
          onClick={() => handleTabClick('general')}
        >
          일반 병원 추천
        </button>
      </div>

      <div className="recommendation-content">
        {selectedTab === 'emergency' && (
          <HospitalRecommendation isEmergency={true} />
        )}
        {selectedTab === 'general' && (
          <HospitalRecommendation isEmergency={false} />
        )}
        {!selectedTab && (
          <p className="instruction-text">추천 유형을 선택하세요.</p>
        )}
      </div>
    </div>
  );
};

export default RecommendPage;
