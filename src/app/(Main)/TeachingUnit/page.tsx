"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { initialLevels } from "@/lib/niveau_utils";
import { getMatterForLevel } from "@/server_old/Matter";
import { FileText } from "lucide-react";

import { useEffect, useState } from "react";
import MatterTable from "./MatterTable";

export default function Page() {
	const [MatterList, setMatterList] = useState<Matter[]>([]);
	const [SelectedLevel, setSelectedLevel] = useState<string>("L1");

	useEffect(() => {
		getMatterForLevel(SelectedLevel).then((data) => {
			setMatterList(data);
		});
	}, [SelectedLevel]);

	return (
		<div className="p-4  min-w-[1250px]">
			<Card className="mb-8">
				<CardHeader>
					<div className="mb-4 flex justify-between items-center">
						<Select value={SelectedLevel} onValueChange={setSelectedLevel}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Sélectionner le niveau" />
							</SelectTrigger>
							<SelectContent>
								{initialLevels.map((level) => (
									<SelectItem key={level.id} value={level.title}>
										{level.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<div className=" space-x-4">
							<Button onClick={() => {}}>
								<FileText />
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col space-y-4" id="MatterList">
						<MatterTable MatterList={MatterList} />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
