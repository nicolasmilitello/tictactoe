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

	const [value] = useState<T>(initialValue); // esto me trae el primer valor y lo congela, y lo uso para el reseteo ya que sino se agrega el último valor al presente o al pasado y no puedo encontrar porqué no se actualiza el valor.

	const [completeHistory, setCompleteHistory] = useState<T[]>([]);

	const [history, setHistory] = useState<Values<T>>({
		past: [],
		present: initialValue,
		future: [],
	});

	const historyRef = useRef<Values<T>>();

	historyRef.current = history;
	const { present, past, future } = history;

	useEffect(() => {
		if (needLoadValue) {
			updateValue(initialValue);
		}
		setNeedLoadValue(true);
		setCompleteHistory([initialValue, ...completeHistory]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialValue]);

	const updateValue = (value: T | null) => {
		if (value === null || value === present) {
			return;
		}

		let newHistory = {
			future: [],
			present: value,
			past: [],
		};

		if (present === null) {
			// first operation to set value
			return setHistory(newHistory);
		}

		return setHistory({
			...newHistory,
			past: [present, ...past],
		});
	};

	const getPreviousValue = (n: number) => {
		const completeHistory = [...future, present, ...past];
		return completeHistory[n];
	};

	const movePreviousValues = (n: number) => {
		if (historyRef.current) {
			const { past } = historyRef.current;
			if (!past.length) return;
			const lastPrevious = past[n];
			const newPast = past.slice(n + 1);

			const newFuture = [present];
			const newPresent = lastPrevious;

			setHistory({
				...history,
				past: newPast,
				present: newPresent,
				future: newFuture.concat(future),
			});
			return lastPrevious;
		}
	};

	const getNextValue = () => {
		if (historyRef.current) {
			const { future } = historyRef.current;
			if (!future.length) return;

			const next = future[0];
			const newFuture = future.slice(1);
			const newPast = [present, ...past];
			const newPresent = next;

			setHistory({
				...history,
				past: newPast,
				present: newPresent,
				future: newFuture,
			});
			return next;
		}
	};

	const getPresentValue = () => {
		if (historyRef.current) {
			const { future, past } = historyRef.current;

			if (!future.length) return;

			const newPresent = future[future.length - 1];
			const futureWithoutNewPresent = future.slice(0, future.length - 1);
			const newFuture = [] as T[];
			futureWithoutNewPresent.reverse().push(present);
			const newPast = futureWithoutNewPresent.concat(past);

			setHistory({
				...history,
				past: newPast,
				present: newPresent,
				future: newFuture,
			});
			return newPresent;
		}
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
		history.past[0] ? history.past[0] : undefined,
		getPreviousValue,
		movePreviousValues,
		getNextValue,
		getPresentValue,
		reset,
		{
			canGoToThePast: history.past[0] ? true : false,
			canGoToTheFuture: history.future[0] ? true : false,
			amIThePresent: !future.length,
		},
	];
}
