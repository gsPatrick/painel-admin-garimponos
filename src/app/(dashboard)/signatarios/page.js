// src/app/(dashboard)/signatories/page.js
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';

// Importação dos componentes de UI
import Header from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Star, Trash2 } from "lucide-react";

// Importa o modal reutilizável de formulário de contato
import Modal_ContactForm from '@/app/send/_components/Modal_ContactForm'; 

/**
 * Página para gerenciamento de Contatos (Signatários salvos).
 */
export default function SignatoriesPage() {
    // Estado para controlar a aba ativa (todos, favoritos, inativos)
    const [activeTab, setActiveTab] = useState('todos');
    // Estado para armazenar a lista completa de contatos vinda da API
    const [allContacts, setAllContacts] = useState([]);
    // Estado para controlar a exibição do skeleton de carregamento
    const [loading, setLoading] = useState(true);
    
    // Estado para gerenciar os IDs dos contatos selecionados na tabela
    const [selectedContacts, setSelectedContacts] = useState([]);
    
    // Estado para controlar o modal de criação/edição
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null); // Guarda o contato em edição

    /**
     * Função centralizada para buscar/recarregar a lista de contatos da API.
     */
    const fetchContacts = async () => {
        // Mostra o skeleton de carregamento apenas na primeira busca
        if (allContacts.length === 0) setLoading(true); 
        try {
            const { data } = await api.get('/contacts');
            setAllContacts(data);
        } catch (error) {
            console.error("Erro ao buscar contatos:", error);
            // TODO: Adicionar um feedback de erro mais robusto para o usuário (ex: um Toast)
        } finally {
            setLoading(false);
        }
    };

    // Busca os contatos quando o componente é montado pela primeira vez
    useEffect(() => {
        fetchContacts();
    }, []);

    // `useMemo` recalcula a lista de contatos a ser exibida sempre que a aba ou a lista principal mudam.
    const filteredContacts = useMemo(() => {
        if (!allContacts) return [];
        switch(activeTab) {
            case 'favoritos':
                return allContacts.filter(c => c.isFavorite && c.status === 'ACTIVE');
            case 'inativos':
                return allContacts.filter(c => c.status === 'INACTIVE');
            case 'todos':
            default:
                // A aba "Todos" exibe apenas os contatos ativos
                return allContacts.filter(c => c.status === 'ACTIVE');
        }
    }, [activeTab, allContacts]);

    // --- Funções de Ação ---

    /**
     * Alterna o status de favorito de um contato.
     */
    const handleToggleFavorite = async (contact) => {
        try {
            const updatedContact = await api.patch(`/contacts/${contact.id}`, { isFavorite: !contact.isFavorite });
            // Atualiza o estado local instantaneamente para feedback rápido na UI
            setAllContacts(prev => prev.map(c => c.id === contact.id ? updatedContact.data : c));
        } catch (error) { 
            console.error("Erro ao favoritar:", error); 
            alert("Não foi possível atualizar o favorito.");
        }
    };

    /**
     * Inativa os contatos selecionados em massa.
     */
    const handleInactivate = async () => {
        if (selectedContacts.length === 0) return;

        if (confirm(`Tem certeza que deseja inativar ${selectedContacts.length} signatário(s)? Esta ação pode ser revertida na aba "Inativos".`)) {
            try {
                await api.post('/contacts/inactivate-bulk', { contactIds: selectedContacts });
                fetchContacts(); // Recarrega a lista da API
                setSelectedContacts([]); // Limpa a seleção
            } catch (error) {
                console.error("Erro ao inativar contatos:", error);
                alert("Ocorreu um erro ao inativar os contatos selecionados.");
            }
        }
    };

    /**
     * Lida com o salvamento (criação ou edição) de um contato no modal.
     */
    const handleSaveContact = async (formData) => {
        if (editingContact) {
            await api.patch(`/contacts/${editingContact.id}`, formData);
        } else {
            await api.post('/contacts', formData);
        }
        fetchContacts(); // Recarrega a lista para exibir o novo/editado contato
    };
    
    // --- Funções para controle dos Modais e Seleção ---
    const handleOpenCreateModal = () => {
        setEditingContact(null);
        setIsModalOpen(true);
    };
    const handleOpenEditModal = (contact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };
    const handleSelectContact = (contactId) => {
        setSelectedContacts(prev =>
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };
    const handleSelectAll = () => {
        if (selectedContacts.length === filteredContacts.length) {
            setSelectedContacts([]);
        } else {
            setSelectedContacts(filteredContacts.map(c => c.id));
        }
    };

    const headerLeftContent = <h1 className="text-xl font-semibold text-gray-800">Signatários</h1>;

    return (
        <>
            <Header
                leftContent={headerLeftContent}
                actionButtonText="Enviar Documento"
            />
            <main className="flex-1 p-6 space-y-6">
                <h2 className="text-3xl font-bold text-gray-800">Signatários</h2>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-transparent p-0 h-auto">
                        <TabsTrigger value="todos" className="text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2">Todos</TabsTrigger>
                        <TabsTrigger value="favoritos" className="text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2">Favoritos</TabsTrigger>
                        <TabsTrigger value="inativos" className="text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2">Inativos</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value={activeTab} className="mt-6">
                        <Card className="bg-white shadow-sm rounded-xl border">
                            <CardContent className="p-0">
                                <div className="flex items-center justify-between p-6 border-b">
                                    <Input placeholder="Buscar por nome ou email..." className="max-w-xs bg-white" />
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" onClick={handleOpenCreateModal}>Adicionar signatário</Button>
                                        <Button variant="outline" onClick={handleInactivate} disabled={selectedContacts.length === 0}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Inativar ({selectedContacts.length})
                                        </Button>
                                    </div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]"><Checkbox checked={filteredContacts.length > 0 && selectedContacts.length === filteredContacts.length} onCheckedChange={handleSelectAll} /></TableHead>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Editar</TableHead>
                                            <TableHead>Favorito</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <TableRow key={`skel-${i}`}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                                            ))
                                        ) : filteredContacts.length === 0 ? (
                                            <TableRow><TableCell colSpan={5} className="text-center h-24">Nenhum registro encontrado.</TableCell></TableRow>
                                        ) : (
                                            filteredContacts.map((contact) => (
                                                <TableRow key={contact.id} data-state={selectedContacts.includes(contact.id) && "selected"}>
                                                    <TableCell><Checkbox checked={selectedContacts.includes(contact.id)} onCheckedChange={() => handleSelectContact(contact.id)} /></TableCell>
                                                    <TableCell className="font-medium">{contact.name}</TableCell>
                                                    <TableCell>{contact.email}</TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="sm" onClick={() => handleOpenEditModal(contact)} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                                                            <Edit className="h-4 w-4" /> Editar
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(contact)}>
                                                            <Star className={`h-5 w-5 transition-colors ${contact.isFavorite ? 'fill-yellow-400 text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`} />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardFooter className="justify-between p-4 bg-gray-50/50 rounded-b-xl">
                                <div className="text-sm text-muted-foreground">Total de {filteredContacts.length} registros</div>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            <Modal_ContactForm 
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSave={handleSaveContact}
                existingContact={editingContact}
            />
        </>
    );
}