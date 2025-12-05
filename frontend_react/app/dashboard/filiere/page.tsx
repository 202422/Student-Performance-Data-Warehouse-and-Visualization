"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardFiliereLayout from "@/components/dashboard-filiere-layout";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardFilierePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("user_role") || "";
    setUserRole(role);
    if (!token) {
      router.replace("/auth/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (userRole !== "admin") {
    return <div className="flex items-center justify-center min-h-screen bg-background text-red-500 text-xl font-bold">Accès non autorisé</div>;
  }

  return <DashboardFiliereLayout />;
}
