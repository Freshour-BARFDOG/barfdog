import { Statistic } from "antd";

export default function ClainSalesStatistics() {
  return (
    <>
      <div className="flex flex-row">
        <div className="w-1/2 border-r border-gray-300 pr-4">
          <div className="mb-4">
            <Statistic title="취소관리" value={112893} />
          </div>
          <div className="mb-4">
            <Statistic title="반품관리" value={112893} />
          </div>
          <div>
            <Statistic title="교환관리" value={112893} />
          </div>
          <div>
            <Statistic title="답변대기" value={112893} />
          </div>
        </div>
        <div className="w-1/2 pl-4">
          <div className="mb-4">
            <Statistic title="구매확정" value={112893} />
          </div>
          <div className="mb-4">
            <Statistic title="오늘매출" value={112893} />
          </div>
          <div className="mb-4">
            <Statistic title="오늘할인액(쿠폰,적립금)" value={112893} />
          </div>
        </div>
      </div>
    </>
  )
}
