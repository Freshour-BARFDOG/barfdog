import s from "./notice.module.scss";
import Link from "next/link";
import {deleteData} from "../../../../../api/reqData";



export default function NoticeList({ items, onDeleteItem }) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item) => (
        <SingleItems key={`item-${item.id}`} index={item.id} item={item} />
      ))}
    </ul>
  );
}

const transformDate = (d) => {
  const yy = d.split("-")[0];
  const mm = d.split("-")[1];
  const dd = d.split("-")[2].split("T")[0];
  return `${yy}-${mm}-${dd}`;
};

const SingleItems = ({ item }) => {
  console.log(item)
  const DATA = {
    id: item.id || 0,
    title: item.title || "제목이 없습니다.",
    createdDate: transformDate(item.createdDate || "22-05-11"),
    status: item.status === "LEAKED" ? 'Y' : 'N',
    apiurl: {
      query_blog: item._links.query_notice?.href,
      update: item._links.update_notice?.href,
      delete: item._links.delete_notice?.href,
    },
  };

  const onDeleteItemHandler = async (e) => {
    const apiURL = e.currentTarget.dataset.apiurl;
    if (confirm(`${DATA.id}번 글을 정말 삭제하시겠습니까?`)) {
      const res = await deleteData(apiURL);
      console.log(res)
      if(res.status === 200 || res.status === 201 ){
        window.location.reload();
      } else {
        alert('삭제할 수 없습니다. 새로고침 후 , 다시 시도해보세요.')
      }
    }
  };


  return (
    <li className={s.item} key={`item-${DATA.id}`} data-idx={DATA.id}>
      <span>{DATA.id}</span>
      <span>{DATA.title}</span>
      <span>{DATA.createdDate}</span>
      <span>{DATA.status}</span>
      <span>
        <Link href={`/bf-admin/community/notice/update/${DATA.id}`} passHref>
          <a>
            <button className="admin_btn basic_s solid">수정</button>
          </a>
        </Link>
      </span>
      <span>
        <button
          className="admin_btn basic_s solid"
          onClick={onDeleteItemHandler}
          data-apiurl={DATA.apiurl.delete}
        >
          삭제
        </button>
      </span>
    </li>
  );
};
