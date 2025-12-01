"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import AppService from "@/services/app.service";
import { toast } from "sonner";

export function OrderStatusListModal({ status, open, onOpenChange }) {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open && status) {
            const fetchOrders = async () => {
                setIsLoading(true);
                try {
                    const allOrders = await AppService.getOrders();
                    // Filter orders based on status
                    // Mapping status text to API status values if needed
                    // Assuming API returns 'completed', 'pending', 'processing', 'cancelled'

                    const filtered = (allOrders || []).filter(o =>
                        status === 'Concluídos' ? o.status === 'completed' :
                            status === 'Pendentes' ? o.status === 'pending' :
                                status === 'Processando' ? o.status === 'processing' :
                                    status === 'Cancelados' ? o.status === 'cancelled' : true
                    );
                    setOrders(filtered);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                    toast.error("Erro ao carregar pedidos.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchOrders();
        }
    }, [open, status]);

    if (!status) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        Pedidos: <span className="text-primary">{status}</span>
                    </DialogTitle>
                    <DialogDescription>
                        Lista de todos os pedidos com este status.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-4">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : orders.length > 0 ? (
                        orders.map(order => (
                            <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                                <div>
                                    <p className="font-medium text-sm">#{order.id} - {order.User?.name || 'Cliente'}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-sm">R$ {Number(order.total).toFixed(2).replace('.', ',')}</span>
                                    <Link href={`/orders/${order.id}`}>
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                            <ArrowRight className="size-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhum pedido encontrado com este status.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
