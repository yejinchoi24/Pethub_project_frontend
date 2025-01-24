import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RecommendPage.css';

const HospitalRecommendation = ({ isEmergency }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('distance'); // 정렬 기준: 'distance' 또는 'rating'
  const navigate = useNavigate();

  // 사용자 위치 가져오기
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (error) => {
        console.error('사용자 위치를 가져오는 중 오류 발생:', error);
        setUserLocation(null);
      }
    );
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // 지구 반지름 (km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 거리 (km)
  };

  const fetchRecommendations = async () => {
    if (!userLocation) {
      alert('사용자 위치를 가져오는 중입니다. 잠시 후 다시 시도하세요.');
      return;
    }

    setLoading(true);
    try {
      const hospitalUrl = isEmergency
        ? 'http://localhost:8765/hospitals/emergency-hospitals'
        : 'http://localhost:8765/hospitals';
      const rankingUrl = 'http://localhost:8765/api/reviews2/rankings';

      const [hospitalResponse, rankingResponse] = await Promise.all([
        axios.get(hospitalUrl),
        axios.get(rankingUrl),
      ]);

      const hospitals = hospitalResponse.data;
      const rankings = rankingResponse.data;

      // API 데이터 형식을 통일
      const mappedHospitals = hospitals.map((hospital) => {
        if (isEmergency) {
          return {
            id: hospital.id,
            name: hospital.name || '알 수 없음',
            address: hospital.address || '주소 없음',
            phoneNumber: hospital.phoneNumber || '전화번호 없음',
            lat: hospital.latitude,
            lng: hospital.longitude,
            imagePath: 'https://res.cloudinary.com/dhepeudxr/image/upload/v1733725220/스크린샷_2024-12-09_오후_3.19.59_y5xr2m.png',
          };
        } else {
          return {
            id: hospital.hospitalId,
            name: hospital.hospitalName || '알 수 없음',
            address: hospital.address || '주소 없음',
            phoneNumber: hospital.phoneNumber || '전화번호 없음',
            lat: hospital.lat,
            lng: hospital.lng,
            imagePath: hospital.imagePath || '/',
          };
        }
      });

      // 거리와 평점을 추가
      const enrichedHospitals = mappedHospitals.map((hospital) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          hospital.lat,
          hospital.lng
        );
        const rank = rankings.find((r) => r.hospitalId === hospital.id);
        return {
          ...hospital,
          distance,
          rating: rank ? rank.averageRating.toFixed(1) : '평점 없음',
        };
      });

      // 정렬 로직 적용
      const sortedHospitals = enrichedHospitals.sort((a, b) => {
        if (sortBy === 'distance') {
          if (a.distance === b.distance) {
            if (a.rating === '평점 없음' && b.rating === '평점 없음') return 0;
            if (a.rating === '평점 없음') return 1;
            if (b.rating === '평점 없음') return -1;
            return b.rating - a.rating;
          }
          return a.distance - b.distance;
        } else if (sortBy === 'rating') {
          if (a.rating === '평점 없음' && b.rating === '평점 없음') {
            return a.distance - b.distance;
          }
          if (a.rating === '평점 없음') return 1;
          if (b.rating === '평점 없음') return -1;
          return b.rating - a.rating;
        }
        return 0;
      });

      setRecommendations(sortedHospitals.slice(0, 10)); // 상위 10개 병원만 추천
    } catch (error) {
      console.error('추천 데이터를 가져오는 중 오류 발생:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recommendation-container">
      <h2>{isEmergency ? '응급 병원 추천' : '일반 병원 추천'}</h2>
      <div className="filter-container">
        <label htmlFor="sort-by">정렬 기준:</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="distance">거리 우선</option>
          <option value="rating">평점 우선</option>
        </select>
      </div>
      <button
        onClick={fetchRecommendations}
        className="recommendation-button"
        disabled={loading}
      >
        {loading ? '추천을 불러오는 중...' : '추천 받기'}
      </button>
      <div className="recommendation-results">
        {recommendations.map((hospital) => (
          <div key={hospital.id} className="hospital-item">
            <div>
              <img
                src={hospital.imagePath}
                alt={hospital.name}
                className="hospital-image"
                onError={(e) => (e.target.src = '/default-image.png')}
              />
              <h3>{hospital.name}</h3>
              <p>주소: {hospital.address}</p>
              <p>평점: {hospital.rating}</p>
              <p>거리: {hospital.distance.toFixed(2)} km</p>
            </div>
            <div className="button-container">
              <button
                className="details-button"
                onClick={() => navigate(`/hospital/${hospital.id}`)}
              >
                상세정보 보기
              </button>
              <a href={`tel:${hospital.phoneNumber}`} className="call-button">
                전화걸기
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalRecommendation;
