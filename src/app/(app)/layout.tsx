import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import NavBar from "@/components/NavBar";


export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");



  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pt-20 relative bg-slate-50">
      {/* Global Technical Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      {/* Floating Glass Navbar */}
      <NavBar />

      <main className="px-4 pt-8 md:pt-0 max-w-6xl mx-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
