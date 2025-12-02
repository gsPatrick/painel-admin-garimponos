"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import AppService from "@/services/app.service";
import { RoleForm } from "@/components/settings/RoleForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewRolePage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: AppService.createRole,
        onSuccess: () => {
            queryClient.invalidateQueries(["roles"]);
            toast.success("Perfil criado com sucesso");
            router.push("/settings/roles");
        },
        onError: (error) => {
            toast.error("Erro ao criar perfil: " + (error.response?.data?.error || error.message));
        }
    });

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/settings/roles">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="size-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Novo Perfil</h2>
                    <p className="text-muted-foreground">Crie um novo perfil de acesso personalizado.</p>
                </div>
            </div>

            <RoleForm
                onSubmit={createMutation.mutate}
                isLoading={createMutation.isPending}
            />
        </div>
    );
}
