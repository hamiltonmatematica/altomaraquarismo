'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAllCategories } from '@/lib/data';
import { saveCategory } from '@/lib/admin-actions';

export default function NovaCategoriaPage() {
    return (
        <Suspense fallback={<div className="flex-1 p-8 text-slate-400">Carregando...</div>}>
            <NovaCategoriaContent />
        </Suspense>
    );
}

// Ícones recomendados para aquarismo (nomes Lucide usados como texto)
const ICONS = [
    'waves', 'fish', 'shell', 'anchor', 'droplets', 'thermometer',
    'zap', 'filter', 'beaker', 'sparkles', 'heart', 'star',
    'package', 'tag', 'camera', 'settings', 'leaf', 'sun',
    'moon', 'activity',
];

function NovaCategoriaContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [icon, setIcon] = useState('waves');
    const [sortOrder, setSortOrder] = useState(0);
    const [active, setActive] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editId) {
            const loadCategory = async () => {
                const cats = await getAllCategories();
                const cat = cats.find(c => c.id === editId);
                if (cat) {
                    setName(cat.name);
                    setSlug(cat.slug);
                    setIcon(cat.icon || 'waves');
                    setSortOrder(cat.sort_order);
                    setActive(cat.active);
                }
            };
            loadCategory();
        }
    }, [editId]);

    const generateSlug = (text: string) =>
        text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const handleNameChange = (value: string) => {
        setName(value);
        if (!editId) setSlug(generateSlug(value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = { id: editId || undefined, name, slug, icon, sort_order: sortOrder, active };
            await saveCategory(data);
            alert(editId ? '✓ Categoria atualizada' : '✓ Categoria criada!');
            router.push('/admin/categorias');
        } catch (err: any) {
            alert('Erro: ' + err.message);
        }
    };

    return (
        <div className="flex-1 p-8 bg-slate-950 min-h-screen text-white">
            <div className="mb-8">
                <Link href="/admin/categorias" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-4">
                    ← Voltar para Categorias
                </Link>
                <h1 className="text-3xl font-black text-white">{editId ? 'Editar Categoria' : 'Nova Categoria'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-5">

                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Nome da Categoria</label>
                        <input
                            type="text" value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-0 transition-colors outline-none"
                            placeholder="Ex: Peixes Marinhos"
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">Slug (URL)</label>
                        <input
                            type="text" value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-0 transition-colors outline-none font-mono text-sm"
                            placeholder="peixes-marinhos"
                            required
                        />
                    </div>

                    {/* Ícone */}
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-3">
                            Ícone — <span className="text-cyan-400 font-mono">{icon}</span>
                        </label>
                        <div className="grid grid-cols-10 gap-2 mb-3">
                            {ICONS.map(ic => (
                                <button
                                    type="button" key={ic} onClick={() => setIcon(ic)}
                                    title={ic}
                                    className={`p-2 rounded-xl flex items-center justify-center text-xs font-bold uppercase tracking-wide leading-tight transition-all ${icon === ic ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    {ic.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text" value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-0 transition-colors outline-none font-mono text-sm"
                            placeholder="Nome do ícone (ex: waves, fish, shell...)"
                        />
                        <p className="text-xs text-slate-500 mt-2">Use nomes de ícones do Lucide React. Os botões acima são atalhos. Ex: waves, fish, shell, anchor, droplets.</p>
                    </div>

                    {/* Ordem + Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Ordem de Exibição</label>
                            <input
                                type="number" value={sortOrder}
                                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-0 transition-colors outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Status</label>
                            <button
                                type="button" onClick={() => setActive(!active)}
                                className={`w-full rounded-xl px-4 py-3 font-bold transition-all ${active ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30' : 'bg-red-500/20 text-red-400 border-2 border-red-500/30'}`}
                            >
                                {active ? '✓ Ativa' : '✗ Inativa'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <div className="flex gap-4">
                    <button
                        type="submit" disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-8 py-3 text-white font-bold hover:bg-cyan-500 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
                    >
                        {saving ? 'Salvando...' : (editId ? 'Atualizar' : 'Criar Categoria')}
                    </button>
                    <Link
                        href="/admin/categorias"
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-700 px-8 py-3 text-slate-400 font-bold hover:border-slate-500 transition-all"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}
