// lib/axios.ts
import axios from "axios";

const instance = axios.create({
	baseURL: "http://localhost:1000/api/",
	// autres configurations par défaut
});

export default instance;
