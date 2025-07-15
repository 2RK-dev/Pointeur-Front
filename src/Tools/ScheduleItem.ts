export const generateHours = () => {
    const hours = []
    for (let i = 7; i <= 18; i++) {
        hours.push(`${i.toString().padStart(2, "0")}:00`)
        if (i < 18) {
            hours.push(`${i.toString().padStart(2, "0")}:30`)
        }
    }
    return hours
}