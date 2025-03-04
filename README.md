
# Pethub_project
[\[헥토\] PetHub -.pptx](https://github.com/user-attachments/files/18534997/PetHub.-.pptx)
<img width="1048" alt="Image" src="https://github.com/user-attachments/assets/7c33eb27-e424-4e40-af51-d456540ce9f8" />

# 🐾 **PetHub**  
### **Spring Boot 기반 MSA를 활용한 동물병원 리뷰 랭킹 및 추천 시스템**  

---

## 📖 **프로젝트 개요**  
**PetHub**은 반려동물 보호자들에게 **동물병원 진료비와 리뷰 정보**를 투명하게 제공하며, 병원 평가 및 추천 시스템을 통해 **신뢰성을 높이는 플랫폼**입니다.  

현재 동물병원의 진료비는 병원마다 큰 차이가 있지만, 이를 비교할 수 있는 체계적인 시스템이 부족합니다.  
PetHub은 이러한 문제를 해결하기 위해:  
- **리뷰 인증**
- **영수증 인증**
- **AI 기반 추천 시스템**  

등의 기능을 도입했습니다.  

사용자는 PetHub을 통해 병원 리뷰를 신뢰할 수 있게 확인하고, **자신의 위치 기반 맞춤형 병원 검색**과 **AI 추천**을 받을 수 있습니다.

---

## 🛠 **프로젝트 구현 사항**

### 1️⃣ **Discovery-Service (Spring Cloud Eureka)**  
- MSA 환경에서 각 마이크로서비스를 자동으로 추적, 관리  

### 2️⃣ **Gateway-Service (Spring Cloud Gateway)**  
- 클라이언트 요청을 마이크로서비스로 라우팅  
- 요청 URI를 필터링하며, 부하를 분산  

### 3️⃣ **External APIs**  
- **Kakao Maps API**: 동물병원 지도를 제공  
- **ChatGPT API**: 리뷰 데이터와 위치를 기반으로 맞춤형 병원 추천  
- **Naver Clova OCR**: 영수증 인증 OCR 제공  

### 4️⃣ **Database (MySQL)**  
- 사용자 데이터, 병원 데이터, 찜한 병원 데이터, 리뷰 데이터를 저장  

---

## 🔑 **주요 기능 요약**

| 기능                | 설명                                                                                       |
|---------------------|------------------------------------------------------------------------------------------|
| **병원 검색**        | 동물병원 이름을 검색하여 병원의 상세 정보를 확인                                          |
| **병원 랭킹**        | 리뷰 데이터의 평점을 기반으로 병원의 랭킹을 실시간 업데이트                               |
| **지도 보기**        | 사용자 위치를 기준으로 근처 병원의 리스트를 지도에서 확인                                 |
| **AI 병원 추천**     | 사용자 위치와 리뷰 데이터를 기반으로 24시 응급 병원 또는 일반 병원을 추천                  |
| **영수증 인증**      | 영수증 인증을 통해 병원 리뷰 작성 가능                                                   |
| **찜한 병원 보기**   | 사용자가 즐겨찾기한 병원 목록을 관리                                                     |
| **병원 예약**        | 병원 상세 페이지에서 전화를 통해 예약 가능                                               |

---

## 🚀 **기술 스택**

- **Backend**: Spring Boot(java), Spring Cloud   
- **Frontend**: React(java script)
- **Database**: MySQL  
- **External APIs**:  
  - **Kakao Maps API**: 동물병원 지도  
  - **ChatGPT API**: 병원 추천 시스템  
  - **Naver Clova OCR**: 영수증 인증 기능  




