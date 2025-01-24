import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./PetNoteView.css";
import "../HomeView/Home.css";
import axiosInstance from '../api/axiosInstance';

const PetNoteView = () => {
  const [pets, setPets] = useState([]);
  const [vaccinations, setVaccinations] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");
  const [showNotificationList, setShowNotificationList] = useState(false);
  const [notificationLogs, setNotificationLogs] = useState([]);
  const navigate = useNavigate();

  const vaccineOptions = [
    "1차백신",
    "2차백신",
    "3차백신",
    "4차백신",
    "5차백신",
    "심장사상충",
  ];

  // useEffect(() => {
  //   fetchPets();
  //   loadNotificationLogs();
  // }, []);
  useEffect(() => {
    const fetchPets = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axiosInstance.get("/pets/my-pets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const localPets = JSON.parse(localStorage.getItem("pets")) || [];
        const mergedPets = response.data.map((apiPet) => {
          const localPet = localPets.find((pet) => pet.id === apiPet.petId);
          return localPet ? { ...apiPet, photo: localPet.photo } : apiPet;
        });
        setPets(mergedPets);
        if (mergedPets.length > 0) {
          fetchVaccinations(mergedPets[0]?.petId);
        }
      } catch (error) {
        console.error("반려동물 정보 가져오기 실패:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchPets();
    loadNotificationLogs();
  }, [navigate]);

  useEffect(() => {
    if (pets.length > 0) fetchVaccinations(pets[currentIndex]?.petId);
  }, [currentIndex, pets]);

  const fetchPets = async () => {
    try {
      const response = await axios.get("http://localhost:8765/api/pets/my-pets");
      const localPets = JSON.parse(localStorage.getItem("pets")) || [];
      const mergedPets = response.data.map((apiPet) => {
        const localPet = localPets.find((pet) => pet.id === apiPet.petId);
        return localPet ? { ...apiPet, photo: localPet.photo } : apiPet;
      });
      setPets(mergedPets);
    } catch (error) {
      console.error("반려동물 정보 가져오기 실패:", error);
    }
  };

  const fetchVaccinations = async (petId) => {
    try {
      // const response = await axios.get(`http://localhost:8765/api/vaccination/pet/${petId}`);
      const response = await axiosInstance.get(`/vaccination/pet/${petId}`);
      const vaccinationDates = response.data.map((vaccination) => vaccination.vaccinationDate);
      setVaccinations((prev) => ({ ...prev, [petId]: vaccinationDates }));
      console.log("백신날짜:", vaccinationDates);
      // setVaccinations((prev) => ({ ...prev, [petId]: response.data }));
    } catch (error) {
      console.error(`백신 정보 가져오기 실패 (petId: ${petId}):`, error);
    }
  };

  const handleAddVaccination = async () => {
    const petId = pets[currentIndex]?.petId;
    if (!selectedVaccine || !selectedDate || !petId) {
      alert("백신 종류와 접종 날짜를 선택해주세요.");
      return;
    }

    const vaccinationDate = formatLocalDate(selectedDate);
    const reminderDate = new Date(selectedDate);
    reminderDate.setMonth(reminderDate.getMonth() + 1);

    // Determine the next vaccine based on the current selection
    const nextVaccine = getNextVaccine(selectedVaccine);

    try {
      const newReminder = nextVaccine
        ? `💉 ${selectedVaccine} 재접종일자는 ${nextVaccine} (${formatLocalDate(reminderDate)})입니다.`
        : `💉 ${selectedVaccine} 접종 완료.`;

      await axios.post("http://localhost:8765/api/vaccination", {
        pet: { petId },
        vaccineName: selectedVaccine,
        vaccinationDate,
        reminderDate: formatLocalDate(reminderDate),
      });

      // 저장된 알림 로그 업데이트
      saveNotificationLog(newReminder);
      setReminderMessage(newReminder);
      fetchVaccinations(petId);
      setSelectedVaccine("");
    } catch (error) {
      console.error("백신 등록 실패:", error);
      alert("백신 등록에 실패했습니다.");
    }
  };

  const getNextVaccine = (currentVaccine) => {
    const index = vaccineOptions.indexOf(currentVaccine);
    return index >= 0 && index < vaccineOptions.length - 1 ? vaccineOptions[index + 1] : null;
  };

  const saveNotificationLog = (message) => {
    const logs = JSON.parse(localStorage.getItem("notificationLogs")) || [];
    logs.push({ message, date: new Date().toLocaleString() });
    localStorage.setItem("notificationLogs", JSON.stringify(logs));
    setNotificationLogs(logs);
  };

  const loadNotificationLogs = () => {
    const logs = JSON.parse(localStorage.getItem("notificationLogs")) || [];
    setNotificationLogs(logs);
  };

  const formatLocalDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleDateChange = (date) => {
    const correctedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setSelectedDate(correctedDate);
  };

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % pets.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + pets.length) % pets.length);

  const currentPet = pets[currentIndex];
  const petVaccinations = vaccinations[currentPet?.petId] || [];

  // !!!
  const tileClassName = ({ date }) => {
    const petId = pets[currentIndex]?.petId;
    const vaccinationDates = vaccinations[petId] || [];
    const birthDate = pets[currentIndex]?.birthDate;

    const formattedDate = formatDateForCalendar(date);
    if (birthDate === formattedDate) {
      return "birth-highlight"; // 생일 스타일
    }
    if (vaccinationDates.includes(formattedDate)) {
      return "vaccination-highlight"; // 접종일자 스타일
    }
    return null;
  };
  const formatDateForCalendar = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`; // YYYY-MM-DD 형식
  };

  return (
    <div className="app-container">
      {/* <div className="pet-note-view"> */}
        {/* <div className="pet-note-container" style={{ overflowY: 'auto', maxHeight: '150vh' }}> */}
          {pets.length === 0 ? (
            <div className="no-pets">
              <p>반려동물 정보가 없습니다. 등록해주세요!</p>
              <button onClick={() => navigate("/petnote")}>반려동물 정보 등록</button>
            </div>
          ) : (
            currentPet && (
              <div className="pet-card">
              {/* <div> */}
                {/* <div className="buttons">
                  <button className="arrow-button" onClick={handlePrev}>
                    ◀
                  </button>
                  <button className="arrow-button" onClick={handleNext}>
                    ▶
                  </button>
                </div> */}

                <img
                  className="pet-image"
                  src={currentPet.photo || "https://placehold.co/600x400?text=No+Image"}
                  alt="Pet"
                />
                <h2 className="pet-name">{currentPet.name}</h2>
                <p>🎂 생일: {currentPet.birthDate || "등록되지 않음"}</p>

                {reminderMessage && <div className="alert-message">{reminderMessage}</div>}

                <div className="pet-calendar">
                  <h3>백신 접종일정</h3>
                  <Calendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    tileClassName={tileClassName} // !!!
                  />
                </div>

                <div className="add-vaccine">
                  <h4>백신 등록</h4>
                  <select
                    value={selectedVaccine}
                    onChange={(e) => setSelectedVaccine(e.target.value)}
                  >
                    <option value="">-- 백신 선택 --</option>
                    {vaccineOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={formatLocalDate(selectedDate)}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  />
                  <button className="add-button" onClick={handleAddVaccination}>등록</button>
                </div>

                {/* 알림 아이콘 */}
                <div className="notification-icon" onClick={() => setShowNotificationList((prev) => !prev)}>
                  <span role="img" aria-label="bell">🔔</span> <span className="notification-text">재접종 알림 목록</span>
                </div>

                {/* 알림 리스트 */}
                {showNotificationList && (
                  <div className="notification-list">
                    <h4 className="notification-title">📋 재접종 알림 목록</h4>
                    <ul className="notification-items">
                      {notificationLogs.map((log, index) => (
                        <li key={index} className="notification-item">
                          <span className="notification-message">{log.message}</span>
                          <span className="notification-date">{log.date}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          )}
        {/* </div> */}
      {/* </div> */}
    </div>
  );
};

export default PetNoteView;