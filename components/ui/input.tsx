import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    // If no id is provided, but we have a label, generate one to link them
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="relative group w-full">
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 peer",
            error && "border-destructive ring-destructive",
            className
          )}
          placeholder={label || "Input"}
          ref={ref}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm transition-all duration-200 pointer-events-none bg-transparent px-1",
              "peer-focus:-top-3 peer-focus:text-xs peer-focus:text-primary",
              "peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-muted-foreground",
              error && "peer-focus:text-destructive peer-not-placeholder-shown:text-destructive"
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <span className="text-xs text-destructive mt-1 ml-1">{error}</span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
