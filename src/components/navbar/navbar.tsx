import React from 'react';
import { Link } from 'react-router-dom';

//* styles
import './navbar.styles.scss';

function NavBar(): JSX.Element {
	return (
		<nav>
			<Link to='/' className='navbar_link'>
				Colored Time Machine
			</Link>

			<Link to='/tic-tac-toe' className='navbar_link'>
				Tic Tac Toe
			</Link>
		</nav>
	);
}

export default React.memo(NavBar);
