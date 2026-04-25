import { UseToast } from "../Hooks/UseToast";
import { X } from "lucide-react";

export default function Toaster() {
    const { toasts, dismiss } = UseToast();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`relative rounded-lg shadow-lg p-4 border animate-in slide-in-from-right ${toast.variant === "destructive"
                        ? "bg-red-50 border-red-200 text-red-900"
                        : "bg-white border-gray-200 text-gray-900"
                        }`}
                >
                    <button
                        onClick={() => dismiss(toast.id)}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {toast.title && (
                        <div className="font-semibold mb-1 pr-6">{toast.title}</div>
                    )}
                    {toast.description && (
                        <div className="text-sm opacity-90">{toast.description}</div>
                    )}
                </div>
            ))}
        </div>
    );
}