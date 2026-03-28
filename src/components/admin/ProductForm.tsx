'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveProduct, deleteProduct } from '@/lib/admin-actions';
import { Product, Category } from '@/types/database';
import { ChevronLeft, Save, Loader2, Trash2, Camera, Star, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductFormProps {
    product?: Product | null;
    categories: Category[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>(product?.images?.map(i => i.url) || []);
    const [isFeatured, setIsFeatured] = useState(product?.featured || false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data: any = {
            id: product?.id,
            name: formData.get('name') as string,
            slug: (formData.get('slug') as string) || (formData.get('name') as string)?.toLowerCase().replace(/ /g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
            code: formData.get('code') as string,
            price: parseFloat(formData.get('price') as string || '0'),
            min_quantity: parseInt(formData.get('min_quantity') as string || '1'),
            category_id: formData.get('category_id') as string,
            description: formData.get('description') as string,
            status: formData.get('status') as string,
            featured: isFeatured,
            tag: formData.get('tag') as string,
            production_time: formData.get('production_time') as string,
        };

        try {
            await saveProduct(data, images);
            router.push('/admin/produtos');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar produto');
            setLoading(false);
        }
    };

    const addImageUrl = () => {
        const url = prompt('URL da imagem:');
        if (url) setImages([...images, url]);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto py-10 px-4">
            <Link 
                href="/admin/produtos" 
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-all font-semibold group bg-slate-100/50 px-4 py-2 rounded-xl"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Painel de Controle
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <h1 className="text-4xl font-black text-slate-900">
                    {product ? 'Editar Produto' : 'Novo Produto'}
                </h1>
                
                {product && (
                    <button 
                        type="button"
                        onClick={async () => {
                            if(confirm('Tem certeza?')) {
                                await deleteProduct(product.id);
                                router.push('/admin/produtos');
                            }
                        }}
                        className="flex items-center gap-2 text-red-600 font-bold bg-red-50 hover:bg-red-100 px-6 py-3 rounded-2xl transition-all border border-red-100 active:scale-95"
                    >
                        <Trash2 className="w-5 h-5" />
                        Remover Produto
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
                        <h2 className="text-xl font-black text-slate-900 mb-6">Informações Básicas</h2>
                        
                        <div>
                            <label className="block text-sm font-black text-slate-500 mb-2 uppercase tracking-widest">Nome do Produto</label>
                            <input 
                                name="name"
                                defaultValue={product?.name}
                                required
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 text-lg"
                                placeholder="Ex: Skimmer Bubble Magus Curve 5"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-black text-slate-500 mb-2 uppercase tracking-widest">Slug (URL)</label>
                                <input 
                                    name="slug"
                                    defaultValue={product?.slug}
                                    className="w-full px-5 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono text-sm"
                                    placeholder="skimmer-bubble-magus"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-black text-slate-500 mb-2 uppercase tracking-widest">Código (SKU)</label>
                                <input 
                                    name="code"
                                    defaultValue={product?.code || ''}
                                    className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                    placeholder="Ex: ALT-001"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-500 mb-2 uppercase tracking-widest">Descrição</label>
                            <textarea 
                                name="description"
                                defaultValue={product?.description || ''}
                                rows={6}
                                className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                placeholder="Descreva os detalhes e especificações do produto..."
                            />
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-900">Galeria de Fotos</h2>
                            <button 
                                type="button" 
                                onClick={addImageUrl}
                                className="text-blue-600 font-bold flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
                            >
                                <Plus className="w-4 h-4" /> Adicionar Imagem
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((url, i) => (
                                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group">
                                    <Image src={url} alt="Prod" fill className="object-cover" />
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button 
                                type="button"
                                onClick={addImageUrl}
                                className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50/50 transition-all gap-2"
                            >
                                <Camera className="w-8 h-8" />
                                <span className="text-xs font-bold uppercase">Add Foto</span>
                            </button>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6 sticky top-10">
                        <h2 className="text-xl font-black text-slate-900 mb-6">Configurações</h2>

                        <div>
                            <label className="block text-sm font-black text-slate-500 mb-2 uppercase tracking-widest">Preço de Venda</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
                                <input 
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={product?.price}
                                    required
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-xl text-blue-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-500 mb-2 uppercase tracking-widest">Categoria</label>
                            <select 
                                name="category_id"
                                defaultValue={product?.category_id || ''}
                                required
                                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700 bg-slate-50/50"
                            >
                                <option value="">Selecione...</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-black text-slate-500 mb-2 uppercase tracking-widest">Mínimo</label>
                                <input 
                                    name="min_quantity"
                                    type="number"
                                    defaultValue={product?.min_quantity || 1}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-black text-slate-500 mb-2 uppercase tracking-widest">Status</label>
                                <select 
                                    name="status"
                                    defaultValue={product?.status || 'active'}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold"
                                >
                                    <option value="active">Ativo</option>
                                    <option value="draft">Rascunho</option>
                                </select>
                            </div>
                        </div>

                        <button 
                            type="button"
                            onClick={() => setIsFeatured(!isFeatured)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${isFeatured ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                        >
                            <span className="font-bold flex items-center gap-2">
                                <Star className={`w-5 h-5 ${isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                                Destacar na Home
                            </span>
                            <div className={`w-10 h-6 rounded-full relative transition-all ${isFeatured ? 'bg-amber-500' : 'bg-slate-300'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isFeatured ? 'right-1' : 'left-1'}`} />
                            </div>
                        </button>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-sm font-bold">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black active:scale-95 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 text-xl"
                        >
                            {loading ? (
                                <Loader2 className="w-7 h-7 animate-spin" />
                            ) : (
                                <Save className="w-7 h-7" />
                            )}
                            {product ? 'Salvar Tudo' : 'Publicar Produto'}
                        </button>
                    </section>
                </div>
            </div>
        </form>
    );
}
