// 조형민

export default function setCategoryEngToKor(engCategory) {
  const CATEGORY_MAP = {
    EDUTECH: '에듀테크',
    FASHION: '패션',
    PET: '반려동물',
    ENVIRONMENT: '환경',
    FINTECH: '금융',
    TRAVEL: '여행',
  };

  const korCategory = CATEGORY_MAP[engCategory];

  return korCategory;
}
