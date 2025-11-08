import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-slate-950',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-500/40 hover:from-cyan-300 hover:via-blue-400 hover:to-indigo-400',
        secondary:
          'bg-slate-900/70 border border-slate-700 text-slate-100 hover:bg-slate-900 hover:border-slate-600',
        outline:
          'border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-900/40',
        ghost:
          'text-slate-300 hover:bg-slate-900/60 hover:text-slate-100',
        destructive:
          'bg-red-500 text-white hover:bg-red-400 focus-visible:ring-red-500',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-7 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }

