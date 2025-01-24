import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // axiosInstance 사용

// AppTheme와 ColorModeSelect를 정의한 파일 경로에 맞게 가져옵니다.
import AppTheme from './AppTheme'; 
import ColorModeSelect from './ColorModeSelect';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function LoginPage(props) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("!! Submitting login request with:", formData); // 요청 데이터 확인
      const response = await axiosInstance.post('/auth/login', {
        email: formData.email, // 입력된 이메일
        password: formData.password, // 입력된 비밀번호
      });  
      // const response = await axiosInstance.post('/auth/login', formData);    
      console.log("!! 로그인 response:", response.data); // 서버 응답 확인
      const { token } = response.data;
  
      if (token) {
        console.log("!! Token received:", token);
        localStorage.setItem('token', token);
        console.log('로그인 - 로컬저장소 토큰: ', localStorage.getItem('token'));
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
        navigate('/mypage');
      } else {
        setError('로그인 실패: 서버에서 토큰을 받지 못했습니다.');
      }
    } catch (err) {
      console.error('!! 로그인 에러:', err.response?.data || err.message);
      setError('로그인에 실패했습니다.');
    }
  };  
  

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            로그인
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">이메일</FormLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="example@example.com"
                autoComplete="email"
                autoFocus
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">비밀번호</FormLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="••••••"
                autoComplete="current-password"
                fullWidth
                variant="outlined"
              />
            </FormControl>
            {error && (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            )}

            <Button type="submit" fullWidth variant="contained">
              로그인
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              계정이 없으신가요?{' '}
              <Link href="/signup" variant="body2">
                회원가입
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}