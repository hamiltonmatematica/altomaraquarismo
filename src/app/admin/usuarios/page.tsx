import { createClient } from "@/utils/supabase/server";
import { listAuthUsers } from "@/lib/user-actions";
import { UserPlus, Shield, User, Trash2, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import { deleteAuthUser, createNewUser } from "@/lib/user-actions";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const supabase = createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    // MASTER_EMAIL: Define quem pode gerenciar usuários
    const MASTER_EMAIL = 'hamilton.vinicius@gmail.com';

    if (!currentUser || currentUser.email !== MASTER_EMAIL) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-red-50 text-red-700 rounded-3xl border border-red-100">
                <Shield className="w-16 h-16 mb-4 stroke-[3]" />
                <h1 className="text-2xl font-black">Acesso Negado</h1>
                <p className="font-bold opacity-80">Apenas o administrador master pode gerenciar os usuários.</p>
            </div>
        );
    }

    const users = await listAuthUsers();

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 font-black text-xs uppercase px-3 py-1 rounded-full mb-2">
                        <Shield className="w-3 h-3" /> Master Admin Only
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">Gerenciar Acesso</h1>
                    <p className="text-slate-500 font-medium">Controle quem pode editar o site</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 uppercase text-[10px] font-black text-slate-400 tracking-[0.2em]">
                                <th className="px-6 py-4">Usuário</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="border-b border-slate-50 group hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${u.email === MASTER_EMAIL ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {u.email?.[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 flex items-center gap-2">
                                                    {u.email}
                                                    {u.email === MASTER_EMAIL && <Shield className="w-4 h-4 text-amber-500 fill-amber-500" />}
                                                </div>
                                                <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                                    Criado em {new Date(u.created_at).toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {u.last_sign_in_at ? (
                                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Ativo</span>
                                        ) : (
                                            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest italic">Pendente</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        {u.email !== MASTER_EMAIL && (
                                            <form action={async () => {
                                                'use server'
                                                await deleteAuthUser(u.id);
                                            }}>
                                                <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </form>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-6">
                    <div className="bg-emerald-600 p-8 rounded-3xl shadow-xl shadow-emerald-600/20 text-white">
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <UserPlus className="w-6 h-6" /> Novo Usuário
                        </h2>
                        <form action={async (formData) => {
                            'use server'
                            const email = formData.get('email') as string;
                            if (email) await createNewUser(email);
                        }} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">E-mail para convite</label>
                                <input 
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 px-5 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/10 focus:border-white transition-all font-bold"
                                    placeholder="cliente@email.com"
                                />
                            </div>
                            <button className="w-full bg-white text-emerald-700 font-black py-4 rounded-2xl hover:bg-emerald-50 active:scale-95 transition-all shadow-lg text-lg flex items-center justify-center gap-2">
                                <Mail className="w-5 h-5" /> Enviar Convite
                            </button>
                        </form>
                        <p className="mt-6 text-[11px] font-bold opacity-70 leading-relaxed italic uppercase tracking-wider">
                            * Os usuários convidados receberão um e-mail para escolherem sua própria senha e acessar o painel.
                        </p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 text-slate-500">
                        <h3 className="font-black text-slate-800 mb-2 uppercase tracking-widest text-xs flex items-center gap-2">
                            <Shield className="w-4 h-4" /> Master Admin
                        </h3>
                        <p className="text-sm font-medium leading-relaxed">
                            Apenas usuários logados com o e-mail master `{MASTER_EMAIL}` podem ver esta tela e remover outros usuários.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
