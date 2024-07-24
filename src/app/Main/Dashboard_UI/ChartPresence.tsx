"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartDataType {
	etat: string;
	nombre: number;
	fill?: string;
}

const chartData = [
	{ etat: "Absent", nombre: 100 },
	{ etat: "Present", nombre: 300 },
];

chartData.forEach((data: ChartDataType) => {
	data.fill = `var(--color-${data.etat})`;
});
const chartConfig = {
	visitors: {
		label: "Visitors",
	},
	Absent: {
		label: "Absent",
		color: "hsl(var(--chart-1))",
	},
	Present: {
		label: "Présent",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export function Chart() {
	const totalVisitors = React.useMemo(() => {
		const total: number = chartData.reduce((acc, curr) => acc + curr.nombre, 0);
		const TauxPresence = (chartData[1].nombre / total) * 100;
		return TauxPresence;
	}, []);

	return (
		<ChartContainer
			config={chartConfig}
			className="mx-auto aspect-square max-h-[250px]">
			<PieChart>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
				/>
				<Pie
					data={chartData}
					dataKey="nombre"
					nameKey="etat"
					innerRadius={60}
					strokeWidth={5}>
					<Label
						content={({ viewBox }) => {
							if (viewBox && "cx" in viewBox && "cy" in viewBox) {
								return (
									<text
										x={viewBox.cx}
										y={viewBox.cy}
										textAnchor="middle"
										dominantBaseline="middle">
										<tspan
											x={viewBox.cx}
											y={viewBox.cy}
											className="fill-foreground text-3xl font-bold">
											{totalVisitors.toLocaleString() + "%"}
										</tspan>
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) + 24}
											className="fill-muted-foreground">
											de Présence
										</tspan>
									</text>
								);
							}
						}}
					/>
				</Pie>
			</PieChart>
		</ChartContainer>
	);
}
