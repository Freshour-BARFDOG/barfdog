import ItemList from "./member_modifier_search_list";
import ItemSearch from "./member_modifier_search";
import { useState } from "react";

export default function ItemManager() {
  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    setSearch(value);
  };

  return (
    <>
      <ItemSearch onSearch={handleSearch} />
      <ItemList search={search} />
    </>

  )
}
