// src/app/(dashboard)/documents/[status]/page.js
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Importação dos componentes de UI e ícones
import Header from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronRight, Download, MoreVertical } from 'lucide-react';

// Mapeia o status da URL para a label e o parâmetro a ser enviado para a API
const statusMap = {
  pendentes: { label: "Pendentes", apiQuery: "pendentes" },
  concluidos: { label: "Concluídos", apiQuery: "concluidos" },
  todos: { label: "Todos", apiQuery: null },
  lixeira: { label: "Lixeira", apiQuery: "lixeira" },
};

// --- INÍCIO DA CORREÇÃO: COMPONENTE StatusBadge INCLUÍDO ---
/**
 * Componente para renderizar um Badge colorido com base no status do documento.
 * @param {object} props - Propriedades do componente.
 * @param {string} props.status - O status do documento (ex: 'SIGNED', 'READY').
 */
const StatusBadge = ({ status }) => {
    const styles = {
        'SIGNED': "text-green-700 border-green-200 bg-green-50",
        'READY': "text-orange-700 border-orange-200 bg-orange-50",
        'PARTIALLY_SIGNED': "text-blue-700 border-blue-200 bg-blue-50",
        'CANCELLED': "text-gray-700 border-gray-200 bg-gray-50",
        'EXPIRED': "text-red-700 border-red-200 bg-red-50",
    };
    const label = {
        'SIGNED': 'Concluído',
        'READY': 'Pendente',
        'PARTIALLY_SIGNED': 'Em andamento',
        'CANCELLED': 'Na Lixeira',
        'EXPIRED': 'Expirado',
    };
    // Usa 'border' para uma borda sutil e um fundo mais claro
    return <Badge variant="outline" className={`font-semibold ${styles[status] || styles['CANCELLED']}`}>{label[status] || status}</Badge>;
};
// --- FIM DA CORREÇÃO ---

export default function DocumentsPage({ params }) {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();

    const currentStatusKey = useMemo(() => {
        const segments = pathname.split('/');
        const statusFromUrl = segments[segments.length - 1];
        return statusMap[statusFromUrl] ? statusFromUrl : 'pendentes';
    }, [pathname]);

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Efeito para buscar os documentos da API
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchDocuments = async () => {
            setLoading(true);
            setError(null);
            try {
                const statusInfo = statusMap[currentStatusKey] || statusMap.pendentes;
                const apiQuery = statusInfo.apiQuery;
                const url = apiQuery ? `/documents?status=${apiQuery}` : '/documents';
                
                const response = await api.get(url);
                setDocuments(response.data);
            } catch (err) {
                console.error(`Falha ao buscar docs para '${currentStatusKey}':`, err);
                setError("Não foi possível carregar os documentos.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchDocuments();
    }, [isAuthenticated, currentStatusKey]);

    // Gera o conteúdo dos breadcrumbs para o Header
    const headerLeftContent = useMemo(() => {
        // ... (lógica dos breadcrumbs, sem alterações)
    }, [currentStatusKey]);
    
    // Função para lidar com o download
    const handleDownload = async (documentId) => {
        // ... (lógica de download, sem alterações)
    };

    // Função que renderiza o corpo da tabela
    const renderTableBody = () => {
        if (loading) {
            return Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skel-${index}`}><TableCell colSpan={6}><Skeleton className="w-full h-8" /></TableCell></TableRow>
            ));
        }
        if (error) {
            return <TableRow><TableCell colSpan={6} className="text-center h-24 text-red-600 font-medium">{error}</TableCell></TableRow>;
        }
        if (documents.length === 0) {
            return <TableRow><TableCell colSpan={6} className="text-center h-24 text-gray-500">Nenhum documento encontrado.</TableCell></TableRow>;
        }
        return documents.map((doc) => (
            <TableRow key={doc.id}>
                <TableCell><Checkbox /></TableCell>
                <TableCell className="font-medium text-gray-800">{doc.title}</TableCell>
                <TableCell><StatusBadge status={doc.status} /></TableCell>
                <TableCell>{"N/A"}</TableCell>
                <TableCell>{format(new Date(doc.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => handleDownload(doc.id)}>
                                <Download className="mr-2 h-4 w-4" />
                                <span>Baixar Documento</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <>
            <Header
                leftContent={headerLeftContent}
                actionButtonText="Enviar Documento"
            />
            <main className="flex-1 p-6 space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">Documentos</h2>
                <Card className="bg-white shadow-sm rounded-xl border">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"><Checkbox /></TableHead>
                                    <TableHead>Documento</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Pasta</TableHead>
                                    <TableHead>Criado Em</TableHead>
                                    <TableHead className="text-right w-[80px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderTableBody()}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between p-4 bg-gray-50/50 rounded-b-xl">
                        <div className="text-sm text-muted-foreground">Total de {documents.length} registros</div>
                    </CardFooter>
                </Card>
            </main>
        </>
    );
}