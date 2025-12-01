"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, FolderTree, Layers, Image as ImageIcon } from "lucide-react";
import AppService from "@/services/app.service";
import { CategoryCreateModal } from "@/components/products/CategoryCreateModal";
import { CategoryProductsModal } from "@/components/products/CategoryProductsModal";
import { toast } from "sonner";

export default function CategoriesPage() {
    const [activeTab, setActiveTab] = useState("categories");
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State for Product Quick View Modal
    const [selectedCategoryForView, setSelectedCategoryForView] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const data = await AppService.getCategories();
            setCategories(data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Erro ao carregar categorias.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Filter categories based on tab and search
    const rootCategories = categories.filter(c => !c.parentId);
    const subCategories = categories.filter(c => c.parentId);

    const filteredRoots = rootCategories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredSubs = subCategories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCreate = () => {
        fetchCategories(); // Reload list after creation
    };

    const handleCategoryClick = (category) => {
        setSelectedCategoryForView(category);
        setIsProductModalOpen(true);
    };

    const getParentName = (parentId) => {
        const parent = categories.find(c => c.id === parentId);
        return parent ? parent.name : "Desconhecida";
    };

    const CategoryCard = ({ category, isSub = false }) => (
        <Card
            className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-muted/60 cursor-pointer"
            onClick={() => handleCategoryClick(category)}
        >
            <div className="aspect-[16/9] w-full bg-muted relative overflow-hidden">
                {category.image ? (
                    <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 bg-muted/50">
                        <ImageIcon className="h-10 w-10 mb-2" />
                        <span className="text-xs font-medium uppercase tracking-wider">Sem Imagem</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm backdrop-blur-sm">
                                <MoreHorizontal className="h-4 w-4 text-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {isSub && (
                    <Badge variant="secondary" className="absolute top-2 left-2 bg-white/90 hover:bg-white text-xs backdrop-blur-sm shadow-sm">
                        {getParentName(category.parentId)}
                    </Badge>
                )}
            </div>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h3 className="font-semibold text-lg leading-none tracking-tight mb-1">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.productsCount || 0} produtos</p>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0">
                        Ativo
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
                    <p className="text-muted-foreground">Gerencie a organização visual da sua loja.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} size="lg" className="shadow-md">
                    <Plus className="mr-2 h-5 w-5" />
                    {activeTab === "categories" ? "Nova Categoria" : "Nova Subcategoria"}
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar categorias..."
                        className="pl-9 bg-muted/40 border-muted-foreground/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab} className="w-auto">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="categories" className="px-6">Principais</TabsTrigger>
                        <TabsTrigger value="subcategories" className="px-6">Subcategorias</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsContent value="categories" className="mt-0">
                        {filteredRoots.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/10">
                                <FolderTree className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium">Nenhuma categoria encontrada</h3>
                                <p className="text-muted-foreground max-w-sm mt-1">
                                    Tente buscar por outro termo ou crie uma nova categoria.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredRoots.map((cat) => (
                                    <CategoryCard key={cat.id} category={cat} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="subcategories" className="mt-0">
                        {filteredSubs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/10">
                                <Layers className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium">Nenhuma subcategoria encontrada</h3>
                                <p className="text-muted-foreground max-w-sm mt-1">
                                    Subcategorias ajudam a organizar melhor seus produtos dentro das categorias principais.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredSubs.map((cat) => (
                                    <CategoryCard key={cat.id} category={cat} isSub={true} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            )}

            <CategoryCreateModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onCreate={handleCreate}
                categories={categories}
                mode={activeTab === "categories" ? "category" : "subcategory"}
            />

            <CategoryProductsModal
                open={isProductModalOpen}
                onOpenChange={setIsProductModalOpen}
                category={selectedCategoryForView}
            />
        </div>
    );
}
