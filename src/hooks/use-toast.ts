
import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

export function toast(props: ToastProps) {
  sonnerToast(props.title, {
    description: props.description,
    action: props.action,
    className: props.variant === "destructive" ? "destructive" : undefined,
  });
}

export function useToast() {
  return {
    toast,
  };
}
