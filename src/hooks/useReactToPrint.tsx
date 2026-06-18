import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { notifications } from "@/components/notifications";

// Étape 1 : On crée un composant enveloppe pour y injecter tes options (Titre, semaine, etc.)
// Ce composant contiendra le Header + la copie propre de la grille
interface PrintContainerProps {
    options?: { title?: string; subtitle?: string; week?: string };
    children: React.ReactNode;
}

export const PrintTemplate = ({ options, children }: PrintContainerProps) => {
    const now = new Date();

    return (
        <div className="p-8 bg-white text-black font-sans w-full">
            <div className={"flex justify-between items-end border-b-2 border-slate-200 pb-4 mb-6 isPrinting printing-template"}>
                <div>
                    <h1 className="text-2xl font-black text-indigo-950 m-0">
                        {options?.title || "Emploi du Temps"}
                    </h1>
                    {options?.subtitle && (
                        <p className="text-sm font-semibold text-indigo-600 mt-1 m-0">
                            {options.subtitle}
                        </p>
                    )}
                </div>
                <div className="text-right">
                    {options?.week && (
                        <p className="text-sm font-bold text-slate-700 m-0">
                            Semaine : {options.week}
                        </p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-1 m-0">
                        Généré le {now.toLocaleDateString('fr-FR')} à {now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                    </p>
                </div>
            </div>

            <div className="w-full">
                {children}
            </div>
        </div>
    );
};