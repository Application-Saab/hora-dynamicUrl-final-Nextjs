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
      filterLabels={s.filterLabels}
      onCategorySelect={s.openSearchCategory}
      onQueryChange={s.handleQueryChange}
      onViewMore={onSubmitSearch || s.handleSearchSubmit}
      getCategoryHref={s.getCategoryHref}
      getProductHref={s.getProductHref}
    />
  );
}