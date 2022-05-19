import s from "./blog.module.scss";
import Link from 'next/link';


export default function MainBannerList({ items, onDeleteItem }) {
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
  const DATA = {
    id: item.id || 0,
    title: item.title || '제목이 없습니다.',
    createdDate: transformDate(item.createdDate || '22-05-11'),
    status: item.status || '-',
    apiurl: {
      // query_blog: item.query_blog.href,
      // update: item.update_blog.href,
      // delete: item._links.delete_blog.href,
    },
  };

  return (
    <li className={s.item} key={`item-${DATA.id}`} data-idx={DATA.id}>
      <span>{DATA.id}</span>
      <span>{DATA.title}</span>
      <span>{DATA.createdDate}</span>
      <span>{DATA.status}</span>
      <span>
        <Link href={`/bf-admin/community/blog/update/${DATA.id}`} passHref>
          <a>
            <button className="admin_btn basic_s solid">수정</button>
          </a>
        </Link>
      </span>
      <span>
        <button
          className="admin_btn basic_s solid"
          onClick={""}
          data-apiurl={DATA.apiurl.delete}
        >
          삭제
        </button>
      </span>
    </li>
  );
};




