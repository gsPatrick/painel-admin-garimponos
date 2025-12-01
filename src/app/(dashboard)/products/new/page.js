"use client";

import { useState } from "react";
import { ProductForm } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import AppService from "@/services/app.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleCreate = async (data) => {
        setIsSaving(true);
        try {
            await AppService.createProduct(data);
            toast.success("Produto criado com sucesso!");
            router.push("/products");
        } catch (error) {
            console.error("Error creating product:", error);
            toast.error("Erro ao criar produto.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/products">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Novo Produto</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/products">
                        <Button variant="outline" disabled={isSaving}>Descartar</Button>
                    </Link>
                    <Button type="submit" form="product-form" disabled={isSaving}>
                        {isSaving ? "Salvando..." : <><Save className="mr-2 h-4 w-4" /> Salvar Produto</>}
                    </Button>
                </div>
            </div>

            <ProductForm onSubmit={handleCreate} />
        </div>
    );
}
