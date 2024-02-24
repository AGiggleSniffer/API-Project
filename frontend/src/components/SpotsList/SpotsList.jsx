import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllSpots, selectSpotsArray } from "../../store/spot";
import SpotCard from "./SpotCard";
import "./SpotsList.css";

export default function SpotsList() {
	const dispatch = useDispatch();
	const spots = useSelector(selectSpotsArray);

	useEffect(() => {
		dispatch(loadAllSpots());
	}, [dispatch]);

	return (
		<div className="spot-list">
			{spots?.map((spot, i) => {
				if (!spot) return;
				return <SpotCard key={spot.id} spot={spot} delay={120 * i} />;
			})}
		</div>
	);
}
