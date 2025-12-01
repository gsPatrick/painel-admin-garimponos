"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Plus, Trash2, GripVertical, Image as ImageIcon, Box, Truck, Tag, Info, Layers, Palette, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";
import AppService from "@/services/app.service";
import { CategoryCreateModal } from "./CategoryCreateModal";
import { toast } from "sonner";

export function ProductForm({ initialData, onSubmit }) {
    const [hasVariations, setHasVariations] = useState(initialData?.variations || false);

    // Variations State
    const [sizeOptions, setSizeOptions] = useState([{ name: "Tamanho", values: [] }]);
    const [colorOptions, setColorOptions] = useState([{ name: "Cor", values: [] }]);
    const [generalOptions, setGeneralOptions] = useState([]);

    // Category State
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(initialData?.category || "");
    const [selectedSubcategory, setSelectedSubcategory] = useState(initialData?.subcategory || "");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await AppService.getCategories();
                setCategories(data || []);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                toast.error("Erro ao carregar categorias.");
            }
        };
        fetchCategories();
    }, []);

    const { register, handleSubmit, control, watch, setValue } = useForm({
        defaultValues: initialData || {
            status: "active",
            stock: 0,
            price: "",
            comparePrice: "",
            cost: "",
            sku: "",
            barcode: "",
            weight: "",
            height: "",
            width: "",
            length: "",
            isPhysical: true
        }
    });

    // --- VARIATIONS LOGIC ---

    const handleAddValue = (type, index, value) => {
        if (!value) return;
        let setter, current;
        if (type === 'size') { setter = setSizeOptions; current = [...sizeOptions]; }
        else if (type === 'color') { setter = setColorOptions; current = [...colorOptions]; }
        else { setter = setGeneralOptions; current = [...generalOptions]; }

        if (!current[index].values.includes(value)) {
            current[index].values.push(value);
            setter(current);
        }
    };

    const handleRemoveValue = (type, index, value) => {
        let setter, current;
        if (type === 'size') { setter = setSizeOptions; current = [...sizeOptions]; }
        else if (type === 'color') { setter = setColorOptions; current = [...colorOptions]; }
        else { setter = setGeneralOptions; current = [...generalOptions]; }

        current[index].values = current[index].values.filter(v => v !== value);
        setter(current);
    };

    // Cartesian Product Generator
    const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

    const generateMatrix = () => {
        const allOptions = [...sizeOptions, ...colorOptions, ...generalOptions].filter(opt => opt.values.length > 0);

        if (allOptions.length === 0) return [];

        if (allOptions.length === 1) {
            return allOptions[0].values.map(v => ({
                name: v,
                sku: `${watch('sku') || 'SKU'}-${v.toUpperCase().slice(0, 3)}`,
                price: watch('price') || 0,
                stock: 0
            }));
        }

        const arraysToCombine = allOptions.map(opt => opt.values);
        const combinations = cartesian(...arraysToCombine);

        return combinations.map(combo => ({
            name: combo.join(" / "),
            sku: `${watch('sku') || 'SKU'}-${combo.map(c => c.toUpperCase().slice(0, 2)).join('-')}`,
            price: watch('price') || 0,
            stock: 0
        }));
    };

    const matrix = generateMatrix();

    // --- CATEGORY LOGIC ---

    const [modalMode, setModalMode] = useState("category"); // 'category' or 'subcategory'

    const rootCategories = categories.filter(c => !c.parentId);
    const subCategories = selectedCategory ? categories.filter(c => c.parentId === selectedCategory) : [];

    const handleCreateCategory = (newCategory) => {
        setCategories([...categories, newCategory]);
        if (!newCategory.parentId) {
            setSelectedCategory(newCategory.id);
            setSelectedSubcategory("");
        } else {
            setSelectedSubcategory(newCategory.id);
        }
    };

    const openCategoryModal = (mode) => {
        setModalMode(mode);
        setIsCategoryModalOpen(true);
    };

    const internalSubmit = (data) => {
        const mergedData = {
            ...data,
            category: selectedCategory,
            subcategory: selectedSubcategory,
            hasVariations,
            variations: hasVariations ? {
                sizeOptions,
                colorOptions,
                generalOptions,
                matrix
            } : null
        };
        if (onSubmit) {
            onSubmit(mergedData);
        }
    };

    return (
        <form id="product-form" onSubmit={handleSubmit(internalSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            {/* Main Column (Left) */}
            <div className="lg:col-span-2 space-y-8">

                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informações Básicas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Título</Label>
                            <Input placeholder="Ex: Camiseta Algodão Premium" {...register("name")} />
                        </div>
                        <div className="space-y-2">
                            <Label>Descrição</Label>
                            <Textarea placeholder="Descreva o produto..." className="min-h-[150px]" {...register("description")} />
                        </div>
                    </CardContent>
                </Card>

                {/* Media */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mídia</CardTitle>
                        <CardDescription>Adicione fotos e vídeos do produto.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                            <div className="p-4 rounded-full bg-primary/10 mb-4">
                                <Upload className="size-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg">Clique para upload ou arraste</h3>
                            <p className="text-sm text-muted-foreground mt-1">Suporta JPG, PNG e MP4.</p>
                        </div>
                        {/* Mock Gallery Grid */}
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="relative aspect-square rounded-lg border overflow-hidden group">
                                    <img src={`https://picsum.photos/seed/${i}/200/200`} alt="Preview" className="object-cover w-full h-full" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button size="icon" variant="destructive" className="h-8 w-8"><Trash2 className="size-4" /></Button>
                                    </div>
                                    {i === 1 && <Badge className="absolute top-2 left-2">Principal</Badge>}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing & Stock (Simple) */}
                {!hasVariations && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Preços & Estoque</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Preço de Venda</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
                                        <Input className="pl-9" placeholder="0,00" {...register("price")} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Preço &quot;De&quot;</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
                                        <Input className="pl-9" placeholder="0,00" {...register("comparePrice")} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Custo (CMV)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
                                        <Input className="pl-9" placeholder="0,00" {...register("cost")} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>SKU</Label>
                                    <Input placeholder="Ex: CAM-001" {...register("sku")} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Código de Barras (EAN)</Label>
                                    <Input placeholder="GTIN/EAN" {...register("barcode")} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Quantidade em Estoque</Label>
                                <Input type="number" className="w-1/3" {...register("stock")} />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Variations (Complex) */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle>Variações</CardTitle>
                            <CardDescription>Gerencie tamanhos, cores e outras opções.</CardDescription>
                        </div>
                        <Switch checked={hasVariations} onCheckedChange={setHasVariations} />
                    </CardHeader>
                    {hasVariations && (
                        <CardContent className="space-y-6 pt-6">

                            <Tabs defaultValue="sizes" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 mb-4">
                                    <TabsTrigger value="sizes" className="gap-2"><Ruler className="size-4" /> Tamanhos</TabsTrigger>
                                    <TabsTrigger value="colors" className="gap-2"><Palette className="size-4" /> Cores</TabsTrigger>
                                    <TabsTrigger value="general" className="gap-2"><Layers className="size-4" /> Geral</TabsTrigger>
                                </TabsList>

                                {/* Sizes Tab */}
                                <TabsContent value="sizes" className="space-y-4">
                                    {sizeOptions.map((opt, idx) => (
                                        <div key={idx} className="p-4 border rounded-xl space-y-4 bg-muted/10">
                                            <Label>Opções de Tamanho</Label>
                                            <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                                                {opt.values.map(val => (
                                                    <Badge key={val} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-2 bg-background border shadow-sm">
                                                        {val}
                                                        <button type="button" onClick={() => handleRemoveValue('size', idx, val)} className="hover:text-destructive transition-colors"><Trash2 className="size-3" /></button>
                                                    </Badge>
                                                ))}
                                            </div>
                                            <Input
                                                placeholder="Digite e aperte Enter (Ex: P, M, G, 42...)"
                                                className="bg-background"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddValue('size', idx, e.currentTarget.value);
                                                        e.currentTarget.value = '';
                                                    }
                                                }}
                                            />
                                        </div>
                                    ))}
                                </TabsContent>

                                {/* Colors Tab */}
                                <TabsContent value="colors" className="space-y-4">
                                    {colorOptions.map((opt, idx) => (
                                        <div key={idx} className="p-4 border rounded-xl space-y-4 bg-muted/10">
                                            <Label>Opções de Cor</Label>
                                            <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                                                {opt.values.map(val => (
                                                    <Badge key={val} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-2 bg-background border shadow-sm">
                                                        <div className="size-3 rounded-full border" style={{ backgroundColor: val.toLowerCase() }}></div>
                                                        {val}
                                                        <button type="button" onClick={() => handleRemoveValue('color', idx, val)} className="hover:text-destructive transition-colors"><Trash2 className="size-3" /></button>
                                                    </Badge>
                                                ))}
                                            </div>
                                            <Input
                                                placeholder="Digite e aperte Enter (Ex: Azul, Vermelho...)"
                                                className="bg-background"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddValue('color', idx, e.currentTarget.value);
                                                        e.currentTarget.value = '';
                                                    }
                                                }}
                                            />
                                        </div>
                                    ))}
                                </TabsContent>

                                {/* General Tab */}
                                <TabsContent value="general" className="space-y-4">
                                    {generalOptions.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>Nenhuma variação geral adicionada.</p>
                                            <Button variant="outline" size="sm" className="mt-2" onClick={() => setGeneralOptions([...generalOptions, { name: "Material", values: [] }])}>
                                                Adicionar Variação
                                            </Button>
                                        </div>
                                    )}
                                    {generalOptions.map((opt, idx) => (
                                        <div key={idx} className="p-4 border rounded-xl space-y-4 bg-muted/10 relative group">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                                onClick={() => {
                                                    const newOpts = generalOptions.filter((_, i) => i !== idx);
                                                    setGeneralOptions(newOpts);
                                                }}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                            <div className="space-y-2">
                                                <Label>Nome da Opção</Label>
                                                <Input
                                                    value={opt.name}
                                                    onChange={(e) => {
                                                        const newOpts = [...generalOptions];
                                                        newOpts[idx].name = e.target.value;
                                                        setGeneralOptions(newOpts);
                                                    }}
                                                    className="bg-background"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Valores</Label>
                                                <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                                                    {opt.values.map(val => (
                                                        <Badge key={val} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-2 bg-background border shadow-sm">
                                                            {val}
                                                            <button type="button" onClick={() => handleRemoveValue('general', idx, val)} className="hover:text-destructive transition-colors"><Trash2 className="size-3" /></button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <Input
                                                    placeholder="Digite e aperte Enter..."
                                                    className="bg-background"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleAddValue('general', idx, e.currentTarget.value);
                                                            e.currentTarget.value = '';
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {generalOptions.length > 0 && (
                                        <Button variant="outline" onClick={() => setGeneralOptions([...generalOptions, { name: "", values: [] }])}>
                                            <Plus className="size-4 mr-2" /> Adicionar outra
                                        </Button>
                                    )}
                                </TabsContent>
                            </Tabs>

                            {/* Matrix Table */}
                            {matrix.length > 0 && (
                                <div className="border rounded-xl overflow-hidden mt-6">
                                    <div className="bg-muted/30 p-3 border-b flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">{matrix.length} variantes geradas</span>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Variante</TableHead>
                                                <TableHead>Preço</TableHead>
                                                <TableHead>SKU</TableHead>
                                                <TableHead>Estoque</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {matrix.map((row, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-8 rounded bg-muted flex items-center justify-center">
                                                                <ImageIcon className="size-4 text-muted-foreground" />
                                                            </div>
                                                            {row.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="relative">
                                                            <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">R$</span>
                                                            <Input className="h-8 w-24 pl-6" defaultValue={row.price} />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input className="h-8 w-32" defaultValue={row.sku} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input className="h-8 w-20" type="number" defaultValue={row.stock} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    )}
                </Card>

            </div>

            {/* Sidebar (Right) */}
            <div className="space-y-8">

                {/* Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select defaultValue="active">
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="draft">Rascunho</SelectItem>
                                <SelectItem value="archived">Arquivado</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="space-y-2 pt-2">
                            <Label className="text-xs uppercase text-muted-foreground font-bold">Canais de Venda</Label>
                            <div className="flex items-center gap-2">
                                <Switch id="online-store" defaultChecked />
                                <Label htmlFor="online-store">Loja Online</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch id="google" />
                                <Label htmlFor="google">Google Shopping</Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Organization */}
                <Card>
                    <CardHeader>
                        <CardTitle>Organização</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Category Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Categoria Principal</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary"
                                    onClick={() => openCategoryModal("category")}
                                >
                                    <Plus className="size-3" />
                                </Button>
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="z-50">
                                    {rootCategories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-primary font-medium h-8 px-2 text-xs"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            openCategoryModal("category");
                                        }}
                                    >
                                        <Plus className="size-3 mr-2" /> Criar nova categoria
                                    </Button>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Subcategory Field (Visible only if category selected) */}
                        {selectedCategory && (
                            <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                                <div className="flex items-center justify-between">
                                    <Label>Subcategoria</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary"
                                        onClick={() => openCategoryModal("subcategory")}
                                    >
                                        <Plus className="size-3" />
                                    </Button>
                                </div>
                                <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent className="z-50">
                                        {subCategories.length === 0 ? (
                                            <div className="p-2 text-xs text-muted-foreground text-center">Nenhuma subcategoria</div>
                                        ) : (
                                            subCategories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))
                                        )}
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-primary font-medium h-8 px-2 text-xs"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                openCategoryModal("subcategory");
                                            }}
                                        >
                                            <Plus className="size-3 mr-2" /> Criar nova subcategoria
                                        </Button>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Tags</Label>
                            <Input placeholder="Ex: Verão, Promoção" />
                            <p className="text-xs text-muted-foreground">Separe por vírgula.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Shipping */}
                <Card>
                    <CardHeader>
                        <CardTitle>Frete</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Switch id="physical" defaultChecked />
                            <Label htmlFor="physical">Este é um produto físico</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Peso (kg)</Label>
                                <Input placeholder="0.0" />
                            </div>
                            <div className="space-y-2">
                                <Label>Altura (cm)</Label>
                                <Input placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <Label>Largura (cm)</Label>
                                <Input placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <Label>Comp. (cm)</Label>
                                <Input placeholder="0" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Brechó Integration (Read-Only) */}
                {initialData?.brechoId && (
                    <Card className="bg-muted/30 border-dashed">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Box className="size-4" /> Integração Brechó
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">ID Original:</span>
                                <span className="font-mono font-medium">{initialData.brechoId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tag:</span>
                                <span className="font-mono font-medium">TAG-1020</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Sincronizado:</span>
                                <span className="text-emerald-600 font-medium flex items-center gap-1"><Info className="size-3" /> Hoje, 10:00</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

            </div>

            <CategoryCreateModal
                open={isCategoryModalOpen}
                onOpenChange={setIsCategoryModalOpen}
                onCreate={handleCreateCategory}
                categories={categories}
                mode={modalMode}
                defaultParentId={selectedCategory}
            />
        </form>
    );
}
