"use client";

import MyTooltip from "@/components/tooltip";
import { Toaster } from "@/components/ui/toaster";
import {
	Book,
	Calendar,
	ChevronLeft,
	ChevronRight,
	DoorClosed,
	Frown,
	LayoutGrid,
	UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [open, setOpen] = useState(true);
	return (
		<div className="flex flex-row h-screen w-full cursor-default">
			<div
				className={`flex flex-col items-center bg-[#004085] text-white p-4 space-y-4 fixed left-0 top-0 h-full z-10 transition-all duration-500 ${
					open ? "w-[300px]" : "w-[100px] rounded-tr-md rounded-br-md"
				}`}>
				<Link href={"http://localhost:3000"}>
					<Image
						src={"/eni3.png"}
						alt="Logo"
						width="200"
						height={200}
						className={`mb-4 `}
					/>
				</Link>

				<Link
					href={"http://localhost:3000/Main"}
					className="flex items-center justify-center space-x-2 h-14 rounded-lg hover:bg-white hover:text-[#004085] w-full cursor-pointer">
					<LayoutGrid />

					{open && <p className="text-2xl ">Dashboard</p>}
				</Link>
				<Link
					href={"http://localhost:3000/Main/EDT"}
					className="flex items-center justify-center space-x-2 h-14 rounded-lg hover:bg-white hover:text-[#004085] w-full cursor-pointer">
					<Calendar />

					{open && <p className="text-2xl ">Emploi du Temp</p>}
				</Link>
				<Link
					href={"http://localhost:3000/Main/Table"}
					className="flex items-center justify-center space-x-2 h-14 rounded-lg hover:bg-white hover:text-[#004085] w-full cursor-pointer">
					<Book />
					{open && <p className="text-2xl">Matières</p>}
				</Link>
				<MyTooltip message="Gestion des éléves">
					<Link
						href={"http://localhost:3000/Main/Reservation"}
						className="flex items-center justify-center space-x-2 h-14 rounded-lg hover:bg-white hover:text-[#004085] w-full cursor-pointer">
						<UsersRound />
						{open && <p className="text-2xl ">Etudiants</p>}
					</Link>
				</MyTooltip>
				<Link
					href={"http://localhost:3000/Main/Salle"}
					className="flex items-center justify-center space-x-2 h-14 rounded-lg hover:bg-white hover:text-[#004085] w-full cursor-pointer">
					<DoorClosed />
					{open && <p className="text-2xl ">Salles</p>}
				</Link>
				<Link
					href={"http://localhost:3000/Main/Absence"}
					className="flex items-center justify-center space-x-2 h-14 rounded-lg hover:bg-white hover:text-[#004085] w-full cursor-pointer">
					<Frown />
					{open && (
						<p className={` text-2xl transition-all duration-300 `}>Absence</p>
					)}
				</Link>
				<div
					className="flex items-center justify-center h-14 rounded-lg hover:bg-white hover:text-[#004085] w-11/12 cursor-pointer absolute bottom-5"
					onClick={() => {
						open ? setOpen(false) : setOpen(true);
					}}>
					{open ? <ChevronLeft /> : <ChevronRight />}
				</div>
			</div>
			<div
				className={` transition-all duration-500 ${
					open ? "min-w-[300px]" : "min-w-[100px]"
				} `}></div>
			<div className="flex-grow p-4 z-0 ">{children}</div>
			<Toaster />
		</div>
	);
}
