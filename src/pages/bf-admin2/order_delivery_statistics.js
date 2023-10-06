import { Statistic } from "antd";

export default function OrderDeliveryStatistics() {
  return (
    <>
      <div className="flex flex-row">
        <div className="w-1/2 border-r border-gray-300 pr-4">
          <div className="mb-4">
            <Statistic title="신규주문" value={112893} />
          </div>
          <div className="mb-4">
            <Statistic title="주문(구독)" value={112893} />
          </div>
          <div>
            <Statistic title="주문(일반)" value={112893} />
          </div>
        </div>
        <div className="w-1/2 pl-4">
          <div className="mb-4">
            <Statistic title="생산중(구독제품)" value={112893} />
          </div>
          <div className="mb-4">
            <Statistic title="배송준비(일반제품)" value={112893} />
          </div>
          <div className="mb-4">
            <Statistic title="배송중" value={112893} />
          </div>
          <div>
            <Statistic title="배송완료" value={112893} />
          </div>
        </div>
      </div>
    </>
  );
}
