import { migrateLocalStorageToDatabase } from "@/server/actions/spaces/migrateLocalStorageToDatabase";
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
      if (!session?.user?.id) return;

      const migrationStatus = localStorage.getItem("dataMigrationComplete");
      if (migrationStatus === "true") {
        setStatus("idle");
        return;
      }

      const localSpaces = localStorage.getItem("spaces");

      if (!localSpaces) {
        localStorage.setItem("dataMigrationComplete", "true");
        setStatus("idle");
        return;
      }

      setStatus("syncing");
      try {
        const localShortcut = localStorage.getItem("shortcut");
        const localAmbientSound = localStorage.getItem("ambientSound");
        const localReminders = localStorage.getItem("reminderMessages");

        const localData = {
          spaces: JSON.parse(localSpaces),
          shortcut: localShortcut ?? undefined,
          ambientSound: localAmbientSound ?? undefined,
          reminderMessages: localReminders ? JSON.parse(localReminders) : [],
        };

        await migrateLocalStorageToDatabase(session.user.id, localData);

        localStorage.setItem("dataMigrationComplete", "true");

        setStatus("success");

        setTimeout(() => setStatus("idle"), 2000);
      } catch (error) {
        console.error("Error migrating data:", error);
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    };

    handleUserVerification();
  }, [session?.user?.id]);

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
