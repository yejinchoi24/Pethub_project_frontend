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
import { styled } from '@mui/material/styles';
import Link from '@mui/material/Link';
import axios from 'axios';
import AppTheme from './AppTheme';
import ColorModeSelect from './ColorModeSelect';
import axiosInstance from '../api/axiosInstance';

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

const SignUpContainer = styled(Stack)(({ theme }) => ({
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

const SignUpPage = (props) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setError = (field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleName = () => {
    if (!formData.name || formData.name.length < 2) {
      setError('name', '이름은 2글자 이상이어야 합니다.');
    } else {
      setError('name', '');
    }
  };

  const handleEmail = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('email', '올바른 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8765/api/petowner/email-check', {
        email: formData.email,
      });

      if (response.data !== 'ok') {
        setError('email', '이미 사용 중인 이메일입니다.');
        return false;
      } else {
        setError('email', '');
        return true;
      }
    } catch (error) {
      console.error('Error Response:', error.response);
      if (error.response?.status === 409) {
        setError('email', '이미 사용 중인 이메일입니다.');
      } else {
        setError('email', '이메일 확인 중 오류가 발생했습니다.');
      }
      return false;
    }
  };

  const handlePassword = () => {
    const passwordRegex = /^.{8,}$/; // 비밀번호 길이만 확인
    const containsLetter = /[a-zA-Z]/; // 영문자 확인
    const containsNumber = /\d/; // 숫자 확인

    if (!formData.password || !passwordRegex.test(formData.password)) {
      setError('password', '비밀번호는 8자 이상이어야 합니다.');
    } else if (!containsLetter.test(formData.password)) {
      setError('password', '비밀번호는 영문을 포함해야 합니다.');
    } else if (!containsNumber.test(formData.password)) {
      setError('password', '숫자가 최소 1개 포함되어야 합니다.');
    } else {
      setError('password', '');
    }
  };

  const handlePhone = () => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      setError('phone', '올바른 전화번호 형식(010-XXXX-XXXX)을 입력해주세요.');
    } else {
      setError('phone', '');
    }
  };

  const validateAll = () => {
    handleName();
    handleEmail();
    handlePassword();
    handlePhone();
    return Object.values(errors).every((msg) => msg === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      alert('입력값을 확인해주세요.');
      return;
    }

    try {
      await axiosInstance.post('/petowner/signup', formData);
      alert('회원가입이 완료되었습니다.');
      window.location.href = '/login';
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('회원가입에 실패했습니다.');
    }
  };
  
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            회원가입
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">이름</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                fullWidth
                id="name"
                placeholder="이름"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleName}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">이메일</FormLabel>
              <TextField
                fullWidth
                id="email"
                placeholder="example@example.com"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleEmail}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">비밀번호</FormLabel>
              <TextField
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handlePassword}
                error={!!errors.password}
                helperText={errors.password}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="phone">전화번호</FormLabel>
              <TextField
                fullWidth
                name="phone"
                placeholder="010-1234-5678"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handlePhone}
                error={!!errors.phone}
                helperText={errors.phone}
                required
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
            >
              회원가입
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              이미 계정이 있으신가요?{' '}
              <Link href="/login" variant="body2">
                로그인
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
};

export default SignUpPage;
