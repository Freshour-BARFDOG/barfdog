import ItemList from "/src/components/admin2/item_list";
import ItemSearch from "/src/components/admin2/item_search";
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
