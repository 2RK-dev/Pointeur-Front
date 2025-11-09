"use client"

import {AlertCircle, CheckCircle2, X} from "lucide-react"
import {useState} from "react"
import {Badge} from "@/components/ui/badge"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Button} from "@/components/ui/button"
import {FailedItem, SuccessItem} from "@/Types/glob";


interface TranspositionResultBadgesProps {
    successItems: SuccessItem[]
    failedItems: FailedItem[]
    isClosing: boolean
    onClose: () => void
}

export function TranspositionResultBadges({
                                              successItems,
                                              failedItems,
                                              isClosing,
                                              onClose
                                          }: TranspositionResultBadgesProps) {
    const [successOpen, setSuccessOpen] = useState(false)
    const [failedOpen, setFailedOpen] = useState(false)

    if (successItems.length === 0 && failedItems.length === 0) return null

    return (
        <div
            className={`fixed top-6 right-6 z-50 flex items-center gap-2 bg-background/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border transition-transform duration-300 ease-in-out ${
                isClosing ? "translate-x-[200%]" : "translate-x-0"
            }`}
        >
            {successItems.length > 0 && (
                <Popover open={successOpen} onOpenChange={setSuccessOpen}>
                    <PopoverTrigger asChild>
                        <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-green-50 border-green-200 text-green-700 gap-1.5"
                        >
                            <CheckCircle2 className="h-3.5 w-3.5"/>
                            {successItems.length} réussi{successItems.length > 1 ? "s" : ""}
                        </Badge>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">Items ajoutés avec succès</h4>
                                <Button variant="ghost" size="icon" className="h-6 w-6"
                                        onClick={() => setSuccessOpen(false)}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-1.5">
                                {successItems.map((item, index) => (
                                    <div key={index}
                                         className="text-xs p-2 rounded bg-muted/30 border-l-2 border-green-500">
                                        <pre className="font-mono overflow-x-auto">{JSON.stringify(item, null, 2)}</pre>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            )}

            {failedItems.length > 0 && (
                <Popover open={failedOpen} onOpenChange={setFailedOpen}>
                    <PopoverTrigger asChild>
                        <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-orange-50 border-orange-200 text-orange-700 gap-1.5"
                        >
                            <AlertCircle className="h-3.5 w-3.5"/>
                            {failedItems.length} échec{failedItems.length > 1 ? "s" : ""}
                        </Badge>
                    </PopoverTrigger>
                    <PopoverContent className="w-96" align="end">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">Items échoués</h4>
                                <Button variant="ghost" size="icon" className="h-6 w-6"
                                        onClick={() => setFailedOpen(false)}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {failedItems.map((failed, index) => (
                                    <div key={index} className="space-y-1">
                                        <p className="text-sm font-medium text-orange-700">{failed.reason}</p>
                                        <details className="text-xs">
                                            <summary
                                                className="cursor-pointer text-muted-foreground hover:text-foreground">
                                                Voir les détails
                                            </summary>
                                            <pre
                                                className="mt-1 p-2 rounded bg-muted/30 font-mono overflow-x-auto border-l-2 border-orange-500">
                        {JSON.stringify(failed.item, null, 2)}
                      </pre>
                                        </details>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            )}

            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
                <X className="h-4 w-4"/>
            </Button>

        </div>
    )
}
