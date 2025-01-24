import React, { useState, useRef, useEffect } from 'react';
import './Chatting.css';
import "../HomeView/Home.css"; // 필요에 따라 제거
import { useNavigate } from 'react-router-dom';
import Spinner from '../LoadingView/loading_spinner.gif';

const Chatting = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // 로딩
  const inputRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // JWT 토큰 확인: 토큰이 없으면 로그인 페이지로 리디렉트
    const token = localStorage.getItem('token');
    console.log('!! 채팅 JWT Token:', token);
    if (!token) {
      console.warn('!! No token found in localStorage');
      navigate('/login');
    }
  }, [navigate]);

  // 메시지가 업데이트될 때 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);

    // 입력창 자동 크기 조절
    const inputElement = inputRef.current;
    inputElement.style.height = 'auto';
    inputElement.style.height = `${inputElement.scrollHeight}px`;
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('!! No token found in localStorage');
      navigate('/login');
      return;
    }

    // 사용자의 입력 메시지 추가
    const userMessage = input.trim();
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, sender: 'user' },
    ]);
    setInput('');
    setLoading(true);

    // 백엔드 API 호출
    try {
      const response = await fetch('http://localhost:8765/api/chatting/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // JWT 토큰 추가
        },
        body: JSON.stringify(userMessage), // 사용자 입력만 전송
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }

      const data = await response.text(); // 백엔드로부터 받은 응답
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data, sender: 'bot' }, // ChatGPT 응답 추가
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Error: Unable to fetch response from the server.', sender: 'bot' },
      ]);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        <div className="chat-header">증상을 입력해주세요</div>
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.sender === 'user' ? 'user-message' : 'chatgpt-message'
              }`}
            >
              {message.text}
            </div>
          ))}
          {loading && ( // 로딩 상태일 때 표시
            <div className="loading">
            <img src={Spinner} alt="로딩 중" width="10%" />
          </div>
          )}
        </div>
        <div className="chat-input-container">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="입력"
            className="chat-input"
          />
          <button onClick={handleSend} className="send-button">▶</button>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
