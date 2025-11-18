// src/app/(dashboard)/admin/audit/page.js
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api'; // Cliente Axios
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Header from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    ShieldAlert, Search, Download, Filter, LogIn, Trash2, FileText, 
    AlertTriangle, Eye, MapPin, Globe, Laptop, Key, Copy, Server
} from "lucide-react";

// --- COMPONENTES AUXILIARES ---

// Mapeia a ação/categoria para uma cor de badge
const getSeverityStyle = (action, category) => {
    if (['LOGIN_FAILED', 'OTP_FAILED', 'ACCOUNT_LOCKED', 'USER_DELETED'].includes(action)) {
        return "bg-red-50 text-red-700 border-red-200 font-bold"; // Crítico
    }
    if (['SETTINGS_CHANGED', 'API_KEY_GENERATED'].includes(action)) {
        return "bg-amber-50 text-amber-700 border-amber-200"; // Alerta
    }
    if (category === 'security') {
        return "bg-blue-50 text-blue-700 border-blue-200"; // Segurança (Info)
    }
    return "bg-gray-50 text-gray-600 border-gray-200"; // Padrão
};

const ActionBadge = ({ action, category }) => {
    const style = getSeverityStyle(action, category);
    return <Badge variant="outline" className={style}>{action}</Badge>;
};

const ActionIcon = ({ action }) => {
    if (action.includes("LOGIN")) return <LogIn className="h-4 w-4 text-blue-500" />;
    if (action.includes("DELETED")) return <Trash2 className="h-4 w-4 text-red-500" />;
    if (action.includes("DOCUMENT") || action.includes("SIGNED")) return <FileText className="h-4 w-4 text-indigo-500" />;
    if (action.includes("KEY") || action.includes("SETTINGS")) return <Key className="h-4 w-4 text-amber-500" />;
    if (action.includes("LOCKED") || action.includes("FAILED")) return <AlertTriangle className="h-4 w-4 text-red-600" />;
    return <ShieldAlert className="h-4 w-4 text-gray-500" />;
};

// Componente de Card de Estatística (Estático por enquanto, ou poderia ter endpoint dedicado)
const AuditStatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
    <Card className="border shadow-sm">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
                </div>
                <div className={`p-3 rounded-xl ${bgClass}`}>
                    <Icon className={`h-6 w-6 ${colorClass}`} />
                </div>
            </div>
        </CardContent>
    </Card>
);

// Modal de Detalhes do Log
const LogDetailsModal = ({ log, open, onOpenChange }) => {
    if (!log) return null;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copiado!");
    };

    // Extrai dados do payload JSON
    const payload = log.payloadJson || {};

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg border">
                            <ActionIcon action={log.action} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900">Detalhes do Evento</DialogTitle>
                            <DialogDescription className="font-mono text-xs text-gray-500 mt-1">
                                ID: {log.id}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* Coluna 1: Informações Principais */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Resumo
                        </h4>
                        <div className="grid gap-3 text-sm">
                            <div className="grid grid-cols-3 items-center">
                                <span className="text-muted-foreground">Descrição:</span>
                                <span className="col-span-2 font-medium text-gray-800 text-xs leading-tight">
                                    {log.description}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 items-center">
                                <span className="text-muted-foreground">Tipo:</span>
                                <span className="col-span-2"><ActionBadge action={log.action} category={log.category} /></span>
                            </div>
                            <div className="grid grid-cols-3 items-center">
                                <span className="text-muted-foreground">Data:</span>
                                <span className="col-span-2 text-gray-800">
                                    {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Coluna 2: Origem e Dispositivo */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <Globe className="h-4 w-4" /> Origem Técnica
                        </h4>
                        <div className="grid gap-3 text-sm">
                             <div className="grid grid-cols-3 items-center">
                                <span className="text-muted-foreground">IP:</span>
                                <div className="col-span-2 flex items-center gap-2">
                                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-700">
                                        {log.ip || 'N/A'}
                                    </code>
                                    {log.ip && (
                                        <Copy className="h-3 w-3 text-gray-400 cursor-pointer hover:text-blue-600" onClick={() => copyToClipboard(log.ip)} />
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 items-center">
                                <span className="text-muted-foreground">Agente:</span>
                                <span className="col-span-2 flex items-center gap-1.5 text-gray-800 text-xs truncate" title={log.userAgent}>
                                    <Laptop className="h-3 w-3 text-gray-400" /> 
                                    {log.userAgent ? (log.userAgent.length > 20 ? log.userAgent.substring(0, 20) + '...' : log.userAgent) : 'Sistema'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Separator />

                {/* Seção Ator (Quem fez) */}
                <div className="py-2">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                {log.actorKind === 'SYSTEM' ? 'SYS' : 'U'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{log.actorName}</p>
                                <p className="text-xs text-muted-foreground">{log.actorKind}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* JSON Técnico */}
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payload (Dados Brutos)</h4>
                    <div className="bg-slate-950 text-slate-50 p-3 rounded-lg overflow-x-auto max-h-40">
                        <pre className="text-xs font-mono">
                            {JSON.stringify(payload, null, 2)}
                        </pre>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


// --- PÁGINA PRINCIPAL ---

export default function AdminAuditPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados de Filtro e Paginação
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [actionFilter, setActionFilter] = useState("all");
    const [search, setSearch] = useState("");

    // Estado do Modal
    const [selectedLog, setSelectedLog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Função de busca na API
    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            // Constrói a query string
            const params = {
                page,
                limit: 15,
                search: search || undefined, // Envia undefined se vazio
                action: actionFilter !== 'all' ? actionFilter : undefined
            };

            const { data } = await api.get('/audit', { params });
            
            setLogs(data.data); // A API retorna { data: [...], totalPages, ... }
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Erro ao buscar logs:", error);
        } finally {
            setLoading(false);
        }
    }, [page, search, actionFilter]);

    // Efeito para buscar logs quando filtros mudam
    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleViewDetails = (log) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    const headerLeftContent = (
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Auditoria e Segurança</h1>
            <p className="text-sm text-muted-foreground">Monitoramento de eventos e integridade do sistema.</p>
        </div>
    );

    return (
        <>
            <Header 
                leftContent={headerLeftContent} 
                actionButtonText={null}
            />

            <main className="flex-1 p-6 space-y-8">
                
                {/* 1. Stats Cards (Estáticos por enquanto, mas representativos) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AuditStatCard 
                        title="Monitoramento" 
                        value="Ativo" 
                        icon={Server}
                        colorClass="text-emerald-600"
                        bgClass="bg-emerald-50"
                    />
                    <AuditStatCard 
                        title="Eventos de Segurança" 
                        value={logs.filter(l => l.category === 'security').length} 
                        icon={ShieldAlert}
                        colorClass="text-blue-600"
                        bgClass="bg-blue-50"
                    />
                    <AuditStatCard 
                        title="Ações Administrativas" 
                        value={logs.filter(l => l.action === 'SETTINGS_CHANGED').length} 
                        icon={Key}
                        colorClass="text-indigo-600"
                        bgClass="bg-indigo-50"
                    />
                </div>

                {/* 2. Container Principal da Tabela */}
                <div className="space-y-4">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-1 w-full md:w-auto gap-3">
                            {/* Busca desabilitada temporariamente se a API não suportar busca por texto ainda, ou mantida se suportar */}
                            {/* <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Pesquisar..." 
                                    className="pl-9 bg-white border-gray-200" 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div> */}
                            
                            <Select value={actionFilter} onValueChange={(val) => { setActionFilter(val); setPage(1); }}>
                                <SelectTrigger className="w-[200px] bg-white">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Filter className="h-3.5 w-3.5" />
                                        <SelectValue placeholder="Filtrar Evento" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Eventos</SelectItem>
                                    <SelectItem value="LOGIN_SUCCESS">Login Sucesso</SelectItem>
                                    <SelectItem value="LOGIN_FAILED">Login Falha</SelectItem>
                                    <SelectItem value="SIGNED">Documento Assinado</SelectItem>
                                    <SelectItem value="SETTINGS_CHANGED">Config. Alterada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <Button variant="outline" className="bg-white text-gray-700 border-gray-200 hover:bg-gray-50" onClick={fetchLogs}>
                             Atualizar
                        </Button>
                    </div>

                    {/* Tabela */}
                    <Card className="bg-white shadow-sm rounded-xl border overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead className="w-[50px] text-center">#</TableHead>
                                        <TableHead className="w-[300px]">Evento</TableHead>
                                        <TableHead>Ator</TableHead>
                                        <TableHead>IP</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead className="text-right w-[80px]">Detalhes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell colSpan={7}><Skeleton className="h-12 w-full" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : logs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Search className="h-8 w-8 opacity-20" />
                                                    <p>Nenhum registro encontrado.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        logs.map((log) => (
                                            <TableRow key={log.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <TableCell className="text-center">
                                                    <div className="flex justify-center">
                                                        <ActionIcon action={log.action} />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-gray-800 text-sm">
                                                            {log.description}
                                                        </span>
                                                        <span className="text-xs text-gray-400 font-mono">
                                                            {log.id.split('-')[0]}...
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                                            {log.actorName ? log.actorName.charAt(0).toUpperCase() : '?'}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]" title={log.actorName}>
                                                                {log.actorName}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400">{log.actorKind}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded w-fit">
                                                        {log.ip || 'System'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <ActionBadge action={log.action} category={log.category} />
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-500 font-medium">
                                                    {format(new Date(log.createdAt), "dd/MM HH:mm", { locale: ptBR })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => handleViewDetails(log)}
                                                        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        
                        {/* Paginação */}
                        <CardFooter className="flex items-center justify-between p-4 border-t bg-gray-50/50">
                            <p className="text-xs text-muted-foreground">
                                Página <span className="font-medium text-gray-900">{page}</span> de {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 text-xs" 
                                    disabled={page <= 1 || loading}
                                    onClick={() => setPage(prev => prev - 1)}
                                >
                                    Anterior
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 text-xs" 
                                    disabled={page >= totalPages || loading}
                                    onClick={() => setPage(prev => prev + 1)}
                                >
                                    Próximo
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </main>

            {/* Injeção do Modal */}
            <LogDetailsModal 
                log={selectedLog} 
                open={isModalOpen} 
                onOpenChange={setIsModalOpen} 
            />
        </>
    );
}