import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Divider, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AuthForm({ title, submitButtonText, onSubmit }) {
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formValues.email || !/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = '유효한 이메일 주소를 입력하세요.';
    }
    if (!formValues.password || formValues.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      onSubmit(formValues);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: 300, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <TextField
        label="이메일"
        name="email"
        fullWidth
        margin="normal"
        value={formValues.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        label="비밀번호"
        name="password"
        type="password"
        fullWidth
        margin="normal"
        value={formValues.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        {submitButtonText}
      </Button>
      <Divider sx={{ my: 2 }}>또는</Divider>
      {/* 회원가입 버튼 */}
      <Typography align="center" sx={{ mt: 2 }}>
        계정이 없으신가요?{' '}
        <Link component="button" onClick={() => navigate('/signup')}>
          회원가입
        </Link>
      </Typography>
    </Box>
  );
}
