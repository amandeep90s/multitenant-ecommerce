interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function Category({ params }: CategoryPageProps) {
  const { category } = await params;

  return <div>Page category {category}</div>;
}
