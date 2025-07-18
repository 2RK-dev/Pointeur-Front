import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";

export const generatePDF = () => {
        const element = document.getElementById("edt-content")
        if (!element) return


        html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png")


            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
            })


            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()


            const margin = 10
            const contentWidth = pageWidth - margin * 2
            const contentHeight = pageHeight - margin * 2


            const imgWidth = canvas.width
            const imgHeight = canvas.height


            const ratio = contentWidth / imgWidth
            const scaledHeight = imgHeight * ratio

            if (scaledHeight <= contentHeight) {
                pdf.addImage(imgData, "PNG", margin, margin, contentWidth, scaledHeight)
            } else {
                let yPosition = 0
                let pageNumber = 1

                while (yPosition < imgHeight) {
                    if (pageNumber > 1) {
                        pdf.addPage()
                    }

                    const sectionHeight = Math.min(contentHeight / ratio, imgHeight - yPosition)

                    const sectionCanvas = document.createElement("canvas")
                    const sectionCtx = sectionCanvas.getContext("2d")

                    sectionCanvas.width = imgWidth
                    sectionCanvas.height = sectionHeight

                    if (sectionCtx) {
                        sectionCtx.drawImage(
                            canvas,
                            0,
                            yPosition,
                            imgWidth,
                            sectionHeight,
                            0,
                            0,
                            imgWidth,
                            sectionHeight,
                        )

                        const sectionImgData = sectionCanvas.toDataURL("image/png")
                        pdf.addImage(sectionImgData, "PNG", margin, margin, contentWidth, sectionHeight * ratio)
                    }

                    yPosition += sectionHeight
                    pageNumber++
                }
            }
            pdf.save("document.pdf")
        })
}