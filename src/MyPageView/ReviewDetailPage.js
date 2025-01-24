import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const ReviewDetailPage = () => {
  const { reviewId } = useParams(); // URL 파라미터로부터 reviewId 가져오기
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axiosInstance.get(`/mypage/reviews/${reviewId}`);
        setReview(response.data);
      } catch (err) {
        console.error('리뷰를 가져오는 데 실패했습니다:', err);
        navigate('/mypage'); // 실패 시 마이페이지로 이동
      } finally {
        setIsLoading(false);
      }
    };

    fetchReview();
  }, [reviewId, navigate]);

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  return review ? (
    <div>
      <h1>리뷰 상세 정보</h1>
      <p>병원 이름: {review.hospitalName}</p>
      <p>작성자: {review.petOwnerName}</p>
      <p>평점: {review.rating}</p>
      <p>내용: {review.text}</p>
      <p>방문일: {review.visitDate}</p>
      <p>작성일: {review.createdAt}</p>
      <button onClick={() => navigate('/mypage')}>마이페이지로 돌아가기</button>
    </div>
  ) : (
    <p>리뷰를 불러오는 데 실패했습니다.</p>
  );
};

export default ReviewDetailPage;
