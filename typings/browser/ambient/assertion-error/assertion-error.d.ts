// Compiled using typings@0.6.9
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/800a7047cf275cc9f695cbd116748cd408a09d6d/assertion-error/assertion-error.d.ts
// Type definitions for assertion-error 1.0.0
// Project: https://github.com/chaijs/assertion-error
// Definitions by: Bart van der Schoor <https://github.com/Bartvds>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module 'assertion-error' {
	class AssertionError implements Error {
		constructor(message: string, props?: any, ssf?: Function);
		name: string;
		message: string;
		showDiff: boolean;
		stack: string;
	}
	export = AssertionError;
}