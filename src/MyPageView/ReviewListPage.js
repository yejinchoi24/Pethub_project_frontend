import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import "./ReviewListPage.css"; // CSS 파일 import
import "../HomeView/Home.css";  // 화면
import { Tab, Typography } from '@mui/material';

const ReviewListPage = () => {
	const [reviews, setReviews] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchReviews = async () => {
			const token = localStorage.getItem('token');
			if (!token) {
				navigate('/login');
				return;
			}

			try {
				const response = await axiosInstance.get('/mypage/reviews', {
					headers: { Authorization: `Bearer ${token}` },
				});
				setReviews(response.data);
			} catch (err) {
				console.error('리뷰를 불러오는 데 실패했습니다:', err);
				if (err.response?.status === 401) {
					navigate('/login');
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchReviews();
	}, [navigate]);

	if (isLoading) {
		return <p>로딩 중...</p>;
	}

	const containerStyle = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center', // 가로 가운데 정렬
		// minHeight: '100vh', // 화면 전체 높이
		gap: '16px', // 아이템 간 간격
		padding: '16px',
	};

	return (
		<div className='app-container'>
			<div style={containerStyle}>
				<Typography variant="h5" component="h1">
					내가 작성한 리뷰
				</Typography>
				<br />

				{reviews.length > 0 ? (
					<ul className="review-list">
						{reviews.map((review) => (
							<li key={review.reviewId} className="review-item">
								<div className="review-header">
									<strong>{review.hospitalName}</strong>
									<span>★ {review.rating}</span>
								</div>
								<div className="review-meta">
									<span>{new Date(review.visitDate).toLocaleDateString()}에 방문</span>
									<span>{new Date(review.createdAt).toLocaleDateString()}에 작성</span>
								</div>
								<div className="review-content">
									{/* <span>
										진료 항목  :  {review.medicalItem}<br />
										진료 비용  :  {review.price} 원
									</span> */}
									<span>{review.medicalItem} &nbsp; | &nbsp; {review.price}원</span>
								</div>
								<div className="review-text">
									{review.text}
								</div>
							</li>
						))}
					</ul>
				) : (
					<p className="no-review-message">작성한 리뷰가 없습니다.</p>
				)}
			</div>
		</div>
	);
};

export default ReviewListPage;
