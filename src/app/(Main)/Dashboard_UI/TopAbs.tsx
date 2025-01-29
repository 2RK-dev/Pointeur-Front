import { ScrollArea } from "@/components/ui/scroll-area";

const data = [
	{ nom: "Sarah Thomas", niveau: "M1", nombre_d_absences: 6 },
	{ nom: "Alice Johnson", niveau: "L3", nombre_d_absences: 5 },
	{ nom: "Karen Gonzalez", niveau: "M2", nombre_d_absences: 5 },
	{ nom: "Emily Davis", niveau: "M2", nombre_d_absences: 4 },
	{ nom: "Laura Hernandez", niveau: "L1", nombre_d_absences: 4 },
	{ nom: "Jessica Clark", niveau: "L2", nombre_d_absences: 4 },
	{ nom: "John Doe", niveau: "L1", nombre_d_absences: 3 },
	{ nom: "Megan Taylor", niveau: "L2", nombre_d_absences: 3 },
	{ nom: "Anna Jackson", niveau: "L3", nombre_d_absences: 3 },
	{ nom: "Bob Brown", niveau: "M1", nombre_d_absences: 2 },
	{ nom: "James Anderson", niveau: "L3", nombre_d_absences: 2 },
	{ nom: "Daniel Moore", niveau: "L2", nombre_d_absences: 2 },
	{ nom: "Thomas Walker", niveau: "L3", nombre_d_absences: 2 },
	{ nom: "Jane Smith", niveau: "L2", nombre_d_absences: 1 },
	{ nom: "Kevin Lewis", niveau: "L1", nombre_d_absences: 1 },
	{ nom: "Susan Hall", niveau: "M1", nombre_d_absences: 1 },
	{ nom: "David Martinez", niveau: "M2", nombre_d_absences: 1 },
	{ nom: "Robert Lee", niveau: "M1", nombre_d_absences: 0 },
	{ nom: "Chris Wilson", niveau: "L1", nombre_d_absences: 0 },
	{ nom: "Matthew Allen", niveau: "M2", nombre_d_absences: 0 },
];
export default function TopAbs() {
	return (
		<ScrollArea className="h-full w-full rounded-md border">
			{data.map((item, index) => (
				<div key={index} className="flex flex-row m-4">
					{item.nom && (
						<>
							<p key={index + item.nom} className=" w-3/5 flex items-center">
								#{index + 1} {item.nom}
							</p>
							<p
								key={index + item.niveau}
								className=" w-1/5 flex justify-center">
								{item.niveau}
							</p>
						</>
					)}
					<p
						key={index + item.nombre_d_absences}
						className=" w-1/5 flex justify-center">
						{item.nombre_d_absences}
					</p>
				</div>
			))}
		</ScrollArea>
	);
}
