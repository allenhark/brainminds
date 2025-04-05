import * as React from "react"
import { cn } from "../../lib/utils"

export type ToastVariant = "default" | "destructive" | "success"

interface ToastProps {
    title?: string
    description?: string
    variant?: ToastVariant
    duration?: number
    onClose?: () => void
}

interface ToastContextType {
    toast: (props: ToastProps) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([])

    const toast = React.useCallback((props: ToastProps) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prevToasts) => [...prevToasts, { ...props, id }])

        // Auto dismiss
        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
            props.onClose?.()
        }, props.duration || 3000)
    }, [])

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={cn(
                            "pointer-events-auto flex w-full max-w-md rounded-lg shadow-lg ring-1 p-4",
                            t.variant === "destructive"
                                ? "bg-red-50 text-red-900 ring-red-300"
                                : t.variant === "success"
                                    ? "bg-green-50 text-green-900 ring-green-300"
                                    : "bg-white text-gray-900 ring-gray-200"
                        )}
                    >
                        <div className="flex-1">
                            {t.title && <h3 className="font-medium">{t.title}</h3>}
                            {t.description && <p className="text-sm opacity-90 mt-1">{t.description}</p>}
                        </div>
                        <button
                            className="ml-4 text-gray-400 hover:text-gray-500"
                            onClick={() => {
                                setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== t.id))
                                t.onClose?.()
                            }}
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = React.useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}

export const toast = {
    default: (props: Omit<ToastProps, "variant">) => {
        const { toast } = useToast()
        toast({ ...props, variant: "default" })
    },
    destructive: (props: Omit<ToastProps, "variant">) => {
        const { toast } = useToast()
        toast({ ...props, variant: "destructive" })
    },
    success: (props: Omit<ToastProps, "variant">) => {
        const { toast } = useToast()
        toast({ ...props, variant: "success" })
    }
} 