import html2pdf from 'html2pdf.js';
import {notifications} from "@/components/notifications";

export const generatePDF = (
    filename: string,
    options?: {
        title?: string;
        subtitle?: string;
        week?: string;
    }
) => {
    const element = document.getElementById("edt-content");
    if (!element) return;

    const clone = element.cloneNode(true) as HTMLElement;

    const header = document.createElement("div");
    header.style.marginBottom = "25px";
    header.style.paddingBottom = "15px";
    header.style.borderBottom = "2px solid #e2e8f0";
    header.style.fontFamily = "system-ui, -apple-system, sans-serif";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "flex-end";

    // Left block: Title & Subtitle/Target
    const leftBlock = document.createElement("div");
    
    const mainTitle = document.createElement("h1");
    mainTitle.innerText = options?.title || "Emploi du Temps";
    mainTitle.style.margin = "0";
    mainTitle.style.fontSize = "24px";
    mainTitle.style.fontWeight = "800";
    mainTitle.style.color = "#1e1b4b";
    leftBlock.appendChild(mainTitle);

    if (options?.subtitle) {
        const sub = document.createElement("p");
        sub.innerText = options.subtitle;
        sub.style.margin = "4px 0 0 0";
        sub.style.fontSize = "14px";
        sub.style.fontWeight = "600";
        sub.style.color = "#4f46e5";
        leftBlock.appendChild(sub);
    }
    header.appendChild(leftBlock);

    const rightBlock = document.createElement("div");
    rightBlock.style.textAlign = "right";

    if (options?.week) {
        const weekInfo = document.createElement("p");
        weekInfo.innerText = `Semaine : ${options.week}`;
        weekInfo.style.margin = "0";
        weekInfo.style.fontSize = "13px";
        weekInfo.style.fontWeight = "700";
        weekInfo.style.color = "#334155";
        rightBlock.appendChild(weekInfo);
    }

    const genDate = document.createElement("p");
    const now = new Date();
    genDate.innerText = `Généré le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}`;
    genDate.style.margin = "4px 0 0 0";
    genDate.style.fontSize = "11px";
    genDate.style.color = "#94a3b8";
    rightBlock.appendChild(genDate);
    header.appendChild(rightBlock);

    clone.insertBefore(header, clone.firstChild);

    clone.style.padding = "10px";
    clone.style.backgroundColor = "#ffffff";
    clone.style.color = "#000000";

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "100%";
    container.appendChild(clone);
    document.body.appendChild(container);

    const opt = {
        margin:       10,
        filename:     filename,
        image:        { type: 'png' as const, quality: 1 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' as const },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] },
    };

    const promise = html2pdf().set(opt).from(clone).save().then(() => {
        document.body.removeChild(container);
    }).catch((error) => {
        document.body.removeChild(container);
        console.error("Erreur lors de la génération du PDF:", error);
    });

    notifications.promise(promise, {
        loading: "Génération du PDF en cours...",
        success: "PDF généré avec succès !",
        error: "Erreur lors de la génération du PDF."
    });
};