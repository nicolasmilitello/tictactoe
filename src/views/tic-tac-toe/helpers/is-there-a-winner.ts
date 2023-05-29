import { Dispatch } from 'react';
import { SquareValue } from '../tic-tac-toe';

export const isThereAWinner = (
	squares: SquareValue[],
	pattern: number[],
	setIsTie: Dispatch<React.SetStateAction<boolean>>
): boolean => {
	if (
		squares[pattern[0]] !== '' &&
		squares[pattern[1]] !== '' &&
		squares[pattern[2]] !== '' &&
		squares[pattern[0]] === squares[pattern[1]] &&
		squares[pattern[1]] === squares[pattern[2]]
	) {
		return true;
	} else if (squares.filter((value) => value === '').length === 0) {
		setIsTie(true);
	}

	return false;
};
