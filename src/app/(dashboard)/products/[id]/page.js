"use client";

import { useState, useEffect } from "react";
import { ProductForm } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import AppService from "@/services/app.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditProductPage({ params }) {
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                if (params.id === 'new') {
                    // Redirect 'new' to the dedicated new page if somehow reached here, 
                    // or just handle it. But we have a separate page.
                    router.replace('/products/new');
                } else {
                    const data = await AppService.getProductById(params.id);
                    if (data) {
                        setProduct(data);
                    } else {
                        toast.error("Produto não encontrado.");
                        router.push('/products');
                    }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Erro ao carregar produto.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [params.id, router]);

    const handleUpdate = async (data) => {
        setIsSaving(true);
        try {
            await AppService.updateProduct(params.id, data);
            toast.success("Produto atualizado com sucesso!");
            router.push("/products");
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Erro ao atualizar produto.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product && params.id !== 'new') return null;

    return (
        <div className="space-y-6 pb-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/products">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {product.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Editando produto #{product.id}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/products">
                        <Button variant="outline" disabled={isSaving}>Descartar</Button>
                    </Link>
                    <Button type="submit" form="product-form" disabled={isSaving}>
                        {isSaving ? "Salvando..." : <><Save className="mr-2 h-4 w-4" /> Salvar Alterações</>}
                    </Button>
                </div>
            </div>

            <ProductForm initialData={product} onSubmit={handleUpdate} />
        </div>
    );
}
