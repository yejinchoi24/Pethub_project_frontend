import React from 'react';
import './Rating.css';

function Rating({ averageRating, ratingDistribution }) {
  return (
    <div className="rating-container">
      <h3 className="rating-title">평점</h3>
      <div className="rating-content">
        {/* 평균 평점과 총 평점 수 */}
        <div className="average-rating-container">
          <div className="average-rating">
            <span className="rating-value">★ {averageRating.toFixed(1)}</span>
          </div>
          <div className="rating-count">({ratingDistribution.total}명)</div>
        </div>

        {/* 평점 분포 */}
        <div className="rating-distribution">
          {Object.entries(ratingDistribution.scores).map(([score, percentage]) => (
            <div key={score} className="rating-item">
              <div className="rating-score">{score}점:</div>
              <div className="rating-bar">
                <div
                  className="rating-bar-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="rating-percentage">{percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Rating;
