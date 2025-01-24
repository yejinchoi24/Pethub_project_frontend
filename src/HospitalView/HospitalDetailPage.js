import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './HospitalDetailPage.css';
import Review from './Review'; // 리뷰 컴포넌트 import
import Rating from './Rating'; // 평점 
import axiosInstance from '../api/axiosInstance';
import "../HomeView/Home.css";

function HospitalDetailPage() {
  const { id } = useParams(); // 병원ID
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]); // 리뷰 데이터를 저장할 상태 추가
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태 추가

  const location = useLocation();

  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({
    total: 0,
    scores: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  const [medicalItems, setMedicalItems] = useState([]); // 진료항목

  // !!!
  // 평점 계산 함수: useEffect 외부로 이동
  const calculateRatings = (reviews) => {
    if (!reviews || reviews.length === 0) {
      setAverageRating(0);
      setRatingDistribution({
        total: 0,
        scores: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
      return;
    }

    const totalReviews = reviews.length;
    const scoreCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((review) => {
      const rating = review.rating || 0; // rating 값이 없을 경우 0으로 처리
      if (rating >= 1 && rating <= 5) {
        scoreCounts[rating] += 1;
      }
    });

    const average =
      reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
      totalReviews;

    const distribution = {
      total: totalReviews,
      scores: Object.fromEntries(
        Object.entries(scoreCounts).map(([score, count]) => [
          score,
          ((count / totalReviews) * 100).toFixed(1),
        ])
      ),
    };

    setAverageRating(average);
    setRatingDistribution(distribution);
  };


  // 병원 정보와 리뷰 데이터, 찜 상태 가져오기
  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const response = await axios.get('http://localhost:8765/hospitals');
        const hospitals = response.data;

        const selectedHospital = hospitals.find(
          hospital => hospital.hospitalId === parseInt(id, 10)
        );

        if (selectedHospital) {
          setHospital({
            hospitalName: selectedHospital.hospitalName || '병원 이름 없음',
            address: selectedHospital.address || '주소 정보 없음',
            phoneNumber: selectedHospital.phoneNumber || '정보 없음',
            operatingHours: selectedHospital.operatingHours || '정보 없음',
            imagePath: selectedHospital.imagePath || '/default-image.png',
          });
        } else {
          setError('해당 병원을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('Error fetching hospital data:', err);
        setError('병원 데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8765/api/reviews2');
        const hospitalReviews = response.data.filter(
          review => review.hospitalId === parseInt(id, 10)
        );
        setReviews(hospitalReviews);
        calculateRatings(hospitalReviews); // 리뷰 데이터를 기반으로 평점 계산
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    const fetchLikeStatus = async () => {
      try {
        const token = localStorage.getItem('token'); // JWT 토큰 가져오기
        const response = await axiosInstance.get('/likehospital', {
          params: { hospitalId: id }, // 병원 ID 전달
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("!! 찜 hospitalID : ", id);
        setIsLiked(response.data.liked); // 서버에서 찜 상태 가져오기
      } catch (err) {
        console.error('Error fetching like status:', err);
      }
    };

    const fetchMedicalItems = async () => {
      try {
        const response = await axiosInstance.get(
          `/hospital-medicalItems/${id}` // baseURL이 이미 설정되어 있으므로 상대 경로 사용
        );
        setMedicalItems(response.data); // 진료 항목 데이터 저장
      } catch (err) {
        console.error('Error fetching medical items:', err);
      }
    };

    fetchHospitalData();
    fetchReviews();
    fetchLikeStatus(); // 찜 상태 가져오기
    fetchMedicalItems();
  }, [id]);

  const toggleLike = async () => {
    try {
      const token = localStorage.getItem('token'); // JWT 토큰 가져오기
      const response = await axiosInstance.post('/likehospital', null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { hospitalId: id }, // 병원 ID 전달
      });
      setIsLiked(response.data.liked); // 서버에서 토글 후 찜 상태 업데이트
    } catch (err) {
      console.error('Error toggling like status:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  const isHospitalDetailPage = location.pathname === `/hospital/${id}`; // 현재 URL 확인

  return (
    // <div className="hospital-detail-page">
    <div className='app-container'>
      <header className="header">
        <button className="back-button" onClick={() => navigate(-1)}>⬅️</button>
        <h2>병원 상세 정보</h2>
      </header>

      <div className="hospital-info">
        <img
          src={hospital.imagePath}
          alt={`${hospital.hospitalName} 이미지`}
          // className="hospital-image"
          className={`hospital-image ${isHospitalDetailPage ? 'hospital-page-image' : ''}`}
        />
        <div className="hospital-details">
          <h3>
            {hospital.hospitalName}{' '}
            <button
              className="like-button"
              onClick={toggleLike}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              {isLiked ? '❤️' : '🤍'}
            </button>
          </h3>
          <div className="info-item">
            <span className="info-label">주소:</span>
            <span className="info-value">{hospital.address}</span>
          </div>
          <div className="info-item">
            <span className="info-label">연락처:</span>
            <span className="info-value">{hospital.phoneNumber}</span>
          </div>
          <div className="info-item">
            <span className="info-label">영업 시간:</span>
            <span className="info-value">{hospital.operatingHours}</span>
          </div>
          <div className="info-item">
            <span className="info-label">진료 항목:</span>
            <span className="info-value">
              {medicalItems.length > 0 ? (
                medicalItems.join(', ')
              ) : (
                ''
              )}
            </span>
          </div>
        </div>
      </div>

      <Rating averageRating={averageRating} ratingDistribution={ratingDistribution} />

      {/* 리뷰 섹션 */}
      <Review reviews={reviews} />


      {/* 예약하기 버튼 */}
      <a
        href={`tel:${hospital.phoneNumber}`}
        className="reservation-button"
      >
        예약하기
      </a>
    </div>
  );
}

export default HospitalDetailPage;
