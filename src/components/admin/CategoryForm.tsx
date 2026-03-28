'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveCategory } from '@/lib/admin-actions';
import { Category } from '@/types/database';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface CategoryFormProps {
    category?: Category | null;
}

export default function CategoryForm({ category }: CategoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            id: category?.id,
            name: formData.get('name') as string,
            slug: formData.get('slug') as string,
            icon: formData.get('icon') as string,
            sort_order: parseInt(formData.get('sort_order') as string || '0'),
            active: formData.get('active') === 'on',
        };

        try {
            await saveCategory(data as any);
            router.push('/admin/categorias');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar categoria');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto py-8">
            <Link 
                href="/admin/categorias" 
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium"
            >
                <ChevronLeft className="w-4 h-4" />
                Voltar para Categorias
            </Link>

            <h1 className="text-3xl font-bold mb-8 text-slate-800">
                {category ? 'Editar Categoria' : 'Nova Categoria'}
            </h1>

            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Nome da Categoria</label>
                    <input 
                        name="name"
                        defaultValue={category?.name}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                        placeholder="Ex: Peixes Marinhos, Corais, etc."
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Slug (URL)</label>
                        <input 
                            name="slug"
                            defaultValue={category?.slug}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-mono text-sm"
                            placeholder="ex: peixes-marinhos"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Ícone (Emoji ou Lucide)</label>
                        <input 
                            name="icon"
                            defaultValue={category?.icon}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                            placeholder="🐟, 🐚, etc."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 items-center">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Ordem de Exibição</label>
                        <input 
                            name="sort_order"
                            type="number"
                            defaultValue={category?.sort_order || 0}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                        <input 
                            name="active"
                            type="checkbox"
                            defaultChecked={category ? category.active : true}
                            className="w-6 h-6 rounded-lg text-emerald-600 focus:ring-emerald-500 border-slate-300 transition-all cursor-pointer"
                        />
                        <label className="text-slate-800 font-bold cursor-pointer">Ativa no site?</label>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
                        {error}
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-lg"
                >
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <Save className="w-6 h-6" />
                    )}
                    {category ? 'Salvar Alterações' : 'Criar Categoria'}
                </button>
            </div>
        </form>
    );
}
