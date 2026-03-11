'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  badge?: number;
  roles?: string[];
  children?: NavItem[];
}

export interface RoleBasedNavShellProps {
  navItems: NavItem[];
  userRole: string;
  userName: string;
  userAvatar?: string;
  children: React.ReactNode;
  onNavigate?: (itemId: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Sidebar item
// ---------------------------------------------------------------------------

function SidebarItem({
  item,
  active,
  collapsed,
  onSelect,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onSelect: (id: string) => void;
}) {
  const Icon = item.icon;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(item.id)}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {/* Active indicator bar */}
      <AnimatePresence>
        {active && (
          <motion.div
            layoutId="nav-active-bar"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-primary"
          />
        )}
      </AnimatePresence>

      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          className="truncate"
        >
          {item.label}
        </motion.span>
      )}
      {!collapsed && item.badge !== undefined && item.badge > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
        >
          {item.badge}
        </motion.span>
      )}
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// User menu dropdown
// ---------------------------------------------------------------------------

function UserMenu({
  userName,
  userAvatar,
  userRole,
}: {
  userName: string;
  userAvatar?: string;
  userRole: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
      >
        {userAvatar ? (
          <img src={userAvatar} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
        )}
        <span className="font-medium text-foreground">{userName}</span>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
          {userRole}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute right-0 top-full z-50 mt-1 w-44 rounded-md border border-border bg-card py-1 shadow-lg"
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              <Settings className="h-3.5 w-3.5" /> Settings
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-muted"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RoleBasedNavShell
// ---------------------------------------------------------------------------

export function RoleBasedNavShell({
  navItems,
  userRole,
  userName,
  userAvatar,
  children,
  onNavigate,
  className,
}: RoleBasedNavShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState(navItems[0]?.id ?? '');

  const visibleItems = React.useMemo(
    () => navItems.filter((item) => !item.roles || item.roles.includes(userRole)),
    [navItems, userRole],
  );

  const breadcrumbs = React.useMemo(() => {
    const active = visibleItems.find((i) => i.id === activeId);
    return active ? [{ label: 'Home' }, { label: active.label }] : [{ label: 'Home' }];
  }, [visibleItems, activeId]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    onNavigate?.(id);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
      {visibleItems.map((item) => (
        <SidebarItem
          key={item.id}
          item={item}
          active={activeId === item.id}
          collapsed={collapsed}
          onSelect={handleSelect}
        />
      ))}
    </nav>
  );

  return (
    <div className={cn('flex h-full min-h-screen bg-background', className)}>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 60 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="hidden flex-col border-r border-border bg-card md:flex"
      >
        <div className="flex items-center justify-between border-b border-border px-3 py-3">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-semibold text-foreground"
            >
              Navigation
            </motion.span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        {sidebarContent}
      </motion.aside>

      {/* Mobile slide-over sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="fixed left-0 top-0 z-50 flex h-full w-[240px] flex-col border-r border-border bg-card md:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-3 py-3">
                <span className="text-sm font-semibold text-foreground">Navigation</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-2.5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1 text-xs text-muted-foreground">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight className="h-3 w-3" />}
                  <span
                    className={cn(
                      i === breadcrumbs.length - 1
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {crumb.label}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>
          <UserMenu userName={userName} userAvatar={userAvatar} userRole={userRole} />
        </header>

        {/* Page content with transition */}
        <main className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

RoleBasedNavShell.displayName = 'RoleBasedNavShell';
