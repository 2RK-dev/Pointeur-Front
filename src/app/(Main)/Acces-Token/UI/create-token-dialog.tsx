"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Check, Terminal, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {createTokenSchema, CreateTokenFormValues, ApiToken} from "@/Types/token";
import {createNewTokens} from "@/services/token";
import {notifications} from "@/components/notifications";

interface createTokenDialogProps {
    onTokenCreated: (data: ApiToken) => void;
}

export function CreateTokenDialog({ onTokenCreated }: createTokenDialogProps) {
    const [open, setOpen] = useState(false);
    const [generatedToken, setGeneratedToken] = useState<string | null>(null);
    const [hasCopied, setHasCopied] = useState(false);

    const form = useForm<CreateTokenFormValues>({
        resolver: zodResolver(createTokenSchema),
        defaultValues: { name: "" },
    });

    const onSubmit = async (input: CreateTokenFormValues) => {
        createNewTokens(input.name).then((data)=>{
            const { token, ...tokenData } = data;
            setGeneratedToken(token);
            onTokenCreated(tokenData);
            notifications.success("Token créé", "Votre token d'accès API a été généré avec succès.");
        }).catch(()=>{
            notifications.error("Erreur de création", "Impossible de générer le token d'accès API.");
        })
    };

    const copyToClipboard = () => {
        if (generatedToken) {
            navigator.clipboard.writeText(generatedToken).then(() => {
                setHasCopied(true);
                setTimeout(() => setHasCopied(false), 2000);
                notifications.success('Token copié', 'Le token d\'accès API a été copié dans votre presse-papiers.');
            }).catch(()=>{
                notifications.error('Erreur de copie', 'Impossible de copier le token d\'accès API.');
            })
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setTimeout(() => {
                setGeneratedToken(null);
                form.reset();
            }, 300);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nouveau Token
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Générer un token d'accès</DialogTitle>
                    <DialogDescription>
                        Ce token permettra à des applications tierces d'accéder à votre compte.
                    </DialogDescription>
                </DialogHeader>

                {!generatedToken ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom du token</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ex: Intégration CI/CD" {...field} />
                                        </FormControl>
                                        <FormDescription>Donnez un nom descriptif pour identifier ce token plus tard.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Annuler</Button>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Générer le token
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                ) : (
                    <div className="space-y-4 py-2">
                        <Alert className="bg-green-50 text-green-900 border-green-200">
                            <Terminal className="h-4 w-4 text-green-600" />
                            <AlertTitle>Token généré avec succès !</AlertTitle>
                            <AlertDescription>
                                Copiez ce token maintenant. Pour des raisons de sécurité, il ne sera plus jamais affiché.
                            </AlertDescription>
                        </Alert>

                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Input readOnly value={generatedToken} className="font-mono text-sm bg-muted" />
                            </div>
                            <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
                                {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>

                        <DialogFooter>
                            <Button onClick={() => handleOpenChange(false)} className="w-full sm:w-auto">J'ai copié le token</Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}