import MemberList from "/src/components/admin2/member_list"
import MemberSearch from "/src/components/admin2/member_search";
import { useState } from "react";

export default function OrderManager() {
  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    setSearch(value);
  };

  return (
    <>
      <MemberSearch onSearch={handleSearch} />
      <MemberList search={search} />
    </>

  )
}
