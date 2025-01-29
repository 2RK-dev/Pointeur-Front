export interface Level {
	id: string;
	title: string;
	groups: string[];
}

export const initialLevels: Level[] = [
	{
		id: "L1",
		title: "L1",
		groups: ["GB grp1", "GB grp2", "IG grp1", "IG grp2", "ASR"],
	},
	{
		id: "L2",
		title: "L2",
		groups: ["GB grp1", "GB grp2", "IG grp1", "IG grp2", "ASR"],
	},
	{
		id: "L3",
		title: "L3",
		groups: ["GB grp1", "GB grp2", "IG grp1", "IG grp2", "ASR"],
	},
	{
		id: "M1",
		title: "M1",
		groups: ["GB grp1", "GB grp2", "IG grp1", "IG grp2", "ASR"],
	},
	{
		id: "M2",
		title: "M2",
		groups: ["GB grp1", "GB grp2", "IG grp1", "IG grp2", "ASR"],
	},
];
