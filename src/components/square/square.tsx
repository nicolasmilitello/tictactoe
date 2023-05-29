import React from 'react';

type SquareProps = {
	id?: string;
	eventHandler?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	active?: boolean;
	content?: string | number;
};

function Square({ id, eventHandler, active, content }: SquareProps) {
	return (
		<div
			id={id}
			className={active ? 'selectedSquare' : undefined}
			onClick={eventHandler}
		>
			{content}
		</div>
	);
}

export default Square;
