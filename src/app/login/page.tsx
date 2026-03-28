'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Waves, Loader2, LogIn } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError('E-mail ou senha incorretos.')
            setLoading(false)
        } else {
            router.push('/admin')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-md w-full relative">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20 mb-6">
                        <Waves className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Alto Mar</h1>
                    <p className="text-slate-400 font-medium">Painel Administrativo</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 text-white px-5 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="seu@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 text-white px-5 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-bold text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-6 h-6" />
                                    Entrar no Painel
                                </>
                            )}
                        </button>
                    </form>
                    
                    <button 
                        onClick={async () => {
                            if (!email) {
                                setError('Digite seu e-mail para recuperar a senha');
                                return;
                            }
                            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                                redirectTo: `${window.location.origin}/auth/callback?next=/admin/perfil`,
                            });
                            if (error) setError(error.message);
                            else alert('E-mail de recuperação enviado!');
                        }}
                        className="w-full text-center text-slate-500 text-sm font-bold mt-6 hover:text-white transition-colors"
                    >
                        Esqueceu sua senha?
                    </button>
                </div>
            </div>
        </div>
    )
}
