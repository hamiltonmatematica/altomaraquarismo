import ProductForm from "@/components/admin/ProductForm";
import { getAllProducts, getAllCategories } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default async function AdminProductEditPage({ params }: { params: { id: string } }) {
    const [products, categories] = await Promise.all([
        getAllProducts(),
        getAllCategories()
    ]);
    
    const product = products.find(p => p.id === params.id);

    return <ProductForm product={product} categories={categories} />;
}
