"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Filter, ArrowUpDown, Download, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import AppService from "@/services/app.service";
import { toast } from "sonner";

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [subcategoryFilter, setSubcategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [performanceFilter, setPerformanceFilter] = useState("all");

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [productsData, categoriesData] = await Promise.all([
                    AppService.getProducts(),
                    AppService.getCategories()
                ]);
                setProducts(productsData || []);
                setCategories(categoriesData || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Erro ao carregar dados.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Derived state for subcategories based on selected category
    const availableSubcategories = categoryFilter !== "all"
        ? categories.filter(c => c.parentId === categoryFilter)
        : [];

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));

        // Check if category matches (handling both ID and object if populated)
        const productCategoryId = typeof product.category === 'object' ? product.category?.id : product.category;
        // Also check if product.categoryId exists (common in sequelize)
        const finalProductId = product.categoryId || productCategoryId;

        const matchesCategory = categoryFilter === "all" || finalProductId == categoryFilter;

        const matchesStatus = statusFilter === "all" || product.status === statusFilter;

        // Mock Performance Logic (can be updated with real analytics later)
        let matchesPerformance = true;
        if (performanceFilter === "best_sellers") matchesPerformance = product.stock < 50;
        if (performanceFilter === "low_stock") matchesPerformance = product.stock < 20;
        if (performanceFilter === "no_stock") matchesPerformance = product.stock === 0;

        return matchesSearch && matchesCategory && matchesStatus && matchesPerformance;
    });

    const rootCategories = categories.filter(c => !c.parentId);

    const getCategoryName = (product) => {
        if (product.Category) return product.Category.name;
        if (product.category && typeof product.category === 'object') return product.category.name;
        // If it's an ID, find it in categories list
        const cat = categories.find(c => c.id === product.categoryId || c.id === product.category);
        return cat ? cat.name : "Sem Categoria";
    };

    const getProductImage = (product) => {
        if (product.images && product.images.length > 0) return product.images[0];
        if (product.image) return product.image;
        return "https://placehold.co/100?text=No+Image";
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
                    <p className="text-muted-foreground">Gerencie seu catálogo, estoque e preços.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Exportar
                    </Button>
                    <Link href="/products/new">
                        <Button className="shadow-md">
                            <Plus className="mr-2 h-4 w-4" /> Novo Produto
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle>Filtros Avançados</CardTitle>
                    <CardDescription>Refine sua busca para encontrar produtos específicos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2 relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome, SKU..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <Select value={categoryFilter} onValueChange={(val) => {
                            setCategoryFilter(val);
                            setSubcategoryFilter("all"); // Reset subcategory when category changes
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Categorias</SelectItem>
                                {rootCategories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Subcategory Filter (Conditional) */}
                        <Select
                            value={subcategoryFilter}
                            onValueChange={setSubcategoryFilter}
                            disabled={categoryFilter === "all" || availableSubcategories.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Subcategoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Subcategorias</SelectItem>
                                {availableSubcategories.map(sub => (
                                    <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* More Filters Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    <span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Mais Filtros</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Status</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                                    {statusFilter === "all" && "✓ "} Todos
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                                    {statusFilter === "active" && "✓ "} Ativos
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                                    {statusFilter === "draft" && "✓ "} Rascunhos
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuLabel>Desempenho & Estoque</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setPerformanceFilter("all")}>
                                    {performanceFilter === "all" && "✓ "} Todos
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setPerformanceFilter("best_sellers")}>
                                    {performanceFilter === "best_sellers" && "✓ "} Mais Vendidos
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setPerformanceFilter("low_stock")}>
                                    {performanceFilter === "low_stock" && "✓ "} Baixo Estoque
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setPerformanceFilter("no_stock")}>
                                    {performanceFilter === "no_stock" && "✓ "} Sem Estoque
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Active Filters Badges */}
                    {(categoryFilter !== "all" || statusFilter !== "all" || performanceFilter !== "all") && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                            <span className="text-sm text-muted-foreground self-center mr-2">Filtros ativos:</span>
                            {categoryFilter !== "all" && (
                                <Badge variant="secondary" className="gap-1">
                                    Cat: {rootCategories.find(c => c.id == categoryFilter)?.name}
                                    <button onClick={() => setCategoryFilter("all")} className="ml-1 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                                </Badge>
                            )}
                            {statusFilter !== "all" && (
                                <Badge variant="secondary" className="gap-1">
                                    Status: {statusFilter === "active" ? "Ativo" : "Rascunho"}
                                    <button onClick={() => setStatusFilter("all")} className="ml-1 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                                </Badge>
                            )}
                            {performanceFilter !== "all" && (
                                <Badge variant="secondary" className="gap-1">
                                    Filtro: {performanceFilter}
                                    <button onClick={() => setPerformanceFilter("all")} className="ml-1 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                                </Badge>
                            )}
                            <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-destructive" onClick={() => {
                                setCategoryFilter("all");
                                setStatusFilter("all");
                                setPerformanceFilter("all");
                            }}>
                                Limpar Todos
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="border rounded-md bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="w-[80px]">Imagem</TableHead>
                            <TableHead className="w-[300px]">Produto</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Estoque</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Filter className="h-8 w-8 opacity-20" />
                                        <p>Nenhum produto encontrado com os filtros atuais.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id} className="group">
                                    <TableCell>
                                        <div className="h-12 w-12 rounded-md bg-muted overflow-hidden border">
                                            <img src={getProductImage(product)} alt={product.name} className="h-full w-full object-cover" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{product.name}</span>
                                            <span className="text-xs text-muted-foreground">{product.sku || 'N/A'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{getCategoryName(product)}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        R$ {Number(product.price).toFixed(2).replace('.', ',')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {product.stock === 0 ? (
                                                <Badge variant="destructive" className="text-[10px]">Esgotado</Badge>
                                            ) : product.stock < 20 ? (
                                                <span className="text-amber-600 font-medium flex items-center gap-1">
                                                    {product.stock} <span className="text-[10px] uppercase text-muted-foreground">Baixo</span>
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">{product.stock} un.</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={product.status === 'active' ? 'default' : 'secondary'}
                                            className={product.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                                        >
                                            {product.status === 'active' ? 'Ativo' : 'Rascunho'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="sr-only">Abrir menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <Link href={`/products/${product.id}`}>
                                                    <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="text-xs text-muted-foreground text-center">
                Mostrando {filteredProducts.length} de {products.length} produtos
            </div>
        </div>
    );
}
