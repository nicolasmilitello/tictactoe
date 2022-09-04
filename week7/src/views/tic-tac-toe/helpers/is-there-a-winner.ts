import { SquareValue } from '../tic-tac-toe';

export const isThereAWinner = (squares: SquareValue[], pattern: number[]): boolean => {
	if (
		squares[pattern[0]] !== '' &&
		squares[pattern[1]] !== '' &&
		squares[pattern[2]] !== '' &&
		squares[pattern[0]] === squares[pattern[1]] &&
		squares[pattern[1]] === squares[pattern[2]]
	) {
		return true;
	}

	return false;
};