// 조형민

import { useEffect, useRef, useState } from 'react';
import icDelete from '../assets/images/ic_delete.png';
import icDeleteCircleSmall from '../assets/images/ic_delete_circle_small.png';
import icSearch from '../assets/images/ic_search.png';
import './SelectMyCompanyModal.css';
import CompanyListWidget from './CompanyListWidget';
import { getLatestSelections } from '../apis/getLatestSelections';
import { getCompaniesModal } from '../apis/getComapniesModal';
import AlertModal from './AlertModal';

// 현재 사용자 지정
const INITIAL_USER_ID = 'fca6ef85-02ba-4868-a7b7-4f49ed16e881';

export default function SelectMyCompanyModal({
  onModalClick,
  onCloseClick,
  onSelectClick,
  modalBackground,
  isMyCompany = false,
  compareCompanies,
}) {
  const [latestSelections, setLatestSelections] = useState([]);
  const [searchCompanies, setSearchCompanies] = useState([]);
  const [searchCount, setSearchCount] = useState();
  const [loadingError, setLoadingError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('');
  const formRef = useRef();

  const modalClassName = `modal-content ${isShowAlert ? 'hide' : ''}`;
  const handleChange = e => {
    setInputValue(e.target.value);
  };
  const handleSubmit = e => {
    e.preventDefault();
    setInputValue(e.target.search.value);
    handleLoadSearchCompanies({ searchString: inputValue, limit: 20 });
  };
  const handleSearchClick = () => {
    if (!formRef) return;
    setInputValue(formRef.current.search.value);
    handleLoadSearchCompanies({ searchString: inputValue, limit: 20 });
  };
  const handleClearClick = () => {
    setInputValue('');
    handleLoadSearchCompanies({ searchString: '', limit: 20 });
  };
  // 기업 목록에 있는 선택하기 버튼 클릭
  const handleButtonClick = selectedCompany => {
    if (compareCompanies.some(company => company.id === selectedCompany.id)) {
      setAlertText('나의 기업과 비교 기업은 같을 수 없습니다.');
      setIsShowAlert(true);
      return;
    }
    const selectionsArray = latestSelections.map(value => value.id);
    const noUpdateUser = selectionsArray.some(
      value => value === selectedCompany.id,
    );
    // 최근 선택 항목 5개중에 선택하는 경우에는 user데이터 업데이트는 생략
    if (!noUpdateUser) {
      /**
       * 어떻게 하면 5개가 된 경우, 오래된 요소를 먼저 삭제할 수 있을까?
       * - 가장 간단한 방법이 무엇일지?
       */
      if (selectionsArray.length === 5) {
        selectionsArray.pop();
      }
      selectionsArray.unshift(selectedCompany.id);
    }
    onSelectClick(selectedCompany, selectionsArray, noUpdateUser);
  };
  // alert modal의 닫기 또는 확인 버튼 클릭
  const handleCloseModalClick = () => {
    setIsShowAlert(false);
  };

  const handleLoadLatestSelections = async () => {
    let userSelections;
    try {
      setLoadingError(null);
      userSelections = await getLatestSelections(INITIAL_USER_ID);
      if (!userSelections && userSelections.length === 0) return;
    } catch (error) {
      setLoadingError(error);
    }
    setLatestSelections(userSelections);
  };

  const handleLoadSearchCompanies = async options => {
    let result;
    try {
      setLoadingError(null);
      result = await getCompaniesModal(options);
      if (!result.companies && result.companies.length === 0) return;
    } catch (error) {
      setLoadingError(error);
    }
    setSearchCount(result.totalCount);
    setSearchCompanies(result.companies);
  };

  useEffect(() => {
    handleLoadLatestSelections();
  }, []);
  useEffect(() => {
    handleLoadSearchCompanies({ searchString: inputValue, limit: 20 });
  }, []);

  return (
    <div
      className="modal-background"
      ref={modalBackground}
      onClick={onModalClick}
    >
      <div className={modalClassName}>
        <div className="modal-content-header">
          <span>나의 기업 선택하기</span>
          <img
            src={icDelete}
            alt="창닫기"
            width="32px"
            onClick={onCloseClick}
          />
        </div>
        <form id="searchForm" onSubmit={handleSubmit} ref={formRef}>
          <input
            id="searchName"
            value={inputValue}
            name="search"
            placeholder="기업명 입력"
            onChange={handleChange}
          />
          {inputValue && (
            <img
              className="ic-clear"
              src={icDeleteCircleSmall}
              alt="텍스트 초기화"
              width="16px"
              onClick={handleClearClick}
            />
          )}
          <img
            className="ic-search"
            src={icSearch}
            alt="검색"
            width="24px"
            onClick={handleSearchClick}
          />
        </form>
        <div className="latest-selected-companies">
          <div className="latest-selected-companies-title">
            {`최근 선택 기업 (${latestSelections.length})`}
          </div>
          <div className="latest-selected-companies-list">
            {latestSelections.map(company => {
              return (
                <CompanyListWidget
                  key={company.id}
                  company={company}
                  onButtonClick={handleButtonClick}
                  isMyCompany={isMyCompany}
                />
              );
            })}
          </div>
        </div>
        <div className="search-result-companies">
          <div className="search-result-companies-title">{`검색 결과 (${searchCount})`}</div>
          <div className="search-result-companies-list">
            {searchCompanies.map(company => {
              return (
                <CompanyListWidget
                  key={company.id}
                  company={company}
                  onButtonClick={handleButtonClick}
                  isMyCompany={isMyCompany}
                />
              );
            })}
          </div>
        </div>
      </div>
      <AlertModal
        text={alertText}
        isShow={isShowAlert}
        onClick={handleCloseModalClick}
      />
    </div>
  );
}
