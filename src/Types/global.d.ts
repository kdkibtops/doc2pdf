// global.d.ts
declare namespace NodeJS {
	interface Process {
		pkg?: any;
	}
}
