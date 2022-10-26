import s from "./blog.module.scss";
import Link from 'next/link';
import {deleteData} from "/src/pages/api/reqData";
import transformDate from "/util/func/transformDate";


export default function BlogList({ items, setItemList }) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item) => (
        <SingleItems key={`item-${item.id}`} index={item.id} item={item} setItemList={setItemList} />
      ))}
    </ul>
  );
}



const SingleItems = ({ item }) => {
  const DATA = {
    id: item.id,
    title: item.title || '제목이 없습니다.',
    createdDate: transformDate(item.createdDate),
    status: item.status === 'LEAKED' ? 'Y' : 'N' ,
    apiurl: {
      query_blog: item._links?.query_blog.href,
      update: item._links?.update_blog.href,
      delete: item._links.delete_blog?.href,
    },
  };

  const onDeleteItemHandler = async (e) => {
    const blogId = e.currentTarget.dataset.id;
    const apiURL = `/api/admin/blogs/${blogId}`;
    if (confirm(`${DATA.id}번 글을 정말 삭제하시겠습니까?`)) {
      const res = await deleteData(apiURL);
      console.log(res)
      if(res.isDone){
        window.location.reload();
      } else {
        alert('삭제에 실패하였습니다.');
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
        <Link href={`/bf-admin/community/blog/update/${DATA.id}`} passHref>
          <a>
            <button className="admin_btn basic_s solid">수정</button>
          </a>
        </Link>
      </span>
      <span>
        <button
          data-id={DATA.id}
          className="admin_btn basic_s solid"
          onClick={onDeleteItemHandler}
        >
          삭제
        </button>
      </span>
    </li>
  );
};




