"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const RESOURCES = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Produtos' },
    { id: 'orders', label: 'Pedidos' },
    { id: 'customers', label: 'Clientes' },
    { id: 'coupons', label: 'Cupons' },
    { id: 'shipping', label: 'Frete' },
    { id: 'settings', label: 'Configurações' },
    { id: 'roles', label: 'Perfis de Acesso' },
];

const ACTIONS = [
    { id: 'read', label: 'Visualizar' },
    { id: 'create', label: 'Criar' },
    { id: 'update', label: 'Editar' },
    { id: 'delete', label: 'Excluir' },
];

export function RoleForm({ initialData, onSubmit, isLoading }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
        }
    });

    const [permissions, setPermissions] = useState(new Set(initialData?.permissions || []));

    const togglePermission = (resource, action) => {
        const permission = `${resource}:${action}`;
        const newPermissions = new Set(permissions);
        if (newPermissions.has(permission)) {
            newPermissions.delete(permission);
        } else {
            newPermissions.add(permission);
        }
        setPermissions(newPermissions);
    };

    const toggleResource = (resource) => {
        const allActions = ACTIONS.map(a => `${resource}:${a.id}`);
        const hasAll = allActions.every(p => permissions.has(p));

        const newPermissions = new Set(permissions);
        if (hasAll) {
            allActions.forEach(p => newPermissions.delete(p));
        } else {
            allActions.forEach(p => newPermissions.add(p));
        }
        setPermissions(newPermissions);
    };

    const onFormSubmit = (data) => {
        onSubmit({
            ...data,
            permissions: Array.from(permissions),
        });
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome do Perfil</Label>
                    <Input
                        id="name"
                        placeholder="Ex: Gerente de Vendas"
                        {...register("name", { required: "Nome é obrigatório" })}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                        id="description"
                        placeholder="Descreva as responsabilidades deste perfil..."
                        {...register("description")}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Permissões de Acesso</CardTitle>
                    <p className="text-sm text-muted-foreground">Defina o que este perfil pode ver e fazer no sistema.</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {RESOURCES.map((resource) => (
                            <div key={resource.id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                                    <label
                                        htmlFor={`res-${resource.id}`}
                                        className="font-semibold cursor-pointer flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={`res-${resource.id}`}
                                            checked={ACTIONS.every(a => permissions.has(`${resource.id}:${a.id}`))}
                                            onCheckedChange={() => toggleResource(resource.id)}
                                        />
                                        {resource.label}
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {ACTIONS.map((action) => (
                                        <div key={action.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`${resource.id}-${action.id}`}
                                                checked={permissions.has(`${resource.id}:${action.id}`)}
                                                onCheckedChange={() => togglePermission(resource.id, action.id)}
                                            />
                                            <label
                                                htmlFor={`${resource.id}-${action.id}`}
                                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {action.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Salvar Perfil
                </Button>
            </div>
        </form>
    );
}
