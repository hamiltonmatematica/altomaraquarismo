'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Key, Save, Loader2, CheckCircle2 } from 'lucide-react'

export default function ProfilePage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [])

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMsg({ type: 'error', text: 'As senhas não coincidem.' })
            return
        }
        
        setLoading(true)
        setMsg(null)

        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            setMsg({ type: 'error', text: error.message })
        } else {
            setMsg({ type: 'success', text: 'Senha atualizada com sucesso!' })
            setPassword('')
            setConfirmPassword('')
        }
        setLoading(false)
    }

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <User className="w-8 h-8 text-blue-600" /> Meu Perfil
            </h1>

            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
                <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">E-mail</label>
                    <div className="w-full bg-slate-50 border border-slate-100 text-slate-500 px-5 py-4 rounded-2xl font-bold cursor-not-allowed">
                        {user.email}
                    </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Key className="w-5 h-5 text-amber-500" /> Redefinir Senha
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nova Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-white border border-slate-200 text-slate-800 px-5 py-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                                placeholder="******"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Confirmar Senha</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-white border border-slate-200 text-slate-800 px-5 py-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
                                placeholder="******"
                            />
                        </div>
                    </div>

                    {msg && (
                        <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${msg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                            {msg.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                            {msg.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 text-lg"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <Save className="w-6 h-6" />
                                Salvar Nova Senha
                            </>
                        )}
                    </button>
                </form>

                <div className="pt-4">
                    <button 
                        onClick={async () => {
                            await supabase.auth.signOut();
                            router.push('/login');
                            router.refresh();
                        }}
                        className="w-full text-slate-400 font-bold hover:text-red-500 text-sm transition-colors uppercase tracking-widest"
                    >
                        Sair do Painel
                    </button>
                </div>
            </div>
        </div>
    )
}
