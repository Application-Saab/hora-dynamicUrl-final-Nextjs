# Balloon Category Dropdown Integration Guide

This guide shows how to integrate the Balloon Category Dropdown component into your balloon decoration page.

## Components Created

### 1. **BalloonCategoryDropdown** (`BalloonCategoryDropdown.jsx`)
- Displays a dropdown with all balloon decoration categories
- When a category is selected, it navigates to that category's page
- Shows category images and names
- Closes when clicking outside

### 2. **BalloonProductDisplay** (`BalloonProductDisplay.jsx`)
- Fetches and displays products for the selected category
- Shows product grid with images, names, prices, and ratings
- Includes loading skeletons
- Error handling for failed requests

### 3. **BalloonCategorySection** (`BalloonCategorySection.jsx`)
- Combines both components
- Manages selected category state
- Easy to use wrapper component

## Integration Steps

### Option 1: Use the Complete Section (Recommended)

Add to your balloon decoration page:

```jsx
import { BalloonCategorySection } from '@/components/BalloonCategoryDropdown';
import { decCat } from '@/utils/decorationCategories';

// In your component:
<BalloonCategorySection categories={decCat} />
```

### Option 2: Use Individual Components

```jsx
import { BalloonCategoryDropdown, BalloonProductDisplay } from '@/components/BalloonCategoryDropdown';
import { decCat } from '@/utils/decorationCategories';
import { useState } from 'react';

const MyComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <BalloonCategoryDropdown 
        categories={decCat}
        onCategorySelect={handleCategorySelect}
      />
      
      {selectedCategory && (
        <BalloonProductDisplay 
          categoryValue={selectedCategory.catValue}
          categoryName={selectedCategory.name}
        />
      )}
    </>
  );
};

export default MyComponent;
```

## Where to Add in Your Pages

### In `/src/pages/balloon-decoration/index.jsx`

Add after the banner or before other sections:

```jsx
import { BalloonCategorySection } from '@/components/BalloonCategoryDropdown';

// Inside your Decoration component, add:
<BalloonCategorySection categories={decCat} />
```

### In `/src/pages/[city]/[locality]/balloon-decoration/index.jsx`

Add the same integration in this city-specific page.

## Features

✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop
✅ **Category Navigation** - Direct links to category pages
✅ **Product Display** - Real-time product fetching from API
✅ **Loading States** - Skeleton loaders while fetching
✅ **Error Handling** - Graceful error messages
✅ **Smooth Animations** - Hover effects and transitions
✅ **SEO Friendly** - Uses proper semantic HTML

## Customization

### Change Dropdown Label

In `BalloonCategoryDropdown.jsx`:

```jsx
<span>Select a Balloon Decoration Category</span>
// Change to your preferred text
```

### Modify Grid Layout

In `BalloonProductDisplay.css`:

```css
grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
/* Change minmax values to adjust card width */
```

### Update Colors

Change the main color (#ff6b9d) in CSS files to match your brand:

```css
border-color: #ff6b9d;
background: linear-gradient(135deg, #ff6b9d, #ff7bb4);
```

## Data Structure

The component expects categories with this structure:

```javascript
{
  id: "1",
  image: "url-to-image",
  name: "Category Name",
  subCategory: "SubCategoryName",
  catValue: "category-value-slug",
  imgAlt: "Alt text"
}
```

This matches your existing `decCat` structure in `decorationCategories.js`.

## API Integration

The ProductDisplay component fetches from:

```
GET ${BASE_URL}${GET_DECORATION_CAT_ITEM}?subCategory={subCategory}
```

The subcategory mapping is configured in `BalloonProductDisplay.jsx`. Ensure your API returns data in this format:

```json
{
  "status": 200,
  "data": [
    {
      "_id": "product-id",
      "productName": "Product Name",
      "image": "image-url",
      "price": "9999",
      "rating": 4.5,
      "description": "Product description"
    }
  ]
}
```

## Troubleshooting

### Products Not Loading?
- Check if the subcategory mapping in `BalloonProductDisplay.jsx` matches your API
- Verify the API endpoint in `apiconstants.js`
- Check browser console for error messages

### Dropdown Not Closing?
- Ensure click-outside handler is working
- Check for z-index conflicts with other elements

### Images Not Showing?
- Verify image URLs are accessible
- Check browser console for 404 errors
- The placeholder image fallback requires `/public/placeholder-image.png`

## Performance Tips

1. **Lazy load** the component if not needed immediately:
   ```jsx
   const BalloonCategorySection = dynamic(() => 
     import('@/components/BalloonCategoryDropdown/BalloonCategorySection')
   );
   ```

2. **Memoize** the categories if they don't change:
   ```jsx
   const memoizedCategories = useMemo(() => decCat, []);
   ```

3. **Limit products** displayed initially for better performance
