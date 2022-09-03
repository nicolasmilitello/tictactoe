import { useState, useRef, useEffect } from 'react';

interface Values<T> {
	present: T;
	past: T[];
	future: T[];
}
type tupla<T> = [
	T | undefined,
	(n: number) => T,
	(n: number) => T | undefined,
	() => T | undefined,
	() => T | undefined,
	() => void,
	{
		canGoToThePast: boolean;
		canGoToTheFuture: boolean;
		amIThePresent: boolean;
	}
];

export default function useTimeMachine<T>(initialValue: T): tupla<T> {
	const [needLoadValue, setNeedLoadValue] = useState(true);

	const [value] = useState<T>(initialValue);

	const [completeHistory, setCompleteHistory] = useState<T[]>([initialValue]);

	const [history, setHistory] = useState<Values<T>>({
		past: [],
		present: initialValue,
		future: [],
	});

	useEffect(() => {
		if (needLoadValue) {
			updateValue(initialValue);
		}
		setNeedLoadValue(true);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialValue]);

	const updateValue = (value: T | null) => {
		if (value === null || value === history.present) {
			return;
		}

		let newHistory = {
			future: [],
			present: value,
			past: [],
		};

		// if (history.present === null) {
		// 	// first operation to set value
		// 	console.log('me ejecuto en algun momento?');
		// 	return setHistory(newHistory);
		// }

		setCompleteHistory([value, history.present, ...history.past]);

		setHistory({
			...newHistory,
			past: [history.present, ...history.past],
		});
	};

	const getPreviousValue = (n: number) => {
		// const completeHistory = [
		// 	...history.future,
		// 	history.present,
		// 	...history.past,
		// ];
		// console.log([...history.future, history.present, ...history.past]);
		// console.log(n);
		return completeHistory[n];
	};

	const movePreviousValues = (n: number) => {
		// if (historyRef.current) {
		// const { past } = historyRef.current;
		if (!history.past.length) return;
		const lastPrevious = history.past[n];
		const newPast = history.past.slice(n + 1);

		const newFuture = [history.present];
		const newPresent = lastPrevious;

		setHistory({
			...history,
			past: newPast,
			present: newPresent,
			future: newFuture.concat(history.future),
		});
		return lastPrevious;
		// }
	};

	const getNextValue = () => {
		// if (historyRef.current) {
		// const { future } = historyRef.current;
		if (!history.future.length) return;

		const next = history.future[0];
		const newFuture = history.future.slice(1);
		const newPast = [history.present, ...history.past];
		const newPresent = next;

		setHistory({
			...history,
			past: newPast,
			present: newPresent,
			future: newFuture,
		});
		return next;
		// }
	};

	const getPresentValue = () => {
		// if (historyRef.current) {
		// const { future, past } = historyRef.current;

		if (!history.future.length) return;

		const newPresent = history.future[history.future.length - 1];
		const futureWithoutNewPresent = history.future.slice(
			0,
			history.future.length - 1
		);
		const newFuture = [] as T[];
		futureWithoutNewPresent.reverse().push(history.present);
		const newPast = futureWithoutNewPresent.concat(history.past);

		setHistory({
			...history,
			past: newPast,
			present: newPresent,
			future: newFuture,
		});
		return newPresent;
		// }
	};

	const reset = () => {
		setNeedLoadValue(false);
		setCompleteHistory([]);
		setHistory({
			present: value,
			future: [],
			past: [],
		});
	};

	return [
		// history.past[0] ? history.past[0] : undefined,
		history.past[0] !== undefined ? history.past[0] : undefined,
		getPreviousValue,
		movePreviousValues,
		getNextValue,
		getPresentValue,
		reset,
		{
			canGoToThePast: history.past[0] !== undefined ? true : false,
			canGoToTheFuture: history.future[0] ? true : false,
			amIThePresent: !history.future.length,
		},
	];
}
