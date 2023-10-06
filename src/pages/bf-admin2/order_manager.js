import ProductSearch from "/src/components/admin2/order_search";
import ProductList from "/src/components/admin2/order_list";
import { useState } from "react";

export default function OrderManager() {
  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    setSearch(value);
  };

  return (
    <>
      <ProductSearch onSearch={handleSearch} />
      <ProductList search={search} />
    </>
  );
}
