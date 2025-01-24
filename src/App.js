import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { RankingProvider } from './contexts/RankingContext';
import KakaoMap from './MapView/KakaoMap';

import LoginPage from './LoginView/LoginPage';
import SignUpPage from './LoginView/SignUpPage';
import UpdatePage from './LoginView/UpdatePage';

import MyPage from './MyPageView/MyPage';
import ReviewListPage from './MyPageView/ReviewListPage';
import ReviewDetailPage from './MyPageView/ReviewDetailPage';
import AddReviewPage from './MyPageView/AddReviewPage';
import LikePage from './MyPageView/LikePage';

import HospitalListPage from './HospitalView/HospitalListPage';
import HospitalDetailPage from './HospitalView/HospitalDetailPage';
import RecommendPage from './RecommendView/RecommendPage'; // 병원 추천 페이지 import
import Home from './HomeView/Home';

import Chatting from './ChattingView/Chatting';

import PetNoteForm from "./PetnoteView/PetNoteForm";
import PetNoteView from "./PetnoteView/PetNoteView";

import './App.css';


function App() {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get('http://localhost:8765/hospitals')
      .then((response) => {
        setHospitals(response.data);
        setFilteredHospitals(response.data);
      })
      .catch((error) => console.error('병원 정보를 불러오는 중 오류 발생:', error));
  }, []);
  //응답 데이터를 hospitals 상태와 filteredHospitals 상태에 저장.
  //필요한 컴포넌트에 hospitals 또는 filteredHospitals 상태를 props로 전달합니다.
  //왜 이렇게 설계되었는가?
//중앙 관리: App.js에서 병원 데이터를 한 번만 가져오고 모든 컴포넌트에 props로 전달해 불필요한 API 호출을 방지.

  const goToHospitalPage = (hospitalId) => {
    navigate(`/hospital/${hospitalId}`);
  };

  const handleSearch = (searchTerm) => {
    const results = hospitals.filter(hospital =>
      hospital.hospitalName.includes(searchTerm)
    );
    setFilteredHospitals(results);
    navigate('/hospitals');
  };

  const hideNavBar = location.pathname.startsWith('/hospital/');

  return (
    <RankingProvider>
      {/* <div className="App flex flex-col items-center h-screen bg-gray-100"> */}
      <div className="App flex flex-col items-center bg-gray-100">

        <div className="content-container w-full flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={<Home onSearch={handleSearch} />} 
            />
            <Route path="/map" element={<KakaoMap hospitals={filteredHospitals} onHospitalClick={goToHospitalPage} />} />
            <Route 
              path="/hospitals" 
              element={<HospitalListPage hospitals={filteredHospitals} onSearch={handleSearch} />} 
            />
            <Route path="/hospital/:id" element={<HospitalDetailPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mypage" element={<MyPage />} />
            {/* <Route path="/mypage/info" element={<InfoPage />} /> */}
            <Route path="/mypage/update" element={<UpdatePage />} />
            <Route path="/mypage/reviews" element={<ReviewListPage />} />
            <Route path="/mypage/reviews/:reviewId" element={<ReviewDetailPage />} />
            <Route path="/mypage/addReview" element={<AddReviewPage />} />
            <Route path="/recommend" element={<RecommendPage />} /> {/* 병원 추천 페이지 추가 */}
            <Route path="/" element={<RecommendPage />} />
            <Route path="/mypage/like" element={<LikePage />} /> 

            <Route path="/chatting" element={<Chatting />} />

            <Route path="/petnote" element={<PetNoteForm />} />
            <Route path="/petnote-view" element={<PetNoteView />} />
          </Routes>
        </div>
        {!hideNavBar && (
          <nav className="nav-bar w-full">
            <Link to="/" className="nav-link">
              <span>🏠</span>
              <span>홈</span>
            </Link>

            <Link to="/petnote-view" className="nav-link">
              <span>🐶</span>
              <span>펫수첩</span>
            </Link>

            <Link to="/chatting" className="nav-link">
              <span>✨</span>
              <span>AI채팅</span>
            </Link>

            <Link to="/hospitals" className="nav-link">
              <span>🏆 </span>
              <span>랭킹</span>
            </Link>
            {/* <Link to="/recommend" className="nav-link"> {/* 병원 추천 탭 추가 */}
              {/* <span>✨</span> */}
              {/* <span>추천</span> */}
            {/* </Link> */}
            <Link to="/map" className="nav-link">
              <span>🗺️</span>
              <span>지도</span>
            </Link>
            <Link to="/mypage" className="nav-link">
              <span>👤</span>
              <span>마이페이지</span>
            </Link>
          </nav>
        )}
      </div>
    </RankingProvider>
  );
}

export default App;
