export interface edt {
	date: Date;
	tranche_horaire: string;
	ue: string;
	salle: string;
	prof: string;
	niveau: string;
}
export interface caseInterface {
	ue: string | null;
	salle: string | null;
	prof: string | null;
	niveau: string | null;
}
export interface cours {
	tranche_horaire: string;
	case: caseInterface[];
}
export interface edtTemplatInterface {
	date: string | null;
	cours: cours[];
}
export interface Semaine {
	debut: Date;
	fin: Date;
}
