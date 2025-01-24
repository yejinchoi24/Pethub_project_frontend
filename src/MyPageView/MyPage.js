import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import './MyPage.css'; // CSS 파일 import
import "../HomeView/Home.css";  // 화면
import { Button } from '@mui/material';

const MyPage = () => {
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      const token = localStorage.getItem('token');
      console.log('!! 마이페이지 JWT Token:', token); // 토큰 로그 출력
      if (!token) {
        console.warn('!! No token found in localStorage');
        navigate('/login');
      }

      try {
        const response = await axiosInstance.get('/mypage', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('!! 마이페이지 Response Data:', response.data); // 서버 응답 로그 출력
        setUserName(response.data.name);
      } catch (err) {
        console.error('!! Error fetching data:', err.response?.data || err.message);
        if (err.response?.status === 401) {
          console.warn('!! 401 Unauthorized - token may be invalid or expired');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchUserName();
  }, [navigate]);
  const handleInfoView = () => {
    // navigate('/mypage/info');
    navigate('/mypage/update');
  };
  const handleReviewView = () => {
    navigate('/mypage/reviews');
  };
  const handleAddReviewView = () => {
    navigate('/mypage/addReview');
  };
  const handleLikeView = () => {
    navigate('/mypage/like');
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 삭제
      alert('로그아웃 되었습니다.');
      navigate('/login'); // 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="profile-container">
        <img
          src="https://res.cloudinary.com/dhepeudxr/image/upload/v1733898559/스크린샷_2024-12-11_오후_3.18.02_iujsmk.png" // 강아지 이미지 (샘플)
          alt="사용자 프로필"
          className="profile-image"
        />
        <div className="user-info">
          <h2 className="user-name">{userName || '사용자'} 님</h2>
        </div>
      </div>
      <hr className="divider" />
      <ul className="menu-list">
        <li onClick={handleInfoView}>내 정보 보기</li>
        <li onClick={handleReviewView}>내가 작성한 리뷰</li>
        <li onClick={handleAddReviewView}>리뷰 작성하기</li>
        <li onClick={handleLikeView}>찜 목록</li>
      </ul>

      <hr className="divider" />
      <div className="logout-container">
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: '#d32f2f',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#9a0007',
            },
          }}
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      </div>
    </div>
  );
};

export default MyPage;
