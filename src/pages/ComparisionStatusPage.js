import './ComparisonStatusPage.css';
import Header from '../components/HeaderKHJ';
import Container from '../components/Container';
import Dropdown from '../components/Dropdown';
import { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import SelectionCount from '../components/SelectionCount';
import { fetchInvestments } from '../apis/getCompanies_ksh';
import getCompaniesKhj from '../apis/getCompanies_khj';
import HearderJHM from '../components/my-comparison/HearderJHM';

function ComparisionStatusPage() {
  const [selectedOption, setSelectedOption] =
    useState('나의 기업 선택 횟수 높은순');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const sortOptions = [
    '나의 기업 선택 횟수 높은순',
    '나의 기업 선택 횟수 낮은순',
    '비교 기업 선택 횟수 높은순',
    '비교 기업 선택 횟수 낮은순',
    '실제 누적 투자 금액 높은순',
    '실제 누적 투자 금액 낮은순',
  ];

  const handleDropdownChange = (value) => {
    setSelectedOption(value);
  };

  const handlePageChange = (value) => {
    setCurrentPage(value);
  };

  const getComparisonData = async () => {
    try {
      const skip = (currentPage - 1) * itemsPerPage;

      const mapping = {
        '나의 기업 선택 횟수 높은순': {
          orderBy: 'highestMySelection',
        },
        '나의 기업 선택 횟수 낮은순': {
          orderBy: 'lowestMySelection',
        },
        '비교 기업 선택 횟수 높은순': {
          orderBy: 'highestCompareSelection',
        },
        '비교 기업 선택 횟수 낮은순': {
          orderBy: 'lowestCompareSelection',
        },
        '실제 누적 투자 금액 높은순': {
          orderBy: 'highestInvestment',
        },
        '실제 누적 투자 금액 낮은순': {
          orderBy: 'lowestInvestment',
        },
      };

      const orderBy = mapping[selectedOption]?.orderBy;

      const result = await getCompaniesKhj({
        skip: skip,
        limit: itemsPerPage,
        orderBy: orderBy,
      });

      setItems(result.companies); // companies는 서버에서 받아온 데이터의 배열
      setTotalItems(result.totalCount); // totalItems는 서버에서 받아온 데이터의 총 개수
    } catch (error) {
      console.error('Failed to get comparisons:', error);
    }
  };

  useEffect(() => {
    getComparisonData();
  }, [currentPage, itemsPerPage, selectedOption]);

  return (
    <div className="comparison-status-page">
      <HearderJHM />
      <div className="headerLine"></div>
      <Container>
        <div className="comparison-status">
          <p>비교 현황</p>
          <Dropdown
            options={sortOptions}
            selectedValue={selectedOption}
            onChange={handleDropdownChange}
          />
        </div>
        <div className="comparison-status-table">
          <div className="comparison-status-rank">순위</div>
          <div className="comparison-status-company-name">기업명</div>
          <div className="comparison-status-company-description">기업 소개</div>
          <div className="comparison-status-category">카테고리</div>
          <div className="comparison-status-comparison-amount">
            나의 기업 선택 횟수
          </div>
          <div className="comparison-status-real-comparison-amount">
            비교 기업 선택 횟수
          </div>
        </div>
        <div className="selection-count">
          <div>
            <SelectionCount items={items} />
          </div>
        </div>
        <div>
          {totalItems > 0 && (
            <Pagination
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalItems={totalItems}
            />
          )}
        </div>
      </Container>
    </div>
  );
}

export default ComparisionStatusPage;
