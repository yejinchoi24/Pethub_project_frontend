import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axiosInstance from '../api/axiosInstance';
import "../HomeView/Home.css";  // 화면

const UpdatePage = () => {
  const [formData, setFormData] = useState({
    petownerId: '',
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [errors, setErrors] = useState({
    password: '',
    name: '',
    phone: '',
  });
  const navigate = useNavigate();



  useEffect(() => {
    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/mypage/info');
        setFormData({
          petownerId: response.data.petownerId,
          email: response.data.email,
          password: response.data.password,
          name: response.data.name,
          phone: response.data.phone,
        });
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        alert('로그인이 필요합니다.');
        navigate('/login'); // 로그인 페이지로 이동
      }
    };

    fetchUserInfo();
  }, [navigate]);


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
    handlePassword();
    handlePhone();
    return Object.values(errors).every((msg) => msg === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      alert('입력값을 확인해주세요.');
      return; // 검증 실패 시 제출 중단
    }

    try {
      await axiosInstance.put('/mypage/update', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('정보가 수정되었습니다.');
      navigate('/mypage');
    } catch (error) {
      console.error('정보 수정 실패:', error);
      alert('정보 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };


  return (
    <div className="app-container">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          gap: 2,
          // height: '100vh',
        }}
      >
        <Typography variant="h5" component="h1">
          정보 수정
        </Typography><br/>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <TextField
            name="email"
            label="이메일"
            value={formData.email}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
          />
          <TextField
            name="password"
            label="비밀번호"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handlePassword}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
          />
          <TextField
            name="name"
            label="이름"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleName}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />
          <TextField
            name="phone"
            label="전화번호"
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handlePhone}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            정보 수정
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default UpdatePage;
