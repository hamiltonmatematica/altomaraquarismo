'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAllCategories, getAllProducts } from '@/lib/data';
import { saveProductAction, uploadProductImageAction, deleteProductAction } from '@/lib/admin-actions';
import { Category, Product } from '@/types/database';
import { Suspense } from 'react';

export default function NovoProdutoPage() {
    return (
        <Suspense fallback={<div className="flex-1 p-8 text-slate-400">Carregando...</div>}>
            <NovoProdutoContent />
        </Suspense>
    );
}

function NovoProdutoContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const isEditing = !!productId;

    const [categories, setCategories] = useState<Category[]>([]);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [processingImages, setProcessingImages] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [minQuantity, setMinQuantity] = useState('1');
    const [categoryId, setCategoryId] = useState('');
    const [status, setStatus] = useState<'active' | 'draft'>('active');
    const [featured, setFeatured] = useState(false);
    const [tag, setTag] = useState('');
    const [productionTime, setProductionTime] = useState('');
    const [images, setImages] = useState<{ url: string; file?: File }[]>([]);

    useEffect(() => {
        async function load() {
            const cats = await getAllCategories();
            setCategories(cats);
            if (productId) {
                const results = await getAllProducts();
                const product = results.find(p => p.id === productId);
                if (product) {
                    setName(product.name);
                    setSlug(product.slug);
                    setCode(product.code || '');
                    setDescription(product.description || '');
                    setPrice(product.price.toString());
                    setMinQuantity(product.min_quantity.toString());
                    setCategoryId(product.category_id || '');
                    setStatus(product.status);
                    setFeatured(product.featured);
                    setTag(product.tag || '');
                    setProductionTime(product.production_time || '');
                    if (product.images && product.images.length > 0) {
                        setImages(product.images.sort((a, b) => a.sort_order - b.sort_order).map(img => ({ url: img.url })));
                    }
                }
            }
        }
        load();
    }, [productId]);

    const generateSlug = (text: string) =>
        text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const handleNameChange = (value: string) => {
        setName(value);
        setSlug(generateSlug(value));
    };

    const compressImage = async (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;
                    const MAX = 1600;
                    if (width > height) { if (width > MAX) { height *= MAX / width; width = MAX; } }
                    else { if (height > MAX) { width *= MAX / height; height = MAX; } }
                    canvas.width = width; canvas.height = height;
                    canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
                    canvas.toBlob(blob => {
                        if (blob) resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', { type: 'image/jpeg', lastModified: Date.now() }));
                        else resolve(file);
                    }, 'image/jpeg', 0.82);
                };
                img.onerror = () => resolve(file);
            };
            reader.onerror = () => resolve(file);
        });
    };

    const MAX_VIDEO_SIZE = 45 * 1024 * 1024; // 45MB (margem de segurança p/ limite de 50MB do Supabase)

    const compressVideo = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.muted = true;
            video.playsInline = true;
            video.preload = 'auto';
            video.src = URL.createObjectURL(file);

            video.onloadedmetadata = () => {
                // Calcula resolução alvo (max 720p)
                let { videoWidth: w, videoHeight: h } = video;
                const MAX_DIM = 720;
                if (w > h) { if (h > MAX_DIM) { w = Math.round(w * (MAX_DIM / h)); h = MAX_DIM; } }
                else { if (w > MAX_DIM) { h = Math.round(h * (MAX_DIM / w)); w = MAX_DIM; } }
                // Garante par (requerido por alguns codecs)
                w = w % 2 === 0 ? w : w + 1;
                h = h % 2 === 0 ? h : h + 1;

                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d')!;

                // Calcula bitrate proporcional à duração para ficar abaixo de 45MB
                const durationSec = video.duration || 30;
                const targetBytes = MAX_VIDEO_SIZE;
                const targetBitsPerSec = Math.min(2_000_000, Math.floor((targetBytes * 8) / durationSec * 0.85)); // 85% margem

                const stream = canvas.captureStream(24); // 24fps
                const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
                const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: targetBitsPerSec });
                const chunks: Blob[] = [];
                recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

                recorder.onstop = () => {
                    URL.revokeObjectURL(video.src);
                    const blob = new Blob(chunks, { type: mimeType });
                    const ext = mimeType.includes('webm') ? 'webm' : 'mp4';
                    const compressed = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.' + ext, { type: mimeType, lastModified: Date.now() });
                    console.log(`🎬 Vídeo comprimido: ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(compressed.size / 1024 / 1024).toFixed(1)}MB`);
                    resolve(compressed);
                };

                recorder.onerror = () => { URL.revokeObjectURL(video.src); reject(new Error('Erro ao comprimir vídeo')); };

                video.onended = () => { recorder.stop(); };
                recorder.start();
                video.play();

                // Desenha frames no canvas
                const drawFrame = () => {
                    if (video.ended || video.paused) return;
                    ctx.drawImage(video, 0, 0, w, h);
                    requestAnimationFrame(drawFrame);
                };
                drawFrame();
            };

            video.onerror = () => { URL.revokeObjectURL(video.src); reject(new Error('Não foi possível ler o vídeo')); };
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setProcessingImages(true);
        const files = Array.from(e.target.files);
        const newMedia: { url: string; file: File; type: 'image' | 'video' }[] = [];
        for (let file of files) {
            try {
                const isVideo = file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mov') || file.name.toLowerCase().endsWith('.mp4');
                if (isVideo) {
                    // Comprimir vídeo se exceder o limite
                    if (file.size > MAX_VIDEO_SIZE) {
                        try {
                            setErrorMsg(`Comprimindo vídeo (${(file.size / 1024 / 1024).toFixed(0)}MB)... Aguarde.`);
                            file = await compressVideo(file);
                            setErrorMsg('');
                        } catch (err) {
                            console.error('Erro ao comprimir vídeo:', err);
                            setErrorMsg(`Vídeo muito grande (${(file.size / 1024 / 1024).toFixed(0)}MB). Tente um vídeo menor que 45MB.`);
                            continue;
                        }
                    }
                    newMedia.push({ url: URL.createObjectURL(file), file, type: 'video' });
                    continue;
                }

                const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
                if (isHeic) {
                    try {
                        const heic2any = (await import('heic2any')).default;
                        const convertedBlob = await heic2any({ blob: file, quality: 0.7 });
                        const blobToUse = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                        file = new File([blobToUse], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
                    } catch(err) { 
                        console.error('HEIC convert error', err); 
                        continue; 
                    }
                }

                if (file.size > 1024 * 1024 || isHeic) file = await compressImage(file);
                newMedia.push({ url: URL.createObjectURL(file), file, type: 'image' });
            } catch (err) { console.error(err); }
        }
        setImages(prev => [...prev, ...newMedia as any]);
        setProcessingImages(false);
    };

    const removeImage = (index: number) => {
        setImages(prev => {
            const item = prev[index];
            if (item.url.startsWith('blob:')) URL.revokeObjectURL(item.url);
            return prev.filter((_, i) => i !== index);
        });
    };

    const moveImage = (index: number, dir: 'left' | 'right') => {
        const arr = [...images];
        const ni = dir === 'left' ? index - 1 : index + 1;
        if (ni < 0 || ni >= arr.length) return;
        [arr[index], arr[ni]] = [arr[ni], arr[index]];
        setImages(arr);
    };

    const handleDelete = async () => {
        if (!productId || !confirm('Tem certeza que deseja excluir este produto definitivamente?')) return;
        const { error } = await deleteProductAction(productId);
        if (!error) {
            alert('Produto excluído com sucesso.');
            router.push('/admin/produtos');
        } else {
            setErrorMsg(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSaving(true);
        setUploading(true);
        try {
            const finalImageUrls: string[] = [];
            for (const img of images) {
                if (img.file) {
                    const formData = new FormData();
                    formData.append('file', img.file);
                    const { publicUrl, error: uploadErr } = await uploadProductImageAction(formData);
                    if (publicUrl) finalImageUrls.push(publicUrl);
                    else throw new Error(`Erro no upload da imagem: ${uploadErr || 'Verifique o bucket no Supabase.'}`);
                } else {
                    finalImageUrls.push(img.url);
                }
            }
            
            const productData = {
                id: isEditing ? productId : undefined,
                name, slug, code: code || null, description: description || null,
                price: parseFloat(price) || 0, min_quantity: parseInt(minQuantity) || 1,
                category_id: categoryId || null, status, featured,
                tag: tag || null, production_time: productionTime || null,
            };
            
            const { error } = await saveProductAction(productData, finalImageUrls);

            if (!error) {
                alert(isEditing ? '✓ Produto atualizado com sucesso!' : '✓ Produto criado com sucesso!');
                router.push('/admin/produtos');
            } else {
                setErrorMsg(error || 'Erro ao salvar produto.');
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Erro inesperado.');
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-slate-950 min-h-screen text-white">
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-4">
                        ← Voltar ao Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-white">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h1>
                </div>
                {isEditing && (
                    <button
                        type="button" onClick={handleDelete}
                        className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl font-bold hover:bg-red-500/30 transition-all"
                    >
                        🗑 Excluir
                    </button>
                )}
            </div>

            {errorMsg && (
                <div className="mb-6 bg-red-500/20 border-2 border-red-500/50 text-red-400 px-6 py-4 rounded-2xl font-bold">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">

                {/* Informações Básicas */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-5 shadow-xl">
                    <h2 className="font-bold text-lg text-white">📋 Informações Básicas</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-300 mb-2">Nome do Produto *</label>
                            <input
                                type="text" value={name} onChange={(e) => handleNameChange(e.target.value)} required
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-0 transition-colors outline-none"
                                placeholder="Ex: Skimmer Bubble Magus Curve 5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Código</label>
                            <input
                                type="text" value={code} onChange={(e) => setCode(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-0 transition-colors outline-none"
                                placeholder="Ex: ALT-001"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Slug (URL)</label>
                            <input
                                type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-0 transition-colors outline-none font-mono text-sm"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-300 mb-2">Descrição</label>
                            <textarea
                                value={description} onChange={(e) => setDescription(e.target.value)} rows={5}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-0 transition-colors resize-none outline-none"
                                placeholder="Descreva os detalhes e especificações do produto..."
                            />
                        </div>
                    </div>
                </div>

                {/* Imagens */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-5 shadow-xl">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-lg text-white">🖼 Imagens do Produto</h2>
                        <label className={`cursor-pointer inline-flex items-center gap-2 bg-cyan-600 px-4 py-2 rounded-xl text-sm text-white font-bold transition-all shadow-lg shadow-cyan-500/20 ${processingImages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-500'}`}>
                            {processingImages ? 'Processando...' : '+ Escolher Fotos'}
                            <input
                                type="file"
                                accept="image/*,video/*,image/heic,image/heif,.heic,.heif,.mov,.mp4"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={processingImages}
                            />
                        </label>
                    </div>
                    <p className="text-xs text-slate-400">A primeira foto à esquerda será a principal. Use as setas para reordenar.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((img, index) => (
                            <div key={index} className="group relative aspect-square bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 hover:border-cyan-500 transition-all">
                                {(img as any).type === 'video' || img.url.toLowerCase().split('?')[0].match(/\.(mp4|mov)$/) ? (
                                    <video src={img.url} className="w-full h-full object-cover" muted playsInline />
                                ) : (
                                    <img src={img.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                )}
                                {index === 0 && (
                                    <div className="absolute top-2 left-2 bg-cyan-500 text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase text-white">
                                        Principal
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => moveImage(index, 'left')} disabled={index === 0} className="w-8 h-8 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg flex items-center justify-center disabled:opacity-30">←</button>
                                        <button type="button" onClick={() => moveImage(index, 'right')} disabled={index === images.length - 1} className="w-8 h-8 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg flex items-center justify-center disabled:opacity-30">→</button>
                                    </div>
                                    <button type="button" onClick={() => removeImage(index)} className="w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">🗑</button>
                                </div>
                            </div>
                        ))}
                        {images.length === 0 && (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl text-slate-500">
                                <p className="text-4xl mb-3">🖼</p>
                                <p className="text-sm font-bold">Clique em "Escolher Fotos" para adicionar imagens</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preço e Quantidade */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-5 shadow-xl">
                    <h2 className="font-bold text-lg text-white">💰 Preço e Quantidade</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Preço (R$) *</label>
                            <input
                                type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-0 transition-colors outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Qtd. Mínima</label>
                            <input
                                type="number" value={minQuantity} onChange={(e) => setMinQuantity(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-0 transition-colors outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Prazo de Produção</label>
                            <input
                                type="text" value={productionTime} onChange={(e) => setProductionTime(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-0 transition-colors outline-none"
                                placeholder="Ex: Pronta entrega"
                            />
                        </div>
                    </div>
                </div>

                {/* Classificação */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-5 shadow-xl">
                    <h2 className="font-bold text-lg text-white">🏷 Classificação</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Categoria</label>
                            <select
                                value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-0 transition-colors outline-none"
                            >
                                <option value="">Selecione...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Tag</label>
                            <input
                                type="text" value={tag} onChange={(e) => setTag(e.target.value)}
                                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-0 transition-colors outline-none"
                                placeholder="Ex: Novo, Importado, Promoção"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Status</label>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setStatus('active')} className={`flex-1 rounded-xl px-4 py-3 font-bold text-sm transition-all ${status === 'active' ? 'bg-green-600 text-white border-2 border-green-500' : 'bg-slate-900 text-slate-400 border-2 border-slate-700 opacity-50'}`}>Ativo</button>
                                <button type="button" onClick={() => setStatus('draft')} className={`flex-1 rounded-xl px-4 py-3 font-bold text-sm transition-all ${status === 'draft' ? 'bg-yellow-600 text-white border-2 border-yellow-500' : 'bg-slate-900 text-slate-400 border-2 border-slate-700 opacity-50'}`}>Rascunho</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Destaque</label>
                            <button type="button" onClick={() => setFeatured(!featured)} className={`w-full rounded-xl px-4 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 ${featured ? 'bg-orange-600 text-white border-2 border-orange-500' : 'bg-slate-900 text-slate-400 border-2 border-slate-700 opacity-50'}`}>
                                ★ {featured ? 'Em destaque' : 'Não destacado'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <div className="flex gap-4 pt-6 pb-20">
                    <button
                        type="submit" disabled={saving}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-8 py-4 text-white font-black text-lg hover:bg-cyan-500 transition-all disabled:opacity-50 shadow-xl shadow-cyan-500/30"
                    >
                        {saving ? (uploading ? 'Enviando Fotos...' : 'Salvando...') : (isEditing ? 'Salvar Alterações' : 'Criar Produto')}
                    </button>
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-700 px-8 py-4 text-slate-400 font-bold hover:border-slate-500 transition-all"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}
