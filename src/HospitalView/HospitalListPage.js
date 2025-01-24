import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import './HospitalListPage.css';

const HospitalListPage = () => {
  const [allHospitals, setAllHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all'); // 초기 상태를 '전체'로 설정
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const [rankingsResponse, hospitalsResponse, medicalItemsResponse] = await Promise.all([
          axios.get('http://localhost:8765/api/reviews2/rankings'),
          axios.get('http://localhost:8765/hospitals'),
          axiosInstance.get('/hospital-medicalItems'),
        ]);

        const hospitalMap = hospitalsResponse.data.reduce((map, hospital) => {
          map[hospital.hospitalId] = {
            id: hospital.hospitalId,
            name: hospital.hospitalName || '이름 없음',
            address: hospital.address || '주소 없음',
            imagePath: hospital.imagePath || '/default-image.png',
            medicalItems: [],
          };
          return map;
        }, {});

        if (Array.isArray(medicalItemsResponse.data)) {
          medicalItemsResponse.data.forEach(({ hospitalId, medicalItemNames }) => {
            if (hospitalMap[hospitalId]) {
              hospitalMap[hospitalId].medicalItems = [
                ...new Set([...hospitalMap[hospitalId].medicalItems, ...(medicalItemNames || [])]),
              ];
            }
          });
        }

        const rankedHospitals = rankingsResponse.data.map((ranking) => ({
          ...hospitalMap[ranking.hospitalId],
          rating: ranking.averageRating.toFixed(1),
        }));

        const unrankedHospitals = Object.values(hospitalMap).filter(
          (hospital) => !rankedHospitals.some((r) => r.id === hospital.id)
        );

        const allHospitals = [...rankedHospitals, ...unrankedHospitals];
        setAllHospitals(allHospitals);

        const initialSearchTerm = location.state?.searchTerm || '';
        setSearchTerm(initialSearchTerm);
        filterHospitals(allHospitals, initialSearchTerm, filterOption);
      } catch (error) {
        console.error('데이터 가져오는 중 오류 발생:', error);
      }
    };

    fetchHospitalData();
  }, [location.state]);

  const filterHospitals = (hospitals, term, option) => {
    const search = term.toLowerCase();
    const filtered = hospitals.filter((hospital) => {
      if (option === 'all') {
        // 이름, 주소, 진료 항목 중 하나라도 검색어가 포함되면 true
        const nameMatch = hospital.name?.toLowerCase().includes(search);
        const addressMatch = hospital.address?.toLowerCase().includes(search);
        const medicalItemMatch =
        Array.isArray(hospital.medicalItems) &&
        hospital.medicalItems.some((item) => item.toLowerCase().includes(search));

      return nameMatch || addressMatch || medicalItemMatch;
      }

      // 선택된 필터에 따라 병원 데이터 필터링
      switch (option) {
        case 'name':
          return hospital.name?.toLowerCase().includes(search);
        case 'address':
          return hospital.address?.toLowerCase().includes(search);
        case 'medicalItems':
          return (
            Array.isArray(hospital.medicalItems) &&
            hospital.medicalItems.some((item) => item.toLowerCase().includes(search))
          );
        default:
          return true;
      }
    });

    setFilteredHospitals(filtered);
  };


  useEffect(() => {
    filterHospitals(allHospitals, searchTerm, filterOption);
  }, [searchTerm, filterOption, allHospitals]);

  const handleViewDetails = (hospitalId) => {
    navigate(`/hospital/${hospitalId}`);
  };

  return (
    <div className="app-container">
      <div className="search-container">
        {/* <div class="custom-select"> */}
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="filter-select"
        >
          <option value="all">전체</option>
          <option value="name">이름</option>
          <option value="address">주소</option>
          <option value="medicalItems">진료 항목</option>
        </select>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <h3 className="ranking-title">🏥 동물병원 목록</h3>
      <ul className="hospital-ranking-list">
        {filteredHospitals.map((hospital, index) => (
          <li key={hospital.id} className="hospital-ranking-item">
            <div className="hospital-info">
              <img
                src={hospital.imagePath}
                alt={`${hospital.name} 이미지`}
                className="hospital-image"
              />

              <div className="hospital-details">
                <div className="hospital-name">
                  {`${index + 1}. ${hospital.name}`}
                </div>
                <div className="info-div">
                  <span className="info-label">평점 :</span>
                  <div className="rating">
                    ⭐ {hospital.rating ? `${hospital.rating} / 5` : "없음"}
                  </div>

                </div>
                <div className="info-div">
                  <span className="info-label">주소 :</span>
                  <span className="info-value">{hospital.address}</span>
                </div>
                <div className="info-div">
                  <span className="info-label">진료항목 :</span>
                  <span className={hospital.medicalItems.length > 0 ? 'info-value' : 'gray-text'}>
                    {hospital.medicalItems.join(', ') || ''}
                  </span>
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

export default HospitalListPage;
