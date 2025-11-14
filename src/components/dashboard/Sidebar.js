// src/components/dashboard/Sidebar.js
"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { ChevronsUpDown, LogOut, Signature, User, HelpCircle } from "lucide-react";

// Importação dos componentes de UI
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Importa o componente de navegação que contém a lógica dos links
import Navigation from "./Navigation";

/**
 * Componente da Sidebar para visualização em Desktop.
 * Fica visível apenas em telas grandes (lg e acima).
 */
export default function Sidebar() {
  // Obtém o objeto 'user' e a função 'logout' do nosso contexto de autenticação
  const { user, logout } = useAuth();

  // Função para gerar as iniciais do nome do usuário para o AvatarFallback
  const getInitials = (name) => {
    if (!name) return 'U'; // Retorna 'U' de "Usuário" se o nome não estiver disponível
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    // A classe `hidden lg:flex` é o segredo da responsividade:
    // 'hidden' -> escondido por padrão
    // 'lg:flex' -> se torna flexível (visível) no breakpoint 'lg' (large)
    <aside className="hidden lg:flex flex-col w-[240px] h-screen bg-[#F7F9FC] border-r">
      
      {/* Container principal que empurra o perfil do usuário para o final */}
      <div className="flex-grow flex flex-col p-4 space-y-8">
        
        {/* Seção do Logo */}
        <div className="px-2">
          <Link href="/dashboard" aria-label="Voltar para o Dashboard">
            <Image src="/logo.png" alt="Logo Doculink" width={140} height={32} priority />
          </Link>
        </div>
        
        {/* Renderiza o componente de navegação compartilhado */}
        <Navigation />

      </div>
      
      {/* Seção do Perfil do Usuário (fixa no final da sidebar) */}
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 text-left p-2 rounded-lg transition-colors hover:bg-gray-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <Avatar className="h-10 w-10">
                {/* A imagem do avatar pode ser adicionada aqui se o usuário tiver uma */}
                {/* <AvatarImage src={user?.avatarUrl} alt={user?.name} /> */}
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'Carregando...'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-gray-500 shrink-0" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64 mb-2" align="end">
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Signature className="mr-2 h-4 w-4" />
              <span>Área de assinatura</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/configuracoes">
                <User className="mr-2 h-4 w-4" />
                <span>Meu perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/support">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Ajuda</span>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={logout} className="text-red-600 focus:bg-red-50 focus:text-red-700">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}