import './Pagination.css';

const Pagination = ({
  currentPage, // 현재 활성화된 페이지 번호
  onPageChange, // 페이지가 변경될 때 실행할 콜백 함수
  totalItems, // 전체 아이템의 개수
  itemsPerPage, // 한 페이지에 보여줄 아이템의 개수
  buttonSize = 48, // 버튼 크기 (기본값은 48px, 32px 또는 다른 크기도 가능)
}) => {

  const totalPagesCount = Math.ceil(totalItems / itemsPerPage); // 전체 페이지 수 계산
  const maxButtonsCount = 5; // 항상 5개의 버튼을 보여줌
  const currentGroup = Math.floor((currentPage - 1) / maxButtonsCount); // 현재 페이지 그룹 계산
  const startPageNum = currentGroup * maxButtonsCount + 1; // 현재 그룹의 첫 번째 페이지
  const endPageNum = Math.min(startPageNum + maxButtonsCount - 1, totalPagesCount); // 현재 그룹의 마지막 페이지

  const pageButtons = []; // 현재 그룹의 페이지 버튼 배열 생성
  for (let i = startPageNum; i <= endPageNum; i++) {
    pageButtons.push(i); // 버튼에 표시할 페이지 번호 추가
  }

  // 다음 그룹으로 이동
  const goToNextPage = () => {
    // 다음 그룹의 첫 번째 페이지로 이동
    if (endPageNum < totalPagesCount) {
      onPageChange(startPageNum + maxButtonsCount); // 다음 그룹의 첫 번째 페이지로 이동
    }
  };

  // 이전 그룹으로 이동
  const goToPreviousPage = () => {
    const previousPageGroupStart = Math.max(startPageNum - maxButtonsCount, 1); // 이전 그룹의 첫 번째 페이지
    onPageChange(previousPageGroupStart); // 이전 그룹의 첫 번째 페이지로 이동
  };

  // 다음 그룹 버튼 비활성화 조건
  const isNextButtonDisabled = endPageNum >= totalPagesCount;

  // 버튼 크기 클래스 정의 (48px과 32px 크기로 설정)
  const buttonSizeClass = buttonSize === 48 ? 'btn-large' : buttonSize === 32 ? 'btn-small' : 'btn-medium'; // 기본값은 medium

  return (
    <div>
      <div className="pagination">
        {/* 이전 그룹 버튼 */}
        {totalPagesCount > maxButtonsCount && (
          <button
            className={`prev-btn ${buttonSizeClass}`}
            onClick={goToPreviousPage}
            disabled={currentPage <= maxButtonsCount} // 첫 그룹에서는 비활성화
          >
            &lt;
          </button>
        )}

        {/* 현재 그룹의 페이지 버튼 */}
        {pageButtons.map((page) => (
          <button
            key={page}
            className={buttonSizeClass}
            style={{
              backgroundColor: page === currentPage ? '#eb5230' : '#4b4b4b',
            }}
            onClick={() => onPageChange(page)} // 클릭 시 해당 페이지로 이동
          >
            {page}
          </button>
        ))}

        {/* 다음 그룹 버튼 */}
        {totalPagesCount > maxButtonsCount && (
          <button
            className={`next-btn ${buttonSizeClass}`}
            onClick={goToNextPage}
            disabled={isNextButtonDisabled} // 마지막 그룹에서는 비활성화
          >
            &gt;
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
