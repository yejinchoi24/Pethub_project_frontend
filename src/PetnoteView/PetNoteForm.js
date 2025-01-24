import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import styles from "./PetNoteForm.css";
import "./PetNoteForm.css";
import "../HomeView/Home.css";
import { Typography } from "@mui/material";

const PetNoteForm = () => {
  const [petData, setPetData] = useState({
    name: "",
    species: "강아지",
    breed: "",
    birthDate: "",
    gender: "MALE",
    photo: "", // 사진 데이터 (Base64)
  });

  const navigate = useNavigate();

  const breeds = [
    "골든리트리버",
    "포메라니안",
    "말티즈",
    "푸들",
    "비숑 프리제",
    "시바 이누",
    "불독",
    "보더콜리",
    "시츄",
    "코커스패니얼",
    "웰시코기",
    "도베르만",
    "달마시안",
    "래브라도 리트리버",
    "요크셔테리어",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPetData((prev) => ({ ...prev, photo: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8765/api/pets", petData, {
        headers: { "Content-Type": "application/json" },
      });

      const savedPets = JSON.parse(localStorage.getItem("pets")) || [];
      savedPets.push({ ...petData, id: response.data.petId });
      localStorage.setItem("pets", JSON.stringify(savedPets));

      alert("반려동물 정보가 성공적으로 등록되었습니다!");
      navigate("/petnote-view");
    } catch (error) {
      console.error("등록 실패:", error);
      alert("등록에 실패했습니다.");
    }
  };

  // return (
  //   <div className={styles.formContainer}>
  //     <form className={styles.form} onSubmit={handleSubmit}>
  //       <label className={styles.label}>이름</label>
  //       <input
  //         type="text"
  //         name="name"
  //         className={styles.input}
  //         value={petData.name}
  //         onChange={handleChange}
  //         required
  //       />
  //       <label className={styles.label}>종류</label>
  //       <select
  //         name="species"
  //         className={styles.input}
  //         value={petData.species}
  //         onChange={handleChange}
  //         required
  //       >
  //         <option value="강아지">강아지</option>
  //         <option value="고양이">고양이</option>
  //       </select>
  //       <label className={styles.label}>품종</label>
  //       <select
  //         name="breed"
  //         className={styles.input}
  //         value={petData.breed}
  //         onChange={handleChange}
  //         required
  //       >
  //         <option value="">-- 품종 선택 --</option>
  //         {breeds.map((breed, index) => (
  //           <option key={index} value={breed}>
  //             {breed}
  //           </option>
  //         ))}
  //       </select>
  //       <label className={styles.label}>태어난 날짜(생일)</label>
  //       <input
  //         type="date"
  //         name="birthDate"
  //         className={styles.input}
  //         value={petData.birthDate}
  //         onChange={handleChange}
  //       />
  //       <label className={styles.label}>성별</label>
  //       <select
  //         name="gender"
  //         className={styles.input}
  //         value={petData.gender}
  //         onChange={handleChange}
  //       >
  //         <option value="MALE">수컷</option>
  //         <option value="FEMALE">암컷</option>
  //       </select>
  //       <label className={styles.label}>사진</label>
  //       <input
  //         type="file"
  //         accept="image/*"
  //         className={styles.inputFile}
  //         onChange={handleFileChange}
  //       />
  //       {petData.photo && (
  //         <img src={petData.photo} alt="Preview" className={styles.photoPreview} />
  //       )}
  //       <button type="submit" className={`${styles.button} ${styles.submitButton}`}>
  //         저장
  //       </button>
  //     </form>
  //   </div>
  // );

  return (

    <div className="app-container">
      <div className="formContainer">
        <Typography variant="h5" component="h1" sx={{ textAlign: 'center' }}>
          반려동물 등록
        </Typography>
        <br /><hr/><br/>

        {/* <form className="form" onSubmit={handleSubmit}>
          <label className="label">이름</label>
          <input
            type="text"
            name="name"
            className="input"
            value={petData.name}
            onChange={handleChange}
            required
          /> */}
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={petData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="species" className="form-label">종류</label>
            <select
              id="species"
              name="species"
              className="form-input"
              value={petData.species}
              onChange={handleChange}
              required
            >
              <option value="강아지">강아지</option>
              <option value="고양이">고양이</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="breed" className="form-label">품종</label>
            <select
              id="breed"
              name="breed"
              className="form-input"
              value={petData.breed}
              onChange={handleChange}
              required
            >
              <option value="">-- 품종 선택 --</option>
              {breeds.map((breed, index) => (
                <option key={index} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="birthDate" className="form-label">태어난 날짜</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              className="form-input"
              value={petData.birthDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender" className="form-label">성별</label>
            <select
              id="gender"
              name="gender"
              className="form-input"
              value={petData.gender}
              onChange={handleChange}
            >
              <option value="MALE">수컷</option>
              <option value="FEMALE">암컷</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="photo" className="form-label">사진</label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              className="form-input"
              onChange={handleFileChange}
            />
            {petData.photo && (
              <img src={petData.photo} alt="Preview" className="photo-preview" />
            )}
          </div>
          <button type="submit" className="form-button">저장</button>
        </form>
      </div>
    </div>
  );
};

export default PetNoteForm;
