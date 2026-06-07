import html2pdf from 'html2pdf.js';
import {notifications} from "@/components/notifications";

export const generatePDF = (title:string) => {
    const element = document.getElementById("edt-content");
    if (!element) return;

    const opt = {
        margin:       10,
        filename:     title,
        image:        { type: 'png' as const, quality: 1 },
        html2canvas:  {scale: 2, useCORS: true,},
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' as const },
        pagebreak:    {mode: ['avoid-all', 'css', 'legacy']},
    };

    const promise = html2pdf().set(opt).from(element).save().then(()=>{
        notifications.success("PDF généré avec succès !");
        }
    ).catch((error) => {
        console.error("Erreur lors de la génération du PDF:", error);
        notifications.error("Erreur lors de la génération du PDF.");
    })
    notifications.promise(promise,{
        loading: "Génération du PDF en cours...",
        success: "PDF généré avec succès !",
        error: "Erreur lors de la génération du PDF."
    })
};