import CategoryForm from "@/components/admin/CategoryForm";
import { getAllCategories } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default async function AdminCategoryEditPage({ params }: { params: { id: string } }) {
    const categories = await getAllCategories();
    const category = categories.find(c => c.id === params.id);

    return <CategoryForm category={category} />;
}
