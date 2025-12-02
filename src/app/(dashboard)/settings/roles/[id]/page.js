"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AppService from "@/services/app.service";
import { RoleForm } from "@/components/settings/RoleForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { use } from "react";

export default function EditRolePage({ params }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const resolvedParams = use(params);
    const roleId = resolvedParams.id;

    const { data: role, isLoading } = useQuery({
        queryKey: ["role", roleId],
        queryFn: () => AppService.getRoleById(roleId),
    });

    const updateMutation = useMutation({
        mutationFn: (data) => AppService.updateRole(roleId, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["roles"]);
            queryClient.invalidateQueries(["role", roleId]);
            toast.success("Perfil atualizado com sucesso");
            router.push("/settings/roles");
        },
        onError: (error) => {
            toast.error("Erro ao atualizar perfil: " + (error.response?.data?.error || error.message));
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/settings/roles">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="size-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Editar Perfil</h2>
                    <p className="text-muted-foreground">Atualize as permissões do perfil {role.name}.</p>
                </div>
            </div>

            <RoleForm
                initialData={role}
                onSubmit={updateMutation.mutate}
                isLoading={updateMutation.isPending}
            />
        </div>
    );
}
