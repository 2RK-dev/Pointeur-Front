export interface edt {
	date: Date;
	tranche_horaire: string;
	matter_abr: string;
	salle: string;
	prof: string;
	niveau: string;
}
export interface caseInterface {
	matter_abr: string | null;
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
export interface Salle {
	Abr_Salle: string;
	Designation_Salle: string;
}
export interface matter_abr {
	Designation_UE: string;
	Abr_UE: string;
	Niveau_Assigner: string;
}
export interface Etudiant {
	Matricule: string;
	Nom: string;
	Niveau: string;
	Groupe: string;
}
export interface Prof {
	Abr_Prof: string;
	Nom_Prof: string;
}

export interface Abs {
	MATRICULE: string;
	NOM: string;
	DESIGNATION_NIVEAU: string;
	Etat: string;
}
