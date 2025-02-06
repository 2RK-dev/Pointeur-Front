import { MyCard } from "@/components/Card";
import { Chart } from "./Dashboard_UI/ChartPresence";
import { ChartPresenceParNiveau } from "./Dashboard_UI/ChartPresenceParNiveau";
import TopAbs from "./Dashboard_UI/TopAbs";

export default function page() {
	return (
		<div className="space-y-4 w-full">
			<div className="flex flex-col lg:flex-row w-full lg:space-x-4 space-y-4 lg:space-y-0">
				<MyCard
					className="w-full lg:w-[400px] h-[350px] space-y-4"
					description="Taux de présence des éléves cette année"
					title="Taux de présence">
					<Chart />
				</MyCard>
				<MyCard
					className="space-y-4 h-[350px] flex flex-col flex-grow justify-center items-center"
					description="Présence par niveau cette années"
					title="Présence par niveau">
					<ChartPresenceParNiveau />
				</MyCard>
			</div>
			<div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
				<MyCard
					className="w-full lg:w-[600px] h-[550px]"
					description="Les éléves les plus absents de cette années"
					title="Les éléves les plus absence">
					<TopAbs />
				</MyCard>
				<MyCard
					className="flex flex-grow flex-col h-[550px]"
					description="Emploi du temps de cette semaine"
					title="Emploi du temps">
					<div></div>
				</MyCard>
			</div>
		</div>
	);
}
