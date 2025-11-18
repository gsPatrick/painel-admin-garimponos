// src/components/dashboard/Navigation.js
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useAuth } from "@/context/AuthContext"; // <-- 1. IMPORTAR O HOOK
import {
  LayoutGrid, FileText, Folder, PenSquare, User, Settings, HelpCircle, ChevronDown, Shield
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// URL do WhatsApp formatada
const WHATSAPP_URL = "https://wa.me/5511987798662";

// Definição dos links de navegação
const navLinksPrimary = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { 
    label: "Documentos", 
    icon: FileText,
    basePath: "/documentos",
    sublinks: [
      { href: "/documentos/pendentes", label: "Pendentes" },
      { href: "/documentos/concluidos", label: "Concluídos" },
      { href: "/documentos/todos", label: "Todos" },
      { href: "/documentos/lixeira", label: "Lixeira" },
    ]
  },
  { href: "/pastas", label: "Pastas", icon: Folder },
  { href: "/signatarios", label: "Signatários", icon: PenSquare },
];

const navLinksAdmin = [
  { href: "/admin/users", label: "Usuários", icon: User },
  { href: "/admin/audit", label: "Auditoria", icon: Shield },
  { href: "/admin/settings", label: "Sistema", icon: Settings },
];

const navLinksSecondary = [
  { href: "/plano", label: "Meu Plano", icon: User },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
  { href: WHATSAPP_URL, label: "Suporte", icon: HelpCircle, isExternal: true },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth(); // <-- 2. ACESSAR OS DADOS DO USUÁRIO

  // Verifica se alguma rota de "Documentos" está ativa
  const isDocumentsActive = pathname.startsWith('/documentos');
  const [isDocumentsOpen, setIsDocumentsOpen] = React.useState(isDocumentsActive);

  React.useEffect(() => {
    setIsDocumentsOpen(isDocumentsActive);
  }, [isDocumentsActive]);

  return (
    <nav className="flex-grow flex flex-col space-y-6 overflow-y-auto">
      {/* Links de Navegação Primários */}
      <div className="space-y-1">
        {navLinksPrimary.map((link) => 
          link.sublinks ? (
            <Collapsible key={link.label} open={isDocumentsOpen} onOpenChange={setIsDocumentsOpen}>
              <CollapsibleTrigger asChild>
                <div className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-all hover:bg-gray-200/60 cursor-pointer", 
                  isDocumentsActive ? "text-blue-600" : "text-gray-800"
                )}>
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                  <ChevronDown className={`ml-auto h-5 w-5 text-gray-500 transition-transform ${isDocumentsOpen ? "rotate-0" : "-rotate-90"}`} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-9 space-y-1 mt-1">
                {link.sublinks.map(sublink => {
                   const isActive = pathname === sublink.href;
                   return (
                     <Link key={sublink.href} href={sublink.href} className={cn(
                       "block py-1.5 text-sm font-medium transition-colors hover:text-gray-900", 
                       isActive ? "text-blue-600 font-bold" : "text-gray-600"
                     )}>
                       {sublink.label}
                     </Link>
                   );
                })}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link key={link.href} href={link.href} className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-800 text-base font-medium transition-all hover:bg-gray-200/60", 
              pathname === link.href && "text-blue-600"
            )}>
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          )
        )}
      </div>

      {/* --- 3. APLICAÇÃO DA LÓGICA CONDICIONAL --- */}
      {/* O bloco "Administrativo" só será renderizado se user.role for 'ADMIN' */}
      {user?.role === 'ADMIN' && (
        <div className="space-y-1 pt-2 border-t border-gray-200">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Administrativo</p>
          {navLinksAdmin.map((link) => (
            <Link key={link.href} href={link.href} className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-800 text-base font-medium transition-all hover:bg-gray-200/60", 
              pathname.startsWith(link.href) && "text-blue-600" // Usei startsWith para manter ativo em sub-rotas
            )}>
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Links de Navegação Secundários */}
      <div className="space-y-1 pt-2 border-t border-gray-200">
         {navLinksSecondary.map((link) => (
          <Link 
            key={link.href} 
            href={link.href}
            target={link.isExternal ? "_blank" : undefined}
            rel={link.isExternal ? "noopener noreferrer" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-800 text-base font-medium transition-all hover:bg-gray-200/60", 
              pathname === link.href && "text-blue-600"
            )}>
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
} 