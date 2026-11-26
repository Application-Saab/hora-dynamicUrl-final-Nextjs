import React from "react";
import SearchSortBar from "@/components/SearchSortBar";
import useGlobalSearch from "@/utils/useGlobalSearch";

export default function GlobalSearchBar({
  city,
  locality,
  catValue = null, 
  service = null, 
  onSubmitSearch, 
  smartFilters = false,
  showDesignType = smartFilters,
  ...rest 
}) {
  const s = useGlobalSearch({ city, locality, smartFilters, catValue, service });

  return (
    <SearchSortBar
      {...rest}
      showDesignType={showDesignType}
      categoryType="decoration"
      searchCategoryList={s.searchCategoryList}
      products={s.searchProducts}
      loading={s.searchLoading}
      designPicker={s.designPicker}
      filterLabels={s.filterLabels}
      primaryGroup={s.primaryGroup}
      onCategorySelect={s.openSearchCategory}
      onQueryChange={s.handleQueryChange}
      onViewMore={onSubmitSearch || s.handleSearchSubmit}
      getCategoryHref={s.getCategoryHref}
      getProductHref={s.getProductHref}
    />
  );
}