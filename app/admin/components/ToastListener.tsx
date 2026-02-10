"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ToastListener() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const saved = searchParams.get("saved");
        const cleared = searchParams.get("cleared");
        const error = searchParams.get("error");

        if (saved === "1") {
            toast.success("Änderungen erfolgreich gespeichert!", {
                position: "top-right",
                autoClose: 3000,
            });
        } else if (cleared === "1") {
            toast.info("Daten erfolgreich gelöscht.", {
                position: "top-right",
                autoClose: 3000,
            });
        } else if (error === "invalid_json") {
            toast.error("Ungültige JSON-Daten.", {
                position: "top-right",
                autoClose: 4000,
            });
        } else if (error === "1") {
            toast.error("Fehler beim Speichern.", {
                position: "top-right",
                autoClose: 4000,
            });
        }

        // Optional: URL bereinigen, damit Toast beim Refresh nicht erneut kommt
        if (saved || cleared || error) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("saved");
            params.delete("cleared");
            params.delete("error");

            const newUrl = params.toString()
                ? `${pathname}?${params.toString()}`
                : pathname;

            router.replace(newUrl, { scroll: false });
        }
    }, [searchParams, pathname, router]);

    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
    );
}
