
"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2, Key } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ApiToken } from "@/Types/token";

interface TokenListProps {
    tokens: ApiToken[];
    isLoading: boolean;
    onDelete: (id: string) => void;
}

export function TokenList({ tokens, isLoading, onDelete }: TokenListProps) {
    const [tokenToDelete, setTokenToDelete] = useState<string | null>(null);

    if (isLoading) {
        return <div className="text-center py-10 text-muted-foreground">Chargement des tokens...</div>;
    }

    if (tokens.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg text-center">
                <div className="bg-muted p-4 rounded-full mb-4">
                    <Key className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Aucun token d'accès</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-4">
                    Vous n'avez pas encore créé de tokens. Générez-en un pour accéder à l'API.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Nom</TableHead>
                            <TableHead>Préfixe</TableHead>
                            <TableHead>Créé</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tokens.map((token) => (
                            <TableRow key={token.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Key className="h-4 w-4 text-muted-foreground" />
                                        {token.name}
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-xs bg-muted/50 p-2 rounded w-fit">
                                    {token.prefix.toLowerCase()}••••••••
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {formatDistanceToNow(token.createdAt, { addSuffix: true, locale: fr })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => setTokenToDelete(token.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!tokenToDelete} onOpenChange={() => setTokenToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Toute application utilisant ce token perdra immédiatement l'accès.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => {
                                if(tokenToDelete) onDelete(tokenToDelete);
                                setTokenToDelete(null);
                            }}
                        >
                            Révoquer le token
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}