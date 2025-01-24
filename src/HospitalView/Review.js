import React from 'react';
import "./Review.css";

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // 가로 가운데 정렬
  // minHeight: '100vh', // 화면 전체 높이
  gap: '16px', // 아이템 간 간격
  padding: '16px',
}

const Review = ({ reviews }) => {
  return (
    <div className='review-list-container'>
      <h3 className="review-list-title">리뷰 ( {reviews.length} )</h3>

      <div style={containerStyle}>
        {reviews.length > 0 ? (
          <ul className="review-list">
            {reviews.map((review, index) => (
              <li key={index} className="review-item">
                <div className="review-header">
                  {/* <strong>{review.petownerName}</strong> */}
                  <span>★ {review.rating}</span>
                </div>
                <div className="review-meta">
                  <span>{new Date(review.visitDate).toLocaleDateString()}에 방문</span>
                  <span>{new Date(review.createdAt).toLocaleDateString()}에 작성</span>
                </div>
                <div className="review-content">
                  <span>{review.medicalItem} &nbsp; | &nbsp; {review.price}원</span>
                </div>
                <div className="review-text">
                  {review.text}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-review-message">아직 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Review;
