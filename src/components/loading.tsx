'use client'

import { Loader2 } from 'lucide-react'

export function LoadingComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="mt-4 text-lg font-medium text-muted-foreground">Chargement des données...</p>
    </div>
  )
}