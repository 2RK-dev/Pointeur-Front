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
import { Level } from "@/Types/Level";
import { Edit, Info, Plus, Trash2 } from "lucide-react";
import {useEffect, useState} from "react";
import {getLevels} from "@/services/Level";

export default function Home() {
	const [levels, setLevels] = useState<Level[]>([]);
	const [editingLevel, setEditingLevel] = useState<Level | null>(null);
	const [newGroup, setNewGroup] = useState("");
	const [isAddingLevel, setIsAddingLevel] = useState(false);

	useEffect(() => {
		getLevels().then((data) => setLevels(data));
	}, []);

	const handleUpdateLevel = (updatedLevel: Level) => {
		//to be implemented
	};

	const handleDeleteLevel = (id: number) => {
		//to be implemented
	};

	const handleAddGroup = (levelId: number) => {
		//to be implemented
	};

	const handleDeleteGroup = (groupToDelete: number) => {
		//to be implemented
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
					{/* To move in a new component */}
				</DialogContent>
			</Dialog>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{levels.map((level) => (
					<Card
						key={level.id}
						className="shadow-lg hover:shadow-xl transition-shadow duration-300">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-2xl font-bold">
								{level.name}
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
										<DialogTitle>{level.name} - Groupes</DialogTitle>
									</DialogHeader>
									<div className="space-y-4">
										{level.groups.map((group, index) => (
											<div
												key={group.id}
												className="flex justify-between items-center">
												<span>{group.name}</span>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleDeleteGroup(group.id)}>
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
								value={editingLevel.name}
								onChange={(e) =>
									setEditingLevel({ ...editingLevel, name: e.target.value })
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
