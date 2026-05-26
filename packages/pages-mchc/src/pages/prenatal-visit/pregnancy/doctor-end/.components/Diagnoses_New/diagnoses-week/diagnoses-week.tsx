
import { IMchc_Doctor_OutpatientHeaderInfo } from '@lm_fe/service';
import React from 'react';
import './index.less';
import { Button } from 'antd';
import { use_provoke } from '@lm_fe/provoke';
interface IProps {
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo;
  first: boolean;
}
export default function DiagnosesWeek({ first, headerInfo, ...props }: IProps) {
  const colorPrimary = use_provoke(s => s.sys_theme.colorPrimary)
  return (
    <div className="firstDiag-new" style={{ color: colorPrimary }}>
      <Button style={{ marginTop: 6 }} shape='circle' >
        1

      </Button>
      G<span className="diagGP-new">{headerInfo.g}</span>P
      <span className="diagGP-new">{headerInfo.p}</span>
      妊娠
      {!first ? (
        <>
          <span className="diagGP-new diagWeek-new">{headerInfo.curgesweek}</span>周
        </>
      ) : (
        <>
          <span className="diagGP-new diagWeek-new">{headerInfo.gesweek}</span>
          周（首检孕周）
        </>
      )}
    </div>
  );
}
