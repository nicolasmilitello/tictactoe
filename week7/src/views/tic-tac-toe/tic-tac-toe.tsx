import React, { useState, useRef, useEffect } from 'react';

//* components
import Square from '../../components/square/square';
import Button from '../../components/button/button';

//* constants
import { WinningCombinations } from './constants/constants';

//* custom hook
import useTimeMachine from '../../hooks/use-time-machine/use-time-machine';

//* styles
import './tic-tac-toe.styles.scss';

//* types
export { WinningCombinations } from './constants/constants';

// types
type SquareValue = 'x' | 'o' | '';

// type WinningCombinations = {
// 	along: number[][];
// 	down: number[][];
// 	diagnol: number[][];
// };

const TicTacToe = () => {
	const [turn, setTurn] = useState('x');

	const [replaying, setReplaying] = useState(false);

	const [cells, setCells] = useState<SquareValue[]>(Array(9).fill(''));

	const [winner, setWinner] = useState<SquareValue>('');

	const [isInPast, setIsInPast] = useState(false);

	const counter = useRef({
		counter: 0,
		index: 0,
	});

	const [
		previousValue,
		getPreviousValue,
		movePreviousValues,
		getNextValue,
		getPresentValue,
		reset,
		{ canGoToThePast, canGoToTheFuture, amIThePresent },
	] = useTimeMachine(cells);

	// const [verPrevio, setVerPrevio] = useState(previousValue);
	// useEffect(() => {
	// 	setVerPrevio(previousValue);
	// }, [previousValue]);

	useEffect(() => {
		if (!canGoToTheFuture) setIsInPast(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [previousValue]);

	const checkForWinner = (squares: SquareValue[]) => {
		for (let combination in WinningCombinations) {
			WinningCombinations[
				combination as keyof WinningCombinations
			].forEach((pattern) => {
				// console.error(pattern);
				// console.log({ pattern0: squares[pattern[0]] });
				// console.log({ pattern1: squares[pattern[1]] });
				// console.log({ pattern2: squares[pattern[2]] });
				if (
					squares[pattern[0]] !== '' &&
					squares[pattern[1]] !== '' &&
					squares[pattern[2]] !== '' &&
					squares[pattern[0]] === squares[pattern[1]] &&
					squares[pattern[1]] === squares[pattern[2]]
				) {
					// console.warn('ENTRA ACÁ?');
					setWinner(squares[pattern[0]]);
				}
			});
		}
	};

	const handleClick = (num: number) => {
		if (winner) {
			alert(
				`The game is over. Please click on restart button to play again.`
			);
			return;
		}

		if (isInPast) {
			alert(`Please click the resume button to continue playing.`);
			return;
		}

		counter.current.counter = counter.current.counter + 1;
		counter.current.index = counter.current.index + 1;

		if (cells[num] !== '') {
			alert(`You can't click the same square twice.`);
			return;
		}

		let squares = [...cells];

		if (turn === 'x') {
			squares[num] = 'x';
			setTurn('o');
		} else {
			squares[num] = 'o';
			setTurn('x');
		}

		checkForWinner(squares);
		setCells(squares);
	};

	const handleRestart = () => {
		setWinner('');
		setCells(Array(9).fill(''));
	};

	const goToThePreviousStep = () => {
		if (replaying) return;

		if (winner) {
			if (counter.current.index) {
				counter.current.index = counter.current.index - 1;
			} else {
				return;
			}
		}

		const previous = movePreviousValues(0);

		if (previous) {
			setCells(previous);
			setIsInPast(true);
		}
	};

	const goToTheNextStep = () => {
		const next = getNextValue();

		if (winner && counter.current.index < counter.current.counter) {
			counter.current.index = counter.current.index + 1;
		}

		if (next) {
			setCells(next);
		}
	};

	const goToThePresentStep = () => {
		const present = getPresentValue();

		if (present) {
			setCells(present);
			setIsInPast(false);
		}
	};

	const restart = () => {
		if (replaying) return;
		handleRestart();
		reset();
		setIsInPast(false);
		counter.current.counter = 0;
		counter.current.index = 0;
	};

	const replayGame = () => {
		if (isInPast) return;

		setReplaying(true);

		function showEachMove() {
			const move = getPreviousValue(counter.current.index);

			setCells(move);

			if (counter.current.index > 0) {
				counter.current.index = counter.current.index - 1;
				setTimeout(showEachMove, 500); // 0.5 seconds
			} else {
				counter.current.index = counter.current.counter;
				setReplaying(false);
			}
		}

		showEachMove();
	};

	const isThereAnyValue = () => {
		const values = Object.values(cells);

		const existingValues = values.filter((value) => value !== '');

		return !!existingValues.length;
	};

	const checkDisabled = () => {
		if (replaying) return true;
		const areThereValues = isThereAnyValue();

		// TODO: CHEQUEAR PARA DISMINUIR ESTO:
		if (!areThereValues && isInPast) return false;
		if (areThereValues && isInPast) return false;
		if (areThereValues && !isInPast) return false;
		if (!areThereValues && !isInPast) return true;
		return true;
	};

	return (
		<div className="tictactoeContainer">
			<div className="tictactoeContainer__controlsContainer">
				<div className="tictactoeContainer__controlsContainer__board">
					{cells.map((cell, index) => (
						<Square
							key={index}
							content={cell}
							eventHandler={() => handleClick(index)}
						/>
					))}
				</div>
				<div className="tictactoeContainer__controlsContainer__buttonsContainer">
					<Button
						eventHandler={() => goToTheNextStep()}
						active={!canGoToTheFuture}
						content={'NEXT'}
					/>

					{winner ? (
						<Button
							eventHandler={() => replayGame()}
							active={isInPast}
							content={'REPLAY'}
						/>
					) : (
						<Button
							eventHandler={() => goToThePresentStep()}
							active={amIThePresent}
							content={'RESUME'}
						/>
					)}

					<Button
						eventHandler={() => goToThePreviousStep()}
						active={
							replaying
								? true
								: counter.current.index
								? !canGoToThePast
								: true
						}
						content={'PREVIOUS'}
					/>

					<p>Next to move:</p>
					<div className="square">
						<Square content={turn} />
					</div>

					<Button
						eventHandler={() => restart()}
						active={checkDisabled()}
						content={'RESTART'}
					/>
				</div>
			</div>

			{winner && (
				<div className="tictactoeContainer__winner">
					<p>
						🎊 <span>{winner}</span> is the winner! 🎉
					</p>
				</div>
			)}
		</div>
	);
};

export default TicTacToe;
