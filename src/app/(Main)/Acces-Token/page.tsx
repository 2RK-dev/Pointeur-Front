// @/app/dashboard/tokens/page.tsx
"use client";

import { useEffect, useState } from "react";
import { CreateTokenDialog } from "./UI/create-token-dialog";
import { TokenList } from "./UI/token-list";
import { ApiToken } from "@/Types/token";
import {deleteToken, getAllTokens} from "@/services/token";
import {notifications} from "@/components/notifications";

export default function TokensPage() {
    const [tokens, setTokens] = useState<ApiToken[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllTokens().then((data) => {
            setTokens(data);
            setLoading(false);
            notifications.success("Tokens chargés", "Vos tokens d'accès API ont été chargés avec succès.");
        }).catch(() => {
            setLoading(false);
            notifications.error("Erreur de chargement", "Impossible de charger les tokens d'accès API.");
        })
    }, []);

    const handleTokenCreated = (data: ApiToken) => {
        setTokens([data, ...tokens]);
    };

    const handleDelete = (id: string) => {
        deleteToken(id).then(() => {
            setTokens(tokens.filter((token) => token.id !== id));
            notifications.success("Token supprimé", "Le token d'accès API a été supprimé avec succès.");
        }).catch(() => {
            notifications.error("Erreur de suppression", "Impossible de supprimer le token d'accès API.");
        })
    };

    return (
        <div className="container mx-auto py-10 space-y-8 max-w-5xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Tokens d'accès API</h2>
                    <p className="text-muted-foreground">
                        Gérez vos clés API personnelles. Ne partagez jamais ces clés publiquement.
                    </p>
                </div>
                <CreateTokenDialog onTokenCreated={handleTokenCreated} />
            </div>

            <TokenList
                tokens={tokens}
                isLoading={loading}
                onDelete={handleDelete}
            />
        </div>
    );
}