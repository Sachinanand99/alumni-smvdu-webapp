import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Sheet = DialogPrimitive.Root

const SheetTrigger = DialogPrimitive.Trigger

const SheetClose = DialogPrimitive.Close

const SheetPortal = ({ className, ...props }: DialogPrimitive.DialogPortalProps) => (
    <DialogPrimitive.Portal className={cn(className)} {...props} />
)
SheetPortal.displayName = DialogPrimitive.Portal.displayName

const SheetOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn("fixed inset-0 bg-black/50 z-50", className)}
        {...props}
    />
))
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName

const SheetContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: "top" | "bottom" | "left" | "right"
}
>(({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
        <SheetOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed z-50 flex flex-col bg-white p-6 shadow-lg transition ease-in-out duration-300",
                {
                    "inset-y-0 left-0 w-3/4 sm:max-w-sm": side === "left",
                    "inset-y-0 right-0 w-3/4 sm:max-w-sm": side === "right",
                    "inset-x-0 top-0 h-1/2": side === "top",
                    "inset-x-0 bottom-0 h-1/2": side === "bottom",
                },
                className
            )}
            {...props}
        >
            {children}
            <SheetClose className="absolute top-4 right-4 text-gray-500 hover:text-black">
                <X className="h-5 w-5" />
            </SheetClose>
        </DialogPrimitive.Content>
    </SheetPortal>
))
SheetContent.displayName = DialogPrimitive.Content.displayName

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("mb-4", className)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold", className)}
        {...props}
    />
))
SheetTitle.displayName = DialogPrimitive.Title.displayName

export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
}
