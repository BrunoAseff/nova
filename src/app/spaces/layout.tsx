import { SpaceSidebar } from "@/components/sidebar/SpaceSidebar";

import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <SpaceSidebar />
      <main className="m-0 p-0">{children}</main>
    </SidebarProvider>
  );
}
