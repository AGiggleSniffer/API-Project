import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllSpots, selectSpotsArray } from "../../store/spot";
import SpotCard from "./SpotCard";
import Loader from "../Skeletons/Loader";
import "./SpotsList.css";

export default function SpotsList() {
	const dispatch = useDispatch();
	const spots = useSelector(selectSpotsArray);
	const loading = useSelector((state) => state.spots.loading);

	useEffect(() => {
		dispatch(loadAllSpots());
	}, [dispatch]);

	return (
		<>
			{loading && <Loader />}
			<div className="spot-list">
				{spots?.map((spot, i) => {
					if (!spot) return;
					return <SpotCard key={spot.id} spot={spot} delay={120 * i} />;
				})}
			</div>
		</>
	);
}
