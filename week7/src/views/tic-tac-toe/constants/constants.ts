export type WinningCombinationsInterface = {
	along: number[][];
	down: number[][];
	diagnol: number[][];
};

export const WinningCombinations: WinningCombinationsInterface = {
	along: [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
	],
	down: [
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
	],
	diagnol: [
		[0, 4, 8],
		[2, 4, 6],
	],
};
