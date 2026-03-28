import Link from "next/link";
import { FileText, Package, LayoutGrid, Users, User, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isMaster = user?.email === 'hamilton.vinicius@gmail.com';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Administração</h1>
          <p className="text-slate-500 font-bold">Bem-vindo, {user?.email}</p>
        </div>
        <Link 
            href="/admin/perfil"
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-3 rounded-2xl hover:bg-slate-200 transition-all font-bold"
        >
            <User className="w-5 h-5 text-blue-600" />
            Meu Perfil
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/admin/produtos" 
          className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:border-blue-400 transition-all group"
        >
          <div className="bg-blue-100 p-5 rounded-3xl mb-4 group-hover:bg-blue-200 transition-colors">
            <Package className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Produtos</h2>
          <p className="text-center text-slate-500 text-sm font-medium">
            Cadastre e edite os produtos do catálogo
          </p>
        </Link>

        <Link 
          href="/admin/categorias" 
          className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:border-emerald-400 transition-all group"
        >
          <div className="bg-emerald-100 p-5 rounded-3xl mb-4 group-hover:bg-emerald-200 transition-colors">
            <LayoutGrid className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Categorias</h2>
          <p className="text-center text-slate-500 text-sm font-medium">
            Organize as seções do seu site
          </p>
        </Link>

        {isMaster && (
          <Link 
            href="/admin/usuarios" 
            className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:border-amber-400 transition-all group"
          >
            <div className="bg-amber-100 p-5 rounded-3xl mb-4 group-hover:bg-amber-200 transition-colors">
              <Users className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Usuários</h2>
            <p className="text-center text-slate-500 text-sm font-medium">
              Gerencie quem pode acessar o painel
            </p>
          </Link>
        )}
        
        <Link 
          href="/admin/export-pdf" 
          className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:border-slate-400 transition-all group"
        >
          <div className="bg-slate-100 p-5 rounded-3xl mb-4 group-hover:bg-slate-200 transition-colors">
            <FileText className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Exportar PDF</h2>
          <p className="text-center text-slate-500 text-sm font-medium">
            Gere um PDF interativo dos produtos
          </p>
        </Link>
      </div>
    </div>
  );
}
