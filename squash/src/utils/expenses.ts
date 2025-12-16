export const getCategoryTotals = (transactions: any) => {
  const categoriesObj: any = {};

  // Sum total for each category
  transactions.forEach((t: any) => {
    if (!categoriesObj[t.category]) {
      categoriesObj[t.category] = {
        total: 0,
        subcategories: {},
      };
    }

    categoriesObj[t.category].total += t.amount;
  });

  // Within each category, sum total for each subcategory
  transactions.forEach((t: any) => {
    const category = categoriesObj[t.category];

    if (!category.subcategories[t.subcategory]) {
      category.subcategories[t.subcategory] = 0;
    }

    category.subcategories[t.subcategory] += t.amount;
  });

  // Convert to sorted arrays
  const sortedCategories = Object.entries(categoriesObj)
    .map(([name, { total, subcategories }]: any) => ({ name, total, subcategories })) //cast to array
    .sort((a, b) => b.total - a.total) //sort by total descending;
    .map((category: any) => {
      const sortedSubcategories = Object.entries(category.subcategories)
        .map(([name, total]: any) => ({ name, total })) //cast to array
        .sort((a, b) => b.total - a.total); //sort by total descending

      return {
        ...category,
        subcategories: sortedSubcategories,
      };
    });

  return sortedCategories;
};
