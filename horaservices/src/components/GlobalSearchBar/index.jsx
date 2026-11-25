// components/GlobalSearchBar/index.jsx
// Har page par yehi use karo. Saari search logic useGlobalSearch mein hai.
//
//  Landing page (/balloon-decoration):
//    <GlobalSearchBar city={city} locality={locality} showSort={false} />
//    - Normal text: dropdown mein categories + products.
//    - Design type / price / sort likha ("ring", "under 2000"): pehle category puchta hai,
//      category chunne par usi category page par filter ke saath redirect.
//
//  Category page (/balloon-decoration/housewarming-decoration):
//    <GlobalSearchBar city={city} locality={locality} catValue={catValue}
//      smartFilters showDesignType={...}
//      sortOption=... designTypes=... onApplyFilters=...
//      onSearchChange=... userId=... initialQuery=... />
//    - Dropdown mein isi category ke filtered products dikhte hain.
//    - View More: isi page par filters lag jaate hain.
//
// Enter dabane par kuch nahi hota; outside click / Escape sirf dropdown band karta hai.

import React from "react";
import SearchSortBar from "@/components/SearchSortBar";
import useGlobalSearch from "@/utils/useGlobalSearch";

export default function GlobalSearchBar({
  city,
  locality,
  catValue = null, // category page par current category
  onSubmitSearch, // optional: View More ka custom handler
  smartFilters = false,
  showDesignType = smartFilters,
  ...rest // sortOption, designTypes, onApplyFilters, onSearchChange, userId, initialQuery, showSort ...
}) {
  const s = useGlobalSearch({ city, locality, smartFilters, catValue });

  return (
    <SearchSortBar
      {...rest}
      showDesignType={showDesignType}
      categoryType="decoration"
      searchCategoryList={s.searchCategoryList}
      products={s.searchProducts}
      loading={s.searchLoading}
      designPicker={s.designPicker}
      onCategorySelect={s.openSearchCategory}
      onQueryChange={s.handleQueryChange}
      onViewMore={onSubmitSearch || s.handleSearchSubmit}
      getCategoryHref={s.getCategoryHref}
      getProductHref={s.getProductHref}
    />
  );
}