import React, { useState, useEffect } from 'react';

//* components
import Square from '../../components/square/square';
import Button from '../../components/button/button';

//* constants
import { colorSquares } from '../../constants/colored-time-machine';

//* custom hook
import useTimeMachine from '../../hooks/use-time-machine/use-time-machine';

//* styles
import './colored-time-machine.styles.scss';

function ColoredTimeMachine() {
	const [presentColor, setPresentColor] = useState<string | null>('');

	const [isInPast, setIsInPast] = useState(false);

	const [
		previousValue,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		getPreviousValue,
		movePreviousValues,
		getNextValue,
		getPresentValue,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		reset,
		{ canGoToTheFuture, canGoToThePast, amIThePresent },
	] = useTimeMachine(isInPast ? null : presentColor);

	useEffect(() => {
		if (!canGoToTheFuture) setIsInPast(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [previousValue]);

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (isInPast) {
			alert(
				`Please click on resume button before clicking other square.`
			);
			return;
		}

		if ((e.target as HTMLDivElement).id === presentColor)
			alert(`You can't select the same color twice in a row.`);

		setPresentColor((e.target as HTMLDivElement).id);
	};

	const goToThePreviousValue = () => {
		const previous = movePreviousValues(0);

		if (previous || previous === '') {
			if (previousValue || previousValue === '') {
				setPresentColor(previousValue);
			}
			setIsInPast(true);
		}
	};

	const goToTheNextValue = () => {
		const next = getNextValue();
		if (next) {
			setPresentColor(next);
		}
	};

	const goToThePresentValue = () => {
		const present = getPresentValue();
		if (present) {
			setIsInPast(false);
			setPresentColor(present);
		}
	};

	const buttons = {
		next: {
			eventHandler: () => goToTheNextValue(),
			active: !canGoToTheFuture,
			content: 'NEXT',
		},
		resume: {
			eventHandler: () => goToThePresentValue(),
			active: amIThePresent,
			content: 'RESUME',
		},
		previous: {
			eventHandler: () => goToThePreviousValue(),
			active: !canGoToThePast,
			content: 'PREVIOUS',
		},
	};

	return (
		<div className='coloredContainer'>
			<div className='coloredContainer__grid-container'>
				{colorSquares.map((square) => (
					<Square
						key={square.id}
						id={square.id}
						active={presentColor === square.id}
						eventHandler={handleClick}
					/>
				))}
			</div>
			<div className='coloredContainer__button-container'>
				{Object.values(buttons).map((button) => (
					<Button
						key={button.content}
						eventHandler={button.eventHandler}
						active={button.active}
						content={button.content}
					/>
				))}
			</div>
		</div>
	);
}

export default ColoredTimeMachine;
