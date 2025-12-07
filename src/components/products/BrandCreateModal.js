"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppService from "@/services/app.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function BrandCreateModal({ open, onOpenChange, onCreate, onUpdate, initialData }) {
    const [name, setName] = useState("");
    const [logo, setLogo] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setLogo(initialData.logo || "");
        } else {
            setName("");
            setLogo("");
        }
    }, [initialData, open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            if (initialData) {
                const updatedBrand = await AppService.updateBrand(initialData.id, { name, logo });
                toast.success("Marca atualizada com sucesso!");
                if (onUpdate) onUpdate(updatedBrand);
            } else {
                const newBrand = await AppService.createBrand({ name, logo });
                toast.success("Marca criada com sucesso!");
                if (onCreate) onCreate(newBrand);
            }
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to create brand:", error);
            toast.error("Erro ao criar marca.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initialData ? "Editar Marca" : "Nova Marca"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="brand-name">Nome da Marca</Label>
                        <Input
                            id="brand-name"
                            placeholder="Ex: Nike, Zara..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="brand-logo">URL do Logo</Label>
                        <Input
                            id="brand-logo"
                            placeholder="https://..."
                            value={logo}
                            onChange={(e) => setLogo(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : (initialData ? "Salvar Alterações" : "Criar Marca")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
