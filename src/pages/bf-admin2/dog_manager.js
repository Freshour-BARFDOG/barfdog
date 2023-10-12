import DogList from "/src/components/admin2/dog_list"
import DogSearch from "/src/components/admin2/dog_search";
import { useState } from "react";

export default function OrderManager() {
  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    setSearch(value);
  };

  return (
    <>
      <DogSearch onSearch={handleSearch} />
      <DogList search={search} />
    </>

  )
}
