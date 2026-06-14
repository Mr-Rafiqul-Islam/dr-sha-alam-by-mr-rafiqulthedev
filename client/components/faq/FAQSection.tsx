'use client';

import { useState } from 'react';
import FAQHero from '@/components/faq/FAQHero';
import FAQCategories from '@/components/faq/FAQCategories';
import FAQList from '@/components/faq/FAQList';

export default function FAQSection() {
  const [activeCategoryId, setActiveCategoryId] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setSearchQuery('');
  };

  return (
    <>
      <FAQHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <FAQCategories
        activeCategoryId={activeCategoryId}
        onCategoryChange={handleCategoryChange}
      />
      <FAQList activeCategoryId={activeCategoryId} searchQuery={searchQuery} />
    </>
  );
}
