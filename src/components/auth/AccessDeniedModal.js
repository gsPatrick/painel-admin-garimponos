"use client";

import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ShieldAlert } from "lucide-react";

export function AccessDeniedModal() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleAccessDenied = () => setOpen(true);
        window.addEventListener("access-denied", handleAccessDenied);
        return () => window.removeEventListener("access-denied", handleAccessDenied);
    }, []);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <ShieldAlert className="size-6" />
                        <AlertDialogTitle>Acesso Negado</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription>
                        Você não tem permissão para realizar esta ação. Se você acredita que isso é um erro, entre em contato com o administrador.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setOpen(false)}>Entendi</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
