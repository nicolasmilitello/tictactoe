import { Route, Routes } from 'react-router-dom';
import ColoredTimeMachine from '../views/colored-time-machine/colored-time-machine';
import TicTacToe from '../views/tic-tac-toe/tic-tac-toe';

//* components
import NavBar from '../components/navbar/navbar';

export default function RoutesComponent() {
	return (
		<div>
			<NavBar />
			<Routes>
				<Route path="/" element={<ColoredTimeMachine />} />
				<Route path="/tic-tac-toe" element={<TicTacToe />} />
			</Routes>
		</div>
	);
}
