"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Info, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Level {
	id: string;
	title: string;
	groups: string[];
}

const initialLevels: Level[] = [
	{
		id: "L1",
		title: "L1",
		groups: ["GB grp1", "GB grp2", "ASR grp1", "ASR grp2"],
	},
	{
		id: "L2",
		title: "L2",
		groups: ["GB grp1", "GB grp2", "ASR grp1", "ASR grp2"],
	},
];

export default function Home() {
	const [levels, setLevels] = useState<Level[]>(initialLevels);
	const [editingLevel, setEditingLevel] = useState<Level | null>(null);
	const [newLevel, setNewLevel] = useState<Omit<Level, "id">>({
		title: "",
		groups: [],
	});
	const [newGroup, setNewGroup] = useState("");
	const [isAddingLevel, setIsAddingLevel] = useState(false);

	const handleAddLevel = () => {
		if (newLevel.title) {
			const newLevelComplete: Level = {
				id: `L${levels.length + 1}`,
				title: newLevel.title,
				groups: newLevel.groups,
			};
			setLevels([...levels, newLevelComplete]);
			setNewLevel({ title: "", groups: [] });
			setIsAddingLevel(false);
		}
	};

	const handleUpdateLevel = (updatedLevel: Level) => {
		setLevels(
			levels.map((level) =>
				level.id === updatedLevel.id ? updatedLevel : level
			)
		);
		setEditingLevel(null);
	};

	const handleDeleteLevel = (id: string) => {
		setLevels(levels.filter((level) => level.id !== id));
	};

	const handleAddGroup = (levelId: string) => {
		if (newGroup) {
			setLevels(
				levels.map((level) => {
					if (level.id === levelId) {
						return {
							...level,
							groups: [...level.groups, newGroup],
						};
					}
					return level;
				})
			);
			setNewGroup("");
		}
	};

	const handleDeleteGroup = (levelId: string, groupToDelete: string) => {
		setLevels(
			levels.map((level) => {
				if (level.id === levelId) {
					return {
						...level,
						groups: level.groups.filter((group) => group !== groupToDelete),
					};
				}
				return level;
			})
		);
	};

	return (
		<div className="container mx-auto p-4 bg-gray-50 min-h-screen">
			<Dialog open={isAddingLevel} onOpenChange={setIsAddingLevel}>
				<DialogTrigger asChild>
					<Button
						onClick={() => setIsAddingLevel(true)}
						className="mb-6 mx-auto flex flex-row">
						<Plus className="mr-2 h-4 w-4" /> Ajouter un niveau
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Ajouter un nouveau niveau</DialogTitle>
					</DialogHeader>
					<Label htmlFor="newLevelTitle">Titre</Label>
					<Input
						id="newLevelTitle"
						value={newLevel.title}
						onChange={(e) =>
							setNewLevel({ ...newLevel, title: e.target.value })
						}
						className="mb-4"
					/>
					<DialogFooter>
						<Button onClick={handleAddLevel}>Ajouter</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{levels.map((level) => (
					<Card
						key={level.id}
						className="shadow-lg hover:shadow-xl transition-shadow duration-300">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-2xl font-bold">
								{level.title}
							</CardTitle>
							<div className="flex space-x-2">
								<Button
									variant="outline"
									size="icon"
									onClick={() => setEditingLevel(level)}>
									<Edit className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									onClick={() => handleDeleteLevel(level.id)}>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="outline" className="w-full mb-4">
										<Info className="mr-2 h-4 w-4" /> Voir les groupes
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>{level.title} - Groupes</DialogTitle>
									</DialogHeader>
									<div className="space-y-4">
										{level.groups.map((group, index) => (
											<div
												key={index}
												className="flex justify-between items-center">
												<span>{group}</span>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleDeleteGroup(level.id, group)}>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
										<div className="flex space-x-2">
											<Input
												value={newGroup}
												onChange={(e) => setNewGroup(e.target.value)}
												placeholder="Nouveau groupe"
											/>
											<Button onClick={() => handleAddGroup(level.id)}>
												<Plus className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</DialogContent>
							</Dialog>
						</CardContent>
					</Card>
				))}
			</div>
			<Dialog open={!!editingLevel} onOpenChange={() => setEditingLevel(null)}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Modifier le niveau</DialogTitle>
					</DialogHeader>
					{editingLevel && (
						<>
							<Label htmlFor="levelTitle">Titre</Label>
							<Input
								id="levelTitle"
								value={editingLevel.title}
								onChange={(e) =>
									setEditingLevel({ ...editingLevel, title: e.target.value })
								}
								className="mb-4"
							/>
							<DialogFooter>
								<Button onClick={() => handleUpdateLevel(editingLevel)}>
									Sauvegarder
								</Button>
							</DialogFooter>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
