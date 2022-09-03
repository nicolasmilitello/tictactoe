import React from 'react';

//* styles
import './button.styles.scss';

type ButtonProps = {
	eventHandler: () => void;
	active: boolean;
	content: string;
};

function Button({ eventHandler, active, content }: ButtonProps) {
	return (
		<button
			onClick={eventHandler}
			className={active ? 'disabled-button' : undefined}
		>
			{content}
		</button>
	);
}

export default Button;
