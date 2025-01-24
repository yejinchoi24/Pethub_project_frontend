// import React, { useState } from "react";
// import axios from "axios";
// import axiosInstance from "../api/axiosInstance";

// const NaverOcrPage = () => {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [extractedData, setExtractedData] = useState("");
//     const [error, setError] = useState("");
//     const [confirmationMessage, setConfirmationMessage] = useState("");
  
//     const handleFileChange = (event) => {
//         setSelectedFile(event.target.files[0]);
//         setError("");
//         setExtractedData({}); // 새로운 파일 업로드 시 초기화
//         setConfirmationMessage(""); // 초기화
//     };

//     const handleExtract = async (event) => {
//         event.preventDefault();
//         if (!selectedFile) {
//           setError("Please select a file first!");
//           return;
//         }
      
//         const formData = new FormData();
//         formData.append("image", selectedFile);
      
//         try {
//           const response = await axiosInstance.post("/mypage/addReview/ocr/extract", formData, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           });
      
//           // OCR 데이터 추출
//           setExtractedData(response.data); // 서버에서 구조화된 JSON 반환
//         } catch (error) {
//           console.error("Error during OCR request:", error);
//           setError("Error occurred during OCR processing. Please try again.");
//         }
//       };
      
  
//     // const handleSubmit = async (event) => {
//     //   event.preventDefault();
//     //   if (!selectedFile) {
//     //     setError("Please select a file first!");
//     //     return;
//     //   }
  
//     //   const formData = new FormData();
//     //   formData.append("image", selectedFile);
  
//     //   try {
//     //     const response = await axiosInstance.post("/mypage/addReview/ocr/extract", formData, {
//     //       headers: {
//     //         "Content-Type": "multipart/form-data",
//     //       },
//     //     });

//     //     const images = response.data.images;
//     //   if (images && images.length > 0) {
//     //     const fields = images[0].fields; // 첫 번째 이미지의 필드 데이터
//     //     const extractedTexts = fields.map(field => field.inferText).join(" ,   "); // 모든 텍스트를 공백으로 연결
//     //     setExtractedData(extractedTexts); // 추출된 텍스트 상태 업데이트
//     //   } else {
//     //     setExtractedData("No text found in the image.");
//     //   }

//     //   } catch (error) {
//     //     console.error("Error during OCR request:", error);
//     //     setError("Error occurred during OCR processing. Please try again.");
//     //   }
//     // };

//     const handleSaveToDatabase = async () => {
//         if (!extractedData || Object.keys(extractedData).length === 0) {
//           setError("No data to save. Please extract data first.");
//           return;
//         }
      
//         try {
//           await axiosInstance.post("/mypage/addReview/ocr/save", extractedData);
//           setConfirmationMessage("Data saved to the database successfully!");
//         } catch (error) {
//           console.error("Error saving data to database:", error);
//           setError("Error occurred while saving data. Please try again.");
//         }
//       };
      
  
//       return (
//         <div style={{ padding: "20px" }}>
//           <h1>Naver OCR Service</h1>
//           <form onSubmit={handleExtract} style={{ marginBottom: "20px" }}>
//             <input type="file" accept="image/*" onChange={handleFileChange} />
//             <button type="submit" style={{ marginLeft: "10px" }}>Extract Data</button>
//           </form>
    
//           {error && <p style={{ color: "red" }}>{error}</p>}
    
//           {extractedData && Object.keys(extractedData).length > 0 && (
//             <div>
//               <h2>Extracted Data:</h2>
//               <p><strong>병원명:</strong> {extractedData.hospitalName}</p>
//               <p><strong>방문날짜:</strong> {extractedData.visitDate}</p>
    
//               <button
//                 onClick={handleSaveToDatabase}
//                 style={{ marginTop: "10px", display: "block" }}
//               >
//                 확인
//               </button>
//               {confirmationMessage && (
//                 <p style={{ color: "green", marginTop: "10px" }}>{confirmationMessage}</p>
//               )}
//             </div>
//           )}
//         </div>
//       );
//     };
  
//   export default NaverOcrPage;