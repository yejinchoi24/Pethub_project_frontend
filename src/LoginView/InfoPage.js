// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../api/axiosInstance';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Button from '@mui/material/Button';
// import "../HomeVue/Home.css";  // 화면

// const InfoPage = () => {
//   const [userInfo, setUserInfo] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login'); // 비로그인 상태 -> 로그인 페이지로 이동
//         return;
//       }

//       try {
//         const response = await axiosInstance.get('/mypage/info'); // 사용자 정보 가져오기
//         setUserInfo(response.data); // 사용자 정보 상태 설정
//       } catch (error) {
//         console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
//         navigate('/login'); // 인증 실패 시 로그인 페이지로 이동
//       }
//     };

//     fetchUserInfo();
//   }, [navigate]);

//   const handleUpdate = () => {
//     navigate('/mypage/update'); // 수정 페이지로 이동
//   };

//   return (
//     <div className="app-container">
//       <Box sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           padding: 4,
//           gap: 2,
//           width: '100%',
//         }}>
//         <Typography variant="h5" component="h1">
//           사용자 정보
//         </Typography>

//         {userInfo ? (
//           <>
//             <Box sx={{
//                 display: 'flex',
//                 flexDirection: 'column', // 세로 방향으로 정렬
//                 gap: 2,
//                 border: '1px solid #ddd', // 테두리 추가
//                 padding: 3,
//                 borderRadius: 4,
//                 width: '100%',
//                 maxWidth: '400px', // 가로 크기 제한
//                 backgroundColor: '#f9f9f9', // 박스 배경색
//             }}>
//               <Typography><strong>이메일:</strong> {userInfo.email}</Typography>
//               <Typography><strong>이름:</strong> {userInfo.name}</Typography>
//               <Typography><strong>전화번호:</strong> {userInfo.phone}</Typography>
//             </Box>

//             <Box sx={{ display: 'flex', gap: 2, marginTop: 4, width: '100%' }}>
//               <Button
//                 type="button"
//                 fullWidth
//                 variant="contained"
//                 sx={{
//                   backgroundColor: '#1976d2',
//                   color: '#ffffff',
//                   '&:hover': {
//                     backgroundColor: '#115293',
//                   },
//                 }}
//                 onClick={handleUpdate}
//               >
//                 내 정보 수정하기
//               </Button>
//             </Box>
//           </>
//         ) : (
//           <Typography>사용자 정보를 불러오는 중입니다...</Typography>
//         )}
//       </Box>
//     </div>
//   );
// };

// export default InfoPage;
