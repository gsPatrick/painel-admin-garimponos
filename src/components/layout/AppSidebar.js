"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet for Mobile Drawer
import useAuth from "@/hooks/useAuth";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  Truck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers,
  BarChart3,
  Box,
  Tag,
  Menu,
  Shield
} from "lucide-react";

// Menu Groups
const menuGroups = [
  {
    title: "Analytics",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/" },
      { title: "Relatórios", icon: BarChart3, href: "/reports" }, // Placeholder
    ]
  },
  {
    title: "Gestão",
    items: [
      { title: "Produtos", icon: Package, href: "/products" },
      { title: "Categorias", icon: Layers, href: "/categories" },
      { title: "Pedidos", icon: ShoppingBag, href: "/orders" },
      { title: "Clientes", icon: Users, href: "/customers" },
      { title: "Marketing", icon: Tag, href: "/marketing/coupons" },
    ]
  },
  {
    title: "Configuração",
    items: [
      { title: "Frete", icon: Truck, href: "/shipping" },
      { title: "Perfis de Acesso", icon: Shield, href: "/settings/roles" },
      { title: "Ajustes", icon: Settings, href: "/settings" },
    ]
  }
];

import { useTheme } from "@/contexts/ThemeContext";

// ... (imports)

import { usePermission } from "@/hooks/usePermission";

// ... (imports)

export function AppSidebar({ isCollapsed, setIsCollapsed }) {
  // Removed local state: const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { can } = usePermission(); // Use the hook
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    // Resize logic moved to AppLayout
  }, []);

  if (!mounted) return null;

  // Define permissions for each route
  const getPermissionForRoute = (href) => {
    if (href === '/') return 'dashboard:read';
    if (href.startsWith('/products')) return 'products:read';
    if (href.startsWith('/categories')) return 'products:read'; // Categories usually grouped with products or have their own
    if (href.startsWith('/orders')) return 'orders:read';
    if (href.startsWith('/customers')) return 'customers:read';
    if (href.startsWith('/marketing')) return 'coupons:read';
    if (href.startsWith('/shipping')) return 'shipping:read';
    if (href.startsWith('/settings/roles')) return 'roles:read';
    if (href.startsWith('/settings')) return 'settings:read';
    return null; // Public or no specific permission required
  };

  // Filter menu groups
  const filteredMenuGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      const requiredPermission = getPermissionForRoute(item.href);
      return !requiredPermission || can(requiredPermission.split(':')[0], 'read');
    })
  })).filter(group => group.items.length > 0);

  // Sidebar Content Component to reuse in Desktop and Mobile
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header / Logo */}
      <div className={cn("h-20 flex items-center px-6 border-b border-border/40", isCollapsed && "px-4 justify-center")}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-primary/10 p-2 rounded-xl text-primary shrink-0">
            {theme.logoUrl ? (
              <img src={theme.logoUrl} alt="Logo" className="size-6 object-contain" />
            ) : (
              <Box className="size-6" style={{ color: theme.primaryColor }} />
            )}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in duration-300">
              <span className="font-bold text-lg leading-none tracking-tight">{theme.storeName}</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase mt-1">Enterprise</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-thin scrollbar-thumb-border">
        {filteredMenuGroups.map((group, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-3 px-2">
                {group.title}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                const activeColor = theme?.secondaryColor || "#3b82f6";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      isCollapsed && "justify-center px-2"
                    )}
                    style={isActive ? { color: activeColor, backgroundColor: `${activeColor}1A` } : {}}
                  >
                    {isActive && !isCollapsed && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                        style={{ backgroundColor: activeColor }}
                      />
                    )}
                    <item.icon
                      className={cn("size-5 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}
                      style={isActive ? { color: activeColor } : {}}
                    />
                    {!isCollapsed && <span>{item.title}</span>}

                    {/* Tooltip for collapsed state could go here */}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-border/40 bg-muted/20">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-background hover:shadow-sm border border-transparent hover:border-border cursor-pointer",
          isCollapsed && "justify-center p-0 hover:bg-transparent hover:shadow-none hover:border-transparent"
        )}>
          <Avatar className="size-9 border border-border">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user?.name?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@loja.com'}</p>
            </div>
          )}

          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={logout}
            >
              <LogOut className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-0 z-40 h-screen bg-background border-r border-border transition-all duration-300 flex-col",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <SidebarContent />

        {/* Collapse Toggle (Desktop only visually, but functional) */}
        <div className="absolute -right-3 top-24 hidden lg:flex">
          <Button
            variant="outline"
            size="icon"
            className="size-6 rounded-full shadow-md bg-background border-border hover:bg-muted"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
          </Button>
        </div>
      </aside>
    </>
  );
}