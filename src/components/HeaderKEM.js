// 구은모

import './HeaderKEM.css';
import imgLogo from '../assets/images/vms_logo_2x.png';
import { Link } from 'react-router-dom';
import React from 'react';

function KemHeader() {
  return (
    <header className="kemheader">
      <img src={imgLogo} alt="로고" width="112px" height="40px" />
      <div className="header-nav">
        <div>
          <Link to="/my-comparision">나의 기업 비교</Link>
        </div>
        <div>
          <Link to="/comparision-status">비교 현황</Link>
        </div>
        <div>
          <Link to="/investment-status">투자 현황</Link>
        </div>
      </div>
    </header>
  );
}

export default React.memo(KemHeader);