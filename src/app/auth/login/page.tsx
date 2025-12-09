"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { login } from "@/services/Auth";
import { useForm } from "react-hook-form";
import { Credentials, CredentialsSchema } from "@/Types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/Stores/Auth";

export default function LoginPage () {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm<Credentials>({
        resolver: zodResolver(CredentialsSchema),
        defaultValues: {username: "", password: ""},
    });
    const {setUser} = useAuthStore();

    const rawRedirect = useSearchParams().get("redirect");

    const redirect = useMemo(() => {
        if (!rawRedirect) return "/";
        const trimmed = rawRedirect.trim();
        if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return "/";
        try {
            if (decodeURIComponent(trimmed).match(/^(javascript|data|vbscript):/i)) return "/";
        } catch {
            return "/";
        }

        return trimmed;
    }, [rawRedirect]);

    form.watch(() => {
        setError(null);
    });

    const onSubmit = (credentials: Credentials) => {
        setIsLoading(true);
        login(credentials).then(user => {
            form.reset();
            setUser(user);
            router.push(redirect);
        }).catch(err => {
            if (err instanceof Error && err.message === "BAD_CREDENTIALS") {
                setError("Nom d'utilisateur ou mot de passe incorrect");
            } else {
                setError("Une erreur s'est produite. Veuillez réessayer.");
            }
        }).finally(() => {
            setIsLoading(false);
        });
    };
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="space-y-4 flex flex-col items-center">
                    <div className="flex justify-center">
                        <Image
                            src="/logo.png"
                            alt="ENI Logo"
                            width={120}
                            height={120}
                            priority
                            className="object-contain"
                        />
                    </div>
                    <div className="text-center space-y-2">
                        <CardTitle className="text-2xl font-bold">Bienvenue</CardTitle>
                        <CardDescription>
                            Système de gestion de présence - ENI
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-2 my-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="flex items-center gap-2">
                                            Nom d'utilisateur
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Votre nom d'utilisateur"
                                                   value={field.value}
                                                   onChange={field.onChange}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="flex items-center gap-2">
                                            Mot de passe
                                        </FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        value={field.value}
                                                        placeholder="Entrez votre mot de passe"
                                                        onChange={field.onChange}
                                                        disabled={isLoading}
                                                        autoComplete="current-password"
                                                        className="pr-10 transition-all"/>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                            <div className="flex flex-row justify-end gap-2 mt-2 ">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            Connexion en cours...
                                        </>
                                    ) : (
                                        "Se connecter"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>École Nationale d&apos;Informatique</p>
                        <p className="text-xs mt-1">© 2025 ENI - Tous droits réservés</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

