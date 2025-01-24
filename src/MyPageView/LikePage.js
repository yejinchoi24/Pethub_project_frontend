import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import "../HomeView/Home.css";  // 화면
import { Typography } from '@mui/material';

const LikePage = () => {
    const [likes, setLikes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLikes = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login'); // 비로그인 상태 -> 로그인 페이지로 이동
                return;
            }

            try {
                const response = await axiosInstance.get('/mypage/like', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLikes(response.data); // 찜 데이터 설정
            } catch (err) {
                console.error('찜한 병원을 불러오는 데 실패했습니다:', err);
                if (err.response?.status === 401) {
                    navigate('/login'); // 인증 실패 시 로그인 페이지로 이동
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchLikes();
    }, [navigate]);

    if (isLoading) {
        return <p>로딩 중...</p>;
    }

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column', // 세로 방향으로 배치
        alignItems: 'center', // 가로 가운데 정렬
        gap: '16px', // 아이템 간 간격
        padding: '16px',
    };

    const cardStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '300px',
        border: '1px solid black',
        borderRadius: '8px',
        overflow: 'hidden',
    };

    const topSectionStyle = {
        display: 'flex',
        padding: '8px',
        gap: '8px',
    };

    const imageStyle = {
        width: '80px',
        height: '80px',
        objectFit: 'cover',
        borderRadius: '8px',
        border: '1px solid black',
    };

    const nameStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        flex: 1,
    };

    return (
        <div className="app-container">
            <Typography variant="h5" component="h1" sx={{ textAlign: 'center'}}>
                찜한 병원 목록
            </Typography>
            {likes.length === 0 ? (
                <p style={{ textAlign: 'center' }}>찜한 병원이 없습니다.</p>
            ) : (
                <div style={containerStyle}>
                    {likes.map((like) => (
                        <div key={like.likeId} style={cardStyle}>
                            <div style={topSectionStyle}>
                                <img
                                    src={like.image_Path}
                                    alt={`${like.hospitalName} 이미지`}
                                    style={imageStyle}
                                />
                                <div style={nameStyle}>{like.hospitalName}</div>
                            </div>
                            <button style={{ color: 'black', backgroundColor: '#ddd' }}  onClick={() => navigate(`/hospital/${like.hospitalId}`)}>병원 상세 보기</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LikePage;
