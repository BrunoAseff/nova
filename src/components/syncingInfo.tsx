import { migrateLocalStorageToDatabase } from "@/server/actions/spaces/migrateLocalStorageToDatabase";
import { fetchSpacesData } from "@/server/actions/spaces/spaces";
import { CheckCircle, CircleNotch, XCircle } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SyncingInfo() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<
    "syncing" | "success" | "error" | "idle"
  >("idle");

  useEffect(() => {
    const handleUserVerification = async () => {
      if (!session) return;

      // Check localStorage for migration status
      const migrationStatus = localStorage.getItem("dataMigrationComplete");
      if (migrationStatus === "true") {
        setStatus("idle");
        return;
      }

      setStatus("syncing");
      try {
        const localData = await fetchSpacesData();
        console.log(localData);
        await migrateLocalStorageToDatabase(session?.user?.id ?? "", localData);

        localStorage.setItem("dataMigrationComplete", "true");

        setStatus("success");

        setTimeout(() => setStatus("idle"), 2000);
      } catch (error) {
        console.error("Error syncing data:", error);
        setStatus("error");
      }
    };

    handleUserVerification();
  }, [session?.user.id, session]);

  if (status === "idle") return null;

  return (
    <div
      className={`absolute z-50 flex min-h-screen w-full items-center justify-center backdrop-blur-xl transition-opacity duration-1000 ${
        status === "success" ? "opacity-0" : "opacity-100"
      }`}
    >
      {status === "syncing" && (
        <div className="flex items-center justify-center text-4xl font-light text-white">
          <div className="flex items-center justify-center gap-3">
            <CircleNotch className="animate-spin" size={30} />
            <p>Syncing data</p>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="animate-fade-out flex items-center justify-center text-4xl font-light text-green-300">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle weight="duotone" size={30} />
            <p>Data saved!</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center justify-center text-4xl font-light text-red-400">
          <div className="flex items-center justify-center gap-3">
            <XCircle weight="duotone" size={30} />
            <p>We couldn&apos;t save your data</p>
          </div>
        </div>
      )}
    </div>
  );
}
