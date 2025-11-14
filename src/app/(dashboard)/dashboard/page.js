// src/app/(dashboard)/page.js
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

// Importação de Componentes
import Header from "@/components/dashboard/Header";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';
import { FileClock, FileCheck2, Files } from "lucide-react"; // Ícones mais representativos

export default function DashboardPage() {
  // Obtém o usuário e o status de carregamento do AuthContext
  const { user, loading: authLoading } = useAuth();
  
  // Estado para armazenar as estatísticas dos documentos
  const [stats, setStats] = useState({
    pending: 0,
    signed: 0,
    total: 0,
  });
  // Estado para o carregamento das estatísticas
  const [statsLoading, setStatsLoading] = useState(true);

  // Efeito para buscar as estatísticas da API quando o usuário for autenticado
  useEffect(() => {
    if (user) { // Garante que só busca os dados se o usuário estiver logado
      const fetchStats = async () => {
        setStatsLoading(true);
        try {
          const { data } = await api.get('/documents/stats');
          setStats(data);
        } catch (error) {
          console.error("Erro ao buscar estatísticas:", error);
          // Opcional: Adicionar um estado de erro para exibir na UI
        } finally {
          setStatsLoading(false);
        }
      };
      fetchStats();
    }
  }, [user]); // Roda sempre que o objeto 'user' mudar

  // Exibe um esqueleto da página inteira enquanto o usuário está sendo autenticado
  if (authLoading) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  const userName = user?.name || "Usuário";
  const headerLeftContent = <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>;

  return (
    <>
      <Header
        leftContent={headerLeftContent}
        actionButtonText="Enviar Documento"
        onActionButtonClick={() => console.log("Botão 'Enviar Documento' do Header clicado!")}
      />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Olá, {userName}</h2>
            <p className="text-sm text-muted-foreground mt-1">Bem-vindo(a) de volta!</p>
          </div>
          <Button className="bg-[#1c4ed8] hover:bg-[#1c4ed8]/90 text-white font-semibold rounded-lg">
            Alterar plano
          </Button>
        </div>

        {/* Grid de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total de Documentos" icon={Files}>
            {statsLoading ? <Skeleton className="h-12 w-20 mt-2" /> : <p className="text-5xl font-bold text-gray-800 mt-2">{stats.total}</p>}
          </StatCard>
          
          <StatCard title="Aguardando Assinatura" icon={FileClock}>
            {statsLoading ? <Skeleton className="h-12 w-20 mt-2" /> : <p className="text-5xl font-bold text-gray-800 mt-2">{stats.pending}</p>}
          </StatCard>
          
          <StatCard title="Finalizados" icon={FileCheck2}>
            {statsLoading ? <Skeleton className="h-12 w-20 mt-2" /> : <p className="text-5xl font-bold text-gray-800 mt-2">{stats.signed}</p>}
          </StatCard>
        </div>
      </main>
    </>
  );
}