'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-primary/10 bg-white dark:bg-slate-950 py-16 px-6">
            <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-1">
                    <div className="mb-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                <span className="material-symbols-outlined text-white text-xl">waves</span>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-xl font-black bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">Alto Mar</span>
                                <span className="text-[8px] font-bold uppercase tracking-[3px] text-slate-400">Aquarismo</span>
                            </div>
                        </Link>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Sua loja especializada em aquarismo marinho. Corais, peixes, invertebrados e equipamentos selecionados para seu reef.
                    </p>
                </div>
                <div>
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-6">Loja</h5>
                    <ul className="space-y-4 text-sm text-slate-500 font-medium">
                        <li><Link href="/catalogo" className="hover:text-primary transition-colors">Catálogo Completo</Link></li>
                        <li><Link href="/novidades" className="hover:text-primary transition-colors">Novidades</Link></li>
                        <li><Link href="/mais-vendidos" className="hover:text-primary transition-colors">Mais Vendidos</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-6">Empresa</h5>
                    <ul className="space-y-4 text-sm text-slate-500 font-medium">
                        <li><Link href="#" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Nossa Loja</Link></li>
                        <li><a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Contato</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-6">Newsletter</h5>
                    <p className="text-sm text-slate-500 mb-4">Receba novidades sobre corais e ofertas especiais.</p>
                    <div className="flex flex-col gap-2">
                        <input
                            className="rounded-full border-primary/20 bg-primary/5 px-4 py-2.5 text-sm focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="Seu endereço de e-mail"
                            type="email"
                        />
                        <button className="w-full rounded-full bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                            Cadastrar
                        </button>
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-7xl mt-16 pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-slate-400">© 2026 Alto Mar Aquarismo. Todos os direitos reservados.</p>
                <div className="flex gap-6">
                    <Link href="#" className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">photo_camera</Link>
                    <span className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors cursor-pointer">smart_display</span>
                </div>
            </div>
        </footer>
    );
}
