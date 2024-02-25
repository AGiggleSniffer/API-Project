import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadCurrSpots, selectCurrSpotsArr } from "../../store/spot";
import OwnedSpotCard from "./OwnedSpotCard";
import useMouse from "../../hooks/useMouse";
import Loader from "../Skeletons/Loader";

export default function OwnedSpots() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const ref = useRef();
	const mousePosition = useMouse(ref);
	const spots = useSelector(selectCurrSpotsArr);
	const loading = useSelector((state) => state.spots.loading);

	useEffect(() => {
		dispatch(loadCurrSpots());
	}, [dispatch]);

	return (
		<>
			{loading && <Loader />}
			<div id="owned-spot-header">
				<h2>Manage Your Spots</h2>
				<button
					ref={ref}
					className="red"
					onClick={() => navigate("/spots/new")}
					style={{
						backgroundImage: `radial-gradient( circle at ${mousePosition.xOffset}px ${mousePosition.yOffset}px, var(--Light-Red), var(--Red) 60% )`,
					}}
				>
					Create A New Spot
				</button>
			</div>
			<div className="spot-list">
				{spots?.map((spot, i) => {
					if (!spot) return;
					return <OwnedSpotCard key={spot.id} spot={spot} delay={120 * i} />;
				})}
			</div>
		</>
	);
}
