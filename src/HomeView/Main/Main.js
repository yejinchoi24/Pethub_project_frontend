import React, { useState, useEffect, useMemo } from "react";
import "./Main.css";

const Main = () => {
  const [selectedGroup, setSelectedGroup] = useState("강아지 진료");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSlide, setIsAutoSlide] = useState(true);

  // 진료 데이터: useMemo를 사용해 배열이 렌더링마다 재생성되지 않도록 설정
  const categories = useMemo(
    () => [
      {
        group: "강아지 진료",
        items: [
          { id: 1, name: "종합\n백신", min: 8000, avg: 25991, max: 75000 },
          { id: 2, name: "광견병\n백신", min: 5000, avg: 24427, max: 70000 },
          { id: 3, name: "켄넬코프\n백신", min: 5000, avg: 21889, max: 55000 },
          { id: 4, name: "인플루엔자\n백신", min: 5000, avg: 34650, max: 70000 },
          { id: 5, name: "초진\n진찰료", min: 3000, avg: 10840, max: 75000 },
          { id: 6, name: "재진\n진찰료", min: 2000, avg: 8549, max: 100000 },
        ],
      },
      {
        group: "고양이 진료",
        items: [
          { id: 7, name: "종합\n백신", min: 10000, avg: 39610, max: 115000 },
          { id: 8, name: "광견병\n백신", min: 5000, avg: 24427, max: 70000 },
          { id: 9, name: "초진\n진찰료", min: 3000, avg: 10889, max: 75000 },
          { id: 10, name: "재진\n진찰료", min: 2000, avg: 8456, max: 70000 },
        ],
      },
      {
        group: "기타 진료 항목",
        items: [
          { id: 11, name: "상담료", min: 2000, avg: 11461, max: 90000 },
          { id: 12, name: "입원비\n(개 - 소형)", min: 10000, avg: 52337, max: 300000 },
          { id: 13, name: "입원비\n(개 - 중형)", min: 12000, avg: 60540, max: 250000 },
          { id: 14, name: "입원비\n(개 - 대형)", min: 22000, avg: 79873, max: 355000 },
          { id: 15, name: "입원비\n(고양이)", min: 10000, avg: 72718, max: 500000 },
          { id: 16, name: "전혈구\n검사비 및 판독료", min: 10000, avg: 38202, max: 300000 },
          { id: 17, name: "엑스선\n촬영비 및 판독료", min: 10000, avg: 37266, max: 161800 },
        ],
      },
    ],
    []
  );

  // 현재 선택된 그룹의 항목 메모화
  const activeItems = useMemo(() => {
    return categories.find((category) => category.group === selectedGroup)?.items || [];
  }, [selectedGroup, categories]);

  // 자동 슬라이드 효과
  useEffect(() => {
    if (!isAutoSlide || activeItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeItems.length); // 다음 항목으로 이동
    }, 2000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 해제
  }, [isAutoSlide, activeItems]);

  // 슬라이드 변경 시 선택된 항목 업데이트
  useEffect(() => {
    setSelectedCategory(activeItems[currentIndex]);
  }, [currentIndex, activeItems]);

  // 그룹 변경 처리
  const handleGroupChange = (group) => {
    setSelectedGroup(group); // 그룹 변경
    setCurrentIndex(0); // 슬라이드 초기화
    setIsAutoSlide(true); // 자동 슬라이드 재개
  };

  // 항목 클릭 시 처리
  const handleCategoryClick = (category, index) => {
    setSelectedCategory(category); // 클릭한 항목 선택
    setCurrentIndex(index); // 현재 인덱스 업데이트
    setIsAutoSlide(false); // 슬라이드 중단
  };

  return (
    <div className="main-container">
      <h2 className="notice">
        <span className="notice-icon">📢</span>
        원하는 진료항목을 선택하시면 비용정보를 알려드려요
      </h2>

      {/* 그룹 선택 버튼 */}
      <div className="group-tabs">
        {categories.map((category) => (
          <button
            key={category.group}
            className={`group-tab ${selectedGroup === category.group ? "active" : ""}`}
            onClick={() => handleGroupChange(category.group)}
          >
            {category.group}
          </button>
        ))}
      </div>

      {/* 현재 그룹의 항목 */}
      <div className="categories">
        {activeItems.map((category, index) => (
          <button
            key={category.id}
            className={`category-item ${
              selectedCategory?.id === category.id ? "active" : ""
            }`}
            onClick={() => handleCategoryClick(category, index)}
            style={{height: "100px",
                    width: activeItems.some((item) => [16, 17].includes(item.id)) ? "300px" : "200px"
            }} // 높이
          >
            <div className="category-icon">🐾</div>
            <span style={{ whiteSpace: "pre-line" }}>{category.name}</span>
          </button>
        ))}
      </div>

      {/* 선택된 항목의 상세 정보 */}
      {selectedCategory && (
        <div className="cost-details">
          <div className="cost-box">
            <div className="cost-icon">✔</div>
            <div className="cost-text">
              <label>최저비용:</label>
              <span>{selectedCategory.min} 원</span>
            </div>
          </div>
          <div className="cost-box">
            <div className="cost-icon">✔</div>
            <div className="cost-text">
              <label>평균비용:</label>
              <span>{selectedCategory.avg} 원</span>
            </div>
          </div>
          <div className="cost-box">
            <div className="cost-icon">✔</div>
            <div className="cost-text">
              <label>최고비용:</label>
              <span>{selectedCategory.max} 원</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
