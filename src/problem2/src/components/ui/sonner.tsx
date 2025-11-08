"use client"

import { Toaster as SonnerToaster, type ToasterProps } from 'sonner'

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            'group pointer-events-auto relative flex w-full max-w-md items-start gap-4 rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 pr-11 text-sm text-slate-100 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl transition duration-300 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full data-[state=open]:sm:slide-in-from-bottom-6 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[type=success]:border-emerald-400/40 data-[type=success]:shadow-emerald-500/20 data-[type=error]:border-rose-400/40 data-[type=error]:shadow-rose-500/25 data-[type=warning]:border-amber-400/40 data-[type=warning]:shadow-amber-500/25',
          title: 'text-sm font-semibold text-white',
          description: 'text-xs text-slate-400',
          icon:
            'mt-0.5 text-cyan-300 data-[type=success]:text-emerald-300 data-[type=error]:text-rose-300 data-[type=warning]:text-amber-300',
          actionButton:
            'rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 px-4 py-1 text-xs font-semibold text-slate-950 shadow shadow-cyan-500/30 transition hover:from-cyan-300 hover:via-blue-400 hover:to-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
          cancelButton:
            'rounded-full border border-white/10 px-4 py-1 text-xs font-medium text-slate-300 transition hover:border-white/30 hover:text-white',
          closeButton:
            'absolute right-3 top-3 text-slate-500 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
        },
      }}
      {...props}
    />
  )
}

