"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppService from "@/services/app.service";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Shield } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function RolesPage() {
    const queryClient = useQueryClient();
    const [roleToDelete, setRoleToDelete] = useState(null);

    const { data: roles, isLoading } = useQuery({
        queryKey: ["roles"],
        queryFn: AppService.getRoles,
    });

    const deleteMutation = useMutation({
        mutationFn: AppService.deleteRole,
        onSuccess: () => {
            queryClient.invalidateQueries(["roles"]);
            toast.success("Perfil excluído com sucesso");
            setRoleToDelete(null);
        },
        onError: (error) => {
            toast.error("Erro ao excluir perfil: " + (error.response?.data?.error || error.message));
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Perfis de Acesso</h2>
                    <p className="text-muted-foreground">Gerencie os níveis de acesso e permissões dos usuários.</p>
                </div>
                <Link href="/settings/roles/new">
                    <Button className="gap-2">
                        <Plus className="size-4" />
                        Novo Perfil
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-10">Carregando...</TableCell>
                            </TableRow>
                        ) : roles?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                                    Nenhum perfil encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            roles?.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Shield className="size-4 text-primary" />
                                        {role.name}
                                    </TableCell>
                                    <TableCell>{role.description || "-"}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/settings/roles/${role.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="size-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => setRoleToDelete(role)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!roleToDelete} onOpenChange={() => setRoleToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Perfil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o perfil <strong>{roleToDelete?.name}</strong>?
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteMutation.mutate(roleToDelete.id)}
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
