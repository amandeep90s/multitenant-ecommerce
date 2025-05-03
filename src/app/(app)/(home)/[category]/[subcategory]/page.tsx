interface SubCategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export default async function SubCategory({ params }: SubCategoryPageProps) {
  const { category, subcategory } = await params;

  return (
    <div>
      Page category {category} - {subcategory}
    </div>
  );
}
