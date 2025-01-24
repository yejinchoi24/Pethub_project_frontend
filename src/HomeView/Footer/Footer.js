import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Footer.css';
import { useRanking } from '../../contexts/RankingContext'; // 수정된 경로


const Footer = () => {
  const [hospitalDetails, setHospitalDetails] = useState([]);
  const navigate = useNavigate();
  const { trigger } = useRanking(); // trigger 값 가져오기

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const rankingsResponse = await axios.get('http://localhost:8765/api/reviews2/rankings');
        const hospitalsResponse = await axios.get('http://localhost:8765/hospitals');

        const hospitalMap = hospitalsResponse.data.reduce((map, hospital) => {
          map[hospital.hospitalId] = hospital;
          return map;
        }, {});

        const details = rankingsResponse.data.slice(0, 5).map(ranking => ({
          id: ranking.hospitalId,
          name: hospitalMap[ranking.hospitalId]?.hospitalName || '알 수 없음',
          rating: ranking.averageRating.toFixed(1),
          maxRating: 5,
          address: hospitalMap[ranking.hospitalId]?.address || '주소 없음',
          operatingHours: hospitalMap[ranking.hospitalId]?.operatingHours || '운영시간 없음',
          imagePath: hospitalMap[ranking.hospitalId]?.imagePath || '/default-image.png',
        }));
        setHospitalDetails(details);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };

    // trigger 값이 변경될 때 데이터를 가져옴
    fetchRankings();
  }, [trigger]);

  const handleViewDetails = (hospitalId) => {
    navigate(`/hospital/${hospitalId}`);
  };

  return (
    <div className="footer-container">
      <h3 className="footer-title">🏆 동물병원 랭킹 Top 5</h3>
      <ul className="ranking-list">
        {hospitalDetails.map((hospital, index) => (
          <li key={hospital.id} className="ranking-item">
            <div className="hospital-info">
              <img
                src={hospital.imagePath}
                alt={`${hospital.name} 이미지`}
                className="hospital-image"
              />
              <div className="hospital-details">
                <div className="hospital-name">
                  {index + 1}. {hospital.name}
                </div>
                <div className="rating">
                  ⭐ {hospital.rating} / {hospital.maxRating}
                </div>
                <div className="hospital-extra-info">
                  {hospital.operatingHours} · {hospital.address}
                </div>
              </div>
              <button
                className="view-details-button"
                onClick={() => handleViewDetails(hospital.id)}
              >
                상세정보 보기
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;
