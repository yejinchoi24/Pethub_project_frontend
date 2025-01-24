import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useRanking } from '../contexts/RankingContext';
import './AddReviewPage.css'; // CSS 파일 import
import "../HomeView/Home.css";
import { Box, Button, Typography } from '@mui/material';

const AddReviewPage = () => {
  const navigate = useNavigate();
  const { updateRanking } = useRanking();
  const [review, setReview] = useState({
    hospitalName: '',
    visitDate: '',
    rating: 0,
    text: '',
    price: '',
    medicalItem: '', // 진료항복
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [hospitalCheckMessage, setHospitalCheckMessage] = useState('');
  const [isHospitalValid, setIsHospitalValid] = useState(false);
  const [textError, setTextError] = useState('');
  const [extractedData, setExtractedData] = useState(null); // OCR로 추출된 데이터
  const [isManualInput, setIsManualInput] = useState(false); // 수동 입력 여부
  const [priceError, setPriceError] = useState(''); // 비용 입력 오류 메시지

  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // 드롭다운 메뉴 표시 여부
  const [hoveredCategory, setHoveredCategory] = useState(null); // 현재 마우스가 올라간 카테고리
  const [selectedSubItem, setSelectedSubItem] = useState(""); // 최종 선택된 항목

  // !!!!!
  // 진료 항목 데이터
  const medicalItems = [
    { category: '일반 진료', subItems: ['건강검진', '예방접종', '기생충 검사 및 치료',
        '처방식 사료 상담', '비만 관리', '노령 동물 관리'] },
    { category: '내과 진료', subItems: ['소화기 질환 (구토, 설사 등)', '호흡기 질환 (감기, 폐렴 등)',
        '심혈관계 질환 (심부전, 고혈압 등)', '신장 질환 (요로 결석, 신부전 등)',
        '간 질환 (간염, 간경화 등)', '당뇨 및 내분비 질환'] },
    { category: '외과 진료', subItems: ['중성화 수술', '종양 제거 수술', '장기 외상 치료',
        '정형외과 수술 (골절, 슬개골 탈구 등)', '소프트 티슈 수술 (피부, 치아 등)'] },
    { category: '응급 진료', subItems: ['중독 치료', '심폐소생술', '사고 및 외상 치료',
        '출혈 및 골절 응급 처치', '급성 알레르기 반응 치료'] },
    { category: '치과 진료', subItems: ['치석 제거 및 스케일링', '치아 발치',
        '치주 질환 관리', '치아 교정 및 보철'] },
    { category: '피부과 진료', subItems: ['알레르기 검사 및 치료', '곰팡이 및 세균성 피부질환 치료', '탈모 및 피부염 관리'] },
    { category: '안과 진료', subItems: ['백내장 및 녹내장 치료', '안구 염증 치료', '각막 손상 치료', '안검 성형 및 수술'] },
    { category: '산부인과 진료', subItems: ['임신 확인 및 출산 관리', '제왕절개', '생식기 질환 치료'] },
    { category: '영상 및 검사', subItems: ['X-ray 촬영', '초음파 검사', 'CT/MRI', '혈액 검사', '소변/대변 검사'] },
    { category: '재활 및 물리치료', subItems: ['물리치료 및 레이저 치료', '재활 운동', '관절염 관리'] },
    { category: '특수 진료', subItems: ['특수 동물 진료 (파충류, 조류 등)', '행동학 상담 (스트레스, 공격성 등)'] },
    { category: '기타', subItems: ['기타'] },
  ];

  // 드롭다운 토글
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // 하위 항목 선택
  const handleSubItemSelect = (subItem) => {
    setSelectedSubItem(subItem);
    setReview((prev) => ({
      ...prev,
      medicalItem: subItem,
    }));
    setIsDropdownVisible(false); // 드롭다운 닫기
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ------------------------------------------------------------------
  // OCR 파일 선택
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // 선택된 파일
    if (file) {
      setSelectedFile(file); // 파일이 첨부되었을 경우 상태 업데이트
      setError(''); // 오류 메시지 초기화
    } else {
      setSelectedFile(null); // 파일이 없으면 상태 초기화
      setError('영수증 이미지를 첨부해주세요'); // 오류 메시지 설정
    }
  };


  // OCR 데이터 추출
  const handleExtract = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('영수증 이미지를 첨부해주세요.');
      return;
    }
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axiosInstance.post('/mypage/addReview/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      setExtractedData(data); // 추출된 데이터 저장
      // setIsManualInput(false); // 자동 입력 상태로 전환
    } catch (error) {
      console.error('OCR 처리 중 오류 발생:', error);
      setError('OCR 처리 중 오류가 발생했습니다.');
    }
  };

  // OCR 데이터 확인 버튼
  const handleConfirm = () => {
    if (extractedData) {
      setReview((prev) => ({
        ...prev,
        hospitalName: extractedData.hospitalName || '',
        price: extractedData.price?.toString() || '', // 비용 데이터를 문자열로 변환
        visitDate: extractedData.visitDate || '',
      }));

      // 병원 유효성 확인
      if (extractedData.hospitalName) {
        checkHospitalWithName(extractedData.hospitalName);
      }
    }
  };


  // "직접 입력" 버튼
  const handleManualInput = () => {
    setIsManualInput(true); // 수동 입력 모드 활성화
    setReview((prev) => ({
      ...prev,
      hospitalName: '',
      price: '',
      visitDate: '',
    }));
    setPriceError('비용을 입력해주세요.');
    setHospitalCheckMessage('병원 이름을 입력해주세요.');
    setIsHospitalValid(false); // 유효성 초기화
  };

  // 병원 확인 함수 (추출된 병원명을 인자로 받음)
  const checkHospitalWithName = async (hospitalName) => {
    if (!hospitalName.trim()) {
      setHospitalCheckMessage('병원 이름을 입력해주세요.');
      setIsHospitalValid(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/mypage/addReview/check-hospital', {
        params: { hospitalName },
      });
      setHospitalCheckMessage(response.data);
      setIsHospitalValid(response.data === '해당 병원이 존재합니다.');
    } catch (error) {
      console.error('병원 확인 중 오류 발생:', error);
      setHospitalCheckMessage('병원 확인 중 오류가 발생했습니다.');
      setIsHospitalValid(false);
    }
  };

  // ------------------------------------------------------------------


  const checkHospital = async () => {
    if (!review.hospitalName.trim()) {
      setHospitalCheckMessage('병원 이름을 입력해주세요.');
      setIsHospitalValid(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/mypage/addReview/check-hospital', {
        params: { hospitalName: review.hospitalName },
      });

      setHospitalCheckMessage(response.data);
      setIsHospitalValid(response.data === '해당 병원이 존재합니다.');
    } catch (error) {
      console.error('병원 확인 중 오류 발생:', error);
      setHospitalCheckMessage('병원 확인 중 오류가 발생했습니다.');
      setIsHospitalValid(false);
    }
  };

  const handleStarClick = (rating) => {
    setReview((prev) => ({
      ...prev,
      rating,
    }));
  };

  const validatePrice = () => {
    const price = review.price.trim(); // 문자열로 처리
    if (!price) {
      setPriceError('비용을 입력해주세요.');
    } else if (!/^\d+$/.test(price)) {
      setPriceError('숫자만 입력 가능합니다.');
    } else if (parseInt(price, 10) < 10) {
      setPriceError('비용은 10 이상이어야 합니다.');
    } else {
      setPriceError(''); // 오류 없을 경우 초기화
    }
  };

  const handleText = (e) => {
    const textValue = e.target.value;
    if (textValue.length < 10) {
      setTextError('최소 10글자 이상 적어주세요.');
    } else {
      setTextError('');
    }
    setReview((prev) => ({
      ...prev,
      text: textValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isHospitalValid) {
      alert('유효한 병원 이름을 입력해주세요.');
      return;
    }

    if (review.rating < 1) {
      alert('평점을 선택해주세요.');
      return;
    }

    // !!!!!
    if (!review.medicalItem) {
      alert('진료 항목을 선택해주세요.');
      return;
    }

    // 비용 데이터 검증
    const price = parseInt(review.price.trim(), 10); // 문자열을 숫자로 변환
    if (isNaN(price) || price < 10) {
      setPriceError('비용은 10 이상이어야 합니다.');
      alert('비용을 확인해주세요.');
      return;
    }

    if (review.text.length < 10) {
      alert('리뷰 내용을 10자 이상 작성해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인 후 이용해주세요.');
        navigate('/login');
        return;
      }

      // 서버로 보낼 데이터 생성
      const reviewData = {
        ...review,
        price, // 문자열에서 숫자로 변환된 비용
      };

      await axiosInstance.post('/mypage/addReview', reviewData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('리뷰가 성공적으로 작성되었습니다.');
      updateRanking();
      navigate('/mypage');
    } catch (err) {
      console.error('리뷰 작성 중 오류가 발생했습니다:', err);
      alert('리뷰 작성 중 오류가 발생했습니다.');
    }
  };


  return (
    <div className="app-container">
      <div className="add-review-container">
        <Typography variant="h5" component="h1" sx={{ textAlign: 'center' }}>
          리뷰 작성하기
        </Typography>
        <br /><hr /><br />

        {/* OCR 파일 첨부 */}
        <Box component="form" onSubmit={handleExtract} mb={3} textAlign="center">
          <Typography variant="body1" color="textSecondary" mb={1}>
            영수증 이미지가 있다면 첨부해주세요
          </Typography>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <Button type="submit" variant="contained" sx={{ ml: 2 }}>
            OCR 추출
          </Button>
          {error && <Typography color="error">{error}</Typography>}
        </Box>

        {extractedData && (
          <Box textAlign="center" mb={3}>
            {selectedFile && (
              <Box
                mb={2}
                display="flex"
                justifyContent="center"
                alignItems="center">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="첨부한 이미지 미리보기"
                  style={{
                    maxWidth: '50%',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                  }}
                />
              </Box>
            )}
            <Typography variant="body1" color="textSecondary" mb={2}>
              추출된 내용을 확인해주세요
            </Typography>
            <Typography>병원명: {extractedData.hospitalName || 'N/A'}</Typography>
            <Typography>비용: {extractedData.price || 'N/A'}</Typography>
            <Typography>방문 날짜: {extractedData.visitDate || 'N/A'}</Typography>
            <Box mt={2}>
              <Button variant="outlined" onClick={handleConfirm} sx={{ mr: 2 }}>
                확인
              </Button>
              <Button variant="contained" onClick={handleManualInput}>
                직접 입력
              </Button>
            </Box>
          </Box>
        )}

        <br /><hr /><br />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="hospitalName">병원 이름:</label>
            <input
              type="text"
              id="hospitalName"
              name="hospitalName"
              value={review.hospitalName}
              onChange={handleInputChange}
              onBlur={checkHospital}
              required
            />
            {hospitalCheckMessage && (
              <p className={`feedback-message ${isHospitalValid ? 'success' : 'error'}`}>
                {hospitalCheckMessage}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="visitDate">방문 날짜 (YYYY-MM-DD):</label>
            <input
              type="date"
              id="visitDate"
              name="visitDate"
              value={review.visitDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>평점 (클릭하여 선택):</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= review.rating ? 'star filled' : 'star'}
                  onClick={() => handleStarClick(star)}
                >
                  {star <= review.rating ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>

          {/* 진료 항목 드롭다운 */}
          <div className="form-group">
            <label htmlFor="medicalItem">진료 항목:</label>
            <div className="dropdown">
              <input
                type="text"
                id="medicalItem"
                className="selected-input"
                value={selectedSubItem || "진료 항목을 선택해주세요"}
                onClick={toggleDropdown}
                readOnly
                required
              />

              {isDropdownVisible && (
                <ul className="dropdown-menu">
                  {medicalItems.map((item, index) => (
                    <li
                      key={index}
                      className="dropdown-category"
                      onMouseEnter={() => setHoveredCategory(item.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      {item.category} {item.subItems.length > 0 && <span className="arrow-icon">▶</span>}
                      {hoveredCategory === item.category && item.subItems.length > 0 && (
                        <ul className="submenu">
                          {item.subItems.map((subItem, subIndex) => (
                            <li
                              key={subIndex}
                              className="submenu-item"
                              onClick={() => handleSubItemSelect(subItem)}
                            >
                              {subItem}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="price">비용 (원):</label>
            <input
              type="text"
              id="price"
              name="price"
              value={review.price}
              onChange={handleInputChange}
              onBlur={validatePrice}
              required
            />
            {priceError && (
              <p className={`feedback-message ${priceError ? 'error' : 'success'}`}>
                {priceError}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="text">리뷰 내용:</label>
            <textarea
              id="text"
              name="text"
              value={review.text}
              onChange={handleText}
              required
            />
            {textError && (
              <p className={`feedback-message ${textError ? 'error' : 'success'}`}>
                {textError}
              </p>
            )}
          </div>
          <button type="submit" className="submit-button">
            리뷰 추가
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReviewPage;