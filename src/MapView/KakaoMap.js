import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // React Router의 useNavigate 가져오기
import Loading from "../LoadingView/Loading";
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import "../HomeView/Home.css";
import "./KakaoMap.css";

const KakaoMap = () => {
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [hospitals, setHospitals] = useState([]); // 병원 목록
  const [userPosition, setUserPosition] = useState(null); // 사용자 위치 상태
  const [filteredHospitals, setFilteredHospitals] = useState([]); // 필터링된 병원 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [medicalItemFilter, setMedicalItemFilter] = useState(""); // 진료 항목 필터 상태
  const mapRef = useRef(null); // 지도 객체 참조
  const markersRef = useRef([]); // 마커 참조
  const navigate = useNavigate(); // React Router의 useNavigate

  const [isHospitalDataLoaded, setIsHospitalDataLoaded] = useState(false);
  const [isUserPositionLoaded, setIsUserPositionLoaded] = useState(false);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // 드롭다운 메뉴 표시 여부
  const [hoveredCategory, setHoveredCategory] = useState(null); // 마우스 올라간 카테고리
  const [selectedSubItem, setSelectedSubItem] = useState(""); // 선택된 항목

  const [mapCenter, setMapCenter] = useState(null); // 지도 중심 상태
  const [mapLevel, setMapLevel] = useState(4); // 지도 줌 레벨 상태

  const medicalItems = [
    {
      category: '일반 진료', subItems: ['건강검진', '예방접종', '기생충 검사 및 치료',
        '처방식 사료 상담', '비만 관리', '노령 동물 관리']
    },
    {
      category: '내과 진료', subItems: ['소화기 질환 (구토, 설사 등)', '호흡기 질환 (감기, 폐렴 등)',
        '심혈관계 질환 (심부전, 고혈압 등)', '신장 질환 (요로 결석, 신부전 등)',
        '간 질환 (간염, 간경화 등)', '당뇨 및 내분비 질환']
    },
    {
      category: '외과 진료', subItems: ['중성화 수술', '종양 제거 수술', '장기 외상 치료',
        '정형외과 수술 (골절, 슬개골 탈구 등)', '소프트 티슈 수술 (피부, 치아 등)']
    },
    {
      category: '응급 진료', subItems: ['중독 치료', '심폐소생술', '사고 및 외상 치료',
        '출혈 및 골절 응급 처치', '급성 알레르기 반응 치료']
    },
    {
      category: '치과 진료', subItems: ['치석 제거 및 스케일링', '치아 발치',
        '치주 질환 관리', '치아 교정 및 보철']
    },
    { category: '피부과 진료', subItems: ['알레르기 검사 및 치료', '곰팡이 및 세균성 피부질환 치료', '탈모 및 피부염 관리'] },
    { category: '안과 진료', subItems: ['백내장 및 녹내장 치료', '안구 염증 치료', '각막 손상 치료', '안검 성형 및 수술'] },
    { category: '산부인과 진료', subItems: ['임신 확인 및 출산 관리', '제왕절개', '생식기 질환 치료'] },
    { category: '영상 및 검사', subItems: ['X-ray 촬영', '초음파 검사', 'CT/MRI', '혈액 검사', '소변/대변 검사'] },
    { category: '재활 및 물리치료', subItems: ['물리치료 및 레이저 치료', '재활 운동', '관절염 관리'] },
    { category: '특수 진료', subItems: ['특수 동물 진료 (파충류, 조류 등)', '행동학 상담 (스트레스, 공격성 등)'] },
    { category: "선택 안 함", subItems: ['선택 안 함']},
  ];

  // 병원 및 진료 항목 데이터 가져오기
  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const [hospitalsResponse, medicalItemsResponse] = await Promise.all([
          axios.get("http://localhost:8765/hospitals"), // 병원 데이터
          axiosInstance.get('/hospital-medicalItems'), // 진료 항목 데이터
        ]);

        const hospitalsData = hospitalsResponse.data;
        const medicalItemsData = medicalItemsResponse.data;

        // 병원 데이터와 진료 항목 데이터 병합
        const mergedHospitals = hospitalsData.map((hospital) => {
          const medicalItems = medicalItemsData
            .filter((item) => item.hospitalId === hospital.hospitalId)
            .flatMap((item) => item.medicalItemNames || []);
          return { ...hospital, medicalItems: medicalItems || [] };
        });

        setHospitals(mergedHospitals);
        setFilteredHospitals(mergedHospitals);
        setIsHospitalDataLoaded(true);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHospitalData();
  }, []);

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude; // 위도
          const lng = position.coords.longitude; // 경도
          setUserPosition({ lat, lng }); // 사용자 위치 저장
          setIsUserPositionLoaded(true);
        },
        (error) => {
          console.error("Error getting geolocation: ", error); // 에러 처리
          setIsUserPositionLoaded(true);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsUserPositionLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isHospitalDataLoaded && isUserPositionLoaded) {
      setIsLoading(false);
    }
  }, [isHospitalDataLoaded, isUserPositionLoaded]);



  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleSubItemSelect = (subItem) => {
    if (subItem === "선택 안 함") {
      setMedicalItemFilter(""); // 필터링에서 제외
      setSelectedSubItem("선택 안 함");
    } else {
      setMedicalItemFilter(subItem); // 필터 상태 업데이트
      setSelectedSubItem(subItem);
    }
    setIsDropdownVisible(false); // 드롭다운 닫기
  };

  // 병원 필터링 함수
  const filterHospitals = useCallback(() => {
    const filtered = hospitals.filter((hospital) => {
      const search = searchTerm.toLowerCase();
      const medicalFilter = medicalItemFilter.toLowerCase().trim();

      // 이름 필터링
      const matchesSearch =
        !search || hospital.hospitalName.toLowerCase().includes(search);

      // 진료 항목 필터링 (배열 체크)
      const matchesMedicalItem =
        !medicalFilter ||
        (hospital.medicalItems || []).some((item) =>
          item.toLowerCase().includes(medicalFilter)
        );
      return matchesSearch && matchesMedicalItem;
    });
    setFilteredHospitals(filtered);

    // 현재 지도 중심 및 줌 레벨 저장
    if (mapRef.current) {
      const currentCenter = mapRef.current.getCenter();
      const currentLevel = mapRef.current.getLevel();
      setMapCenter({
        lat: currentCenter.getLat(),
        lng: currentCenter.getLng(),
      });
      setMapLevel(currentLevel);
    }
  }, [hospitals, searchTerm, medicalItemFilter]);

  // 지도 초기화 및 마커 추가 함수
  const initializeMap = useCallback(() => {
    if (!userPosition || filteredHospitals.length === 0) return;

    const container = document.getElementById("map");
    // const options = {
    //   center: new window.kakao.maps.LatLng(userPosition.lat, userPosition.lng),
    //   level: 4,
    // };
    // 기존 지도 상태를 유지하도록 지도 중심 좌표 및 줌 레벨 설정
    const center = mapCenter || userPosition; // 저장된 중심이 없으면 사용자 위치를 사용
    const level = mapLevel; // 저장된 줌 레벨

    const options = {
      center: new window.kakao.maps.LatLng(center.lat, center.lng),
      level: level,
    };
    
    if (!mapRef.current) {
      // 처음 지도를 생성하는 경우
      mapRef.current = new window.kakao.maps.Map(container, options);
  
      // 지도 이동 및 줌 이벤트 리스너 추가
      window.kakao.maps.event.addListener(mapRef.current, "center_changed", () => {
        const center = mapRef.current.getCenter();
        setMapCenter({ lat: center.getLat(), lng: center.getLng() });
      });
  
      window.kakao.maps.event.addListener(mapRef.current, "zoom_changed", () => {
        setMapLevel(mapRef.current.getLevel());
      });

    // 줌 컨트롤러 추가
    const zoomControl = new window.kakao.maps.ZoomControl();
    mapRef.current.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
    } else {
      // 이미 생성된 지도에 새로운 중심 및 줌 레벨 설정
      mapRef.current.setCenter(new window.kakao.maps.LatLng(center.lat, center.lng));
      mapRef.current.setLevel(level);
    }
    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 사용자 위치 마커 추가
    const userMarkerPosition = new window.kakao.maps.LatLng(userPosition.lat, userPosition.lng);
    const userMarker = new window.kakao.maps.Marker({
      position: userMarkerPosition,
      title: "Your Location", // 마커 툴팁 제목
      image: new window.kakao.maps.MarkerImage(
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 사용자 위치 마커 아이콘
        new window.kakao.maps.Size(24, 35)
      ),
    });
    userMarker.setMap(mapRef.current);

    // 병원 마커 추가
    filteredHospitals.forEach((hospital) => {
      const hospitalPosition = new window.kakao.maps.LatLng(hospital.lat, hospital.lng);
      const hospitalMarker = new window.kakao.maps.Marker({
        position: hospitalPosition,
        title: hospital.hospitalName,
      });

      hospitalMarker.setMap(mapRef.current);
      markersRef.current.push(hospitalMarker);

      // 정보창 설정
      const infowindowContent = document.createElement("div");
      infowindowContent.style.padding = "10px";
      infowindowContent.style.width = "210px";
      infowindowContent.style.fontSize = "14px";
      infowindowContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <strong style="font-size: 16px; color: #333;">${hospital.hospitalName}</strong>
          <button style="border: none; background: none; color: #333; cursor: pointer; font-size: 16px;" title="닫기" class="close-overlay">X</button>
        </div>
        <hr style="margin: 10px 0;" />
        <div style="color: #6c757d; margin-bottom: 5px;">
          <span style="font-weight: bold;">주소:</span> ${hospital.address}
        </div>
        <div style="color: #6c757d; margin-bottom: 10px;">
          <span style="font-weight: bold;">진료항목:</span> ${hospital.medicalItems || "없음"}
        </div>
      `;

      const detailsButton = document.createElement("button");
      detailsButton.textContent = "자세히 보기";
      detailsButton.style.marginTop = "5px";
      detailsButton.style.padding = "8px 12px";
      detailsButton.style.backgroundColor = "#007bff";
      detailsButton.style.color = "#fff";
      detailsButton.style.border = "none";
      detailsButton.style.borderRadius = "6px";
      detailsButton.style.cursor = "pointer";
      detailsButton.addEventListener("click", () => {
        navigate(`/hospital/${hospital.hospitalId}`);
      });
      infowindowContent.appendChild(detailsButton);

      const directionsButton = document.createElement("button");
      directionsButton.textContent = "길찾기";
      directionsButton.style.marginTop = "5px";
      directionsButton.style.marginLeft = "5px";
      directionsButton.style.padding = "8px 12px";
      directionsButton.style.backgroundColor = "#28a745";
      directionsButton.style.color = "#fff";
      directionsButton.style.border = "none";
      directionsButton.style.borderRadius = "6px";
      directionsButton.style.cursor = "pointer";
      directionsButton.addEventListener("click", () => {
        const kakaoUrl = `https://map.kakao.com/link/from/내위치,${userPosition.lat},${userPosition.lng}/to/${hospital.hospitalName},${hospital.lat},${hospital.lng}`;
        window.open(kakaoUrl, "_blank");
      });
      infowindowContent.appendChild(directionsButton);

      const infowindow = new window.kakao.maps.InfoWindow({
        content: infowindowContent,
      });

      window.kakao.maps.event.addListener(hospitalMarker, "click", () => {
        infowindow.open(mapRef.current, hospitalMarker);
      });

      infowindowContent.querySelector(".close-overlay").addEventListener("click", () => {
        infowindow.close();
      });
    });
  }, [userPosition, filteredHospitals, navigate]);

  // Kakao Maps API 스크립트 로드
  useEffect(() => {
    const KAKAO_MAP_KEY = process.env.REACT_APP_KAKAOMAP_KEY;
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        // filterHospitals();
        initializeMap();
      });
    };

    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, [initializeMap]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  if (isLoading || !userPosition) {
    return <Loading />;
  }

  return (
    <div className="app-container">
      <div className="filter-container">
        <input
          type="text"
          placeholder="병원 이름 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="dropdown">
          <input
            type="text"
            placeholder="진료항목 선택"
            value={selectedSubItem}
            onClick={toggleDropdown}
            readOnly
            className="search-input"
          />
          {isDropdownVisible && (
            <ul className="dropdown-menu">
              {medicalItems.map((item, index) => (
                <li
                  key={index}
                  className="dropdown-category"
                  onMouseEnter={() => setHoveredCategory(item.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {item.category} {item.subItems.length > 0 && <span className="arrow-icon">▶</span>}
                  {hoveredCategory === item.category && (
                    <ul className="submenu">
                      {item.subItems.map((subItem, subIndex) => (
                        <li
                          key={subIndex}
                          className="submenu-item"
                          onClick={() => handleSubItemSelect(subItem)}>
                          {subItem}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={filterHospitals} className="filter-button">
          검색
        </button>
      </div>

      <div
        id="map"
        style={{ position: "absolute", top: "60px", left: 0, width: "100%", height: "calc(100% - 60px)" }}
      ></div>
    </div>
  );
};

export default KakaoMap;
