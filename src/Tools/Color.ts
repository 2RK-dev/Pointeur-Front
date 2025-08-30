import {Group} from "@/Types/Group";

function generateUniqueColorScheme(words: string[]): string {
    const normalizedWords = words
        .map((word) => word.trim().toLowerCase())
        .filter((word) => word.length > 0)
        .sort()

    const combinedString = normalizedWords.join("|")

    let hash = 0
    for (let i = 0; i < combinedString.length; i++) {
        const char = combinedString.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
    }
    const colorSchemes = [
        "bg-sky-100 hover:bg-sky-200",
        "bg-rose-100 hover:bg-rose-200",
        "bg-emerald-100 hover:bg-emerald-200",
        "bg-amber-100 hover:bg-amber-200",
        "bg-indigo-100 hover:bg-indigo-200",
        "bg-pink-100 hover:bg-pink-200",
        "bg-lime-100 hover:bg-lime-200",
        "bg-teal-100 hover:bg-teal-200",
        "bg-cyan-100 hover:bg-cyan-200",
        "bg-purple-100 hover:bg-purple-200",
        "bg-yellow-50 hover:bg-yellow-100",
        "bg-orange-100 hover:bg-orange-200",
        "bg-fuchsia-100 hover:bg-fuchsia-200",
        "bg-violet-100 hover:bg-violet-200",
        "bg-red-100 hover:bg-red-200",
        "bg-green-100 hover:bg-green-200",
        "bg-blue-100 hover:bg-blue-200",
        "bg-neutral-100 hover:bg-neutral-200",
        "bg-stone-100 hover:bg-stone-200",
        "bg-slate-100 hover:bg-slate-200",
        "bg-zinc-100 hover:bg-zinc-200",
        "bg-gray-100 hover:bg-gray-200",
        "bg-yellow-100 hover:bg-yellow-200",
        "bg-orange-50 hover:bg-orange-100",
    ];

    const colorIndex = Math.abs(hash) % colorSchemes.length
    return colorSchemes[colorIndex]
}

export function getColorGroups(groups: Group[]): string {
    if (groups.length === 0) {
        return "bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900";
    }
    const groupNames = groups.map((group) => group.name);
    return generateUniqueColorScheme(groupNames);
}