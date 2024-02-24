import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadCurrSpots, selectCurrSpotsArr } from "../../store/spot";
import OwnedSpotCard from "./OwnedSpotCard";

export default function OwnedSpots() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const ref = useRef();
	const spots = useSelector(selectCurrSpotsArr);

	useEffect(() => {
		dispatch(loadCurrSpots());
	}, [dispatch]);

	useEffect(() => {
		const updateMousePos = (e) => {
			setMousePosition({ x: e.offsetX, y: e.offsetY });
		};
		const buttonRef = ref.current;
		buttonRef.addEventListener("mousemove", updateMousePos);
		return () => {
			buttonRef.removeEventListener("mousemove", updateMousePos);
		};
	}, []);

	return (
		<>
			<div id="owned-spot-header">
				<h2>Manage Your Spots</h2>
				<button
					ref={ref}
					className="red"
					onClick={()=> navigate("/spots/new")}
					style={{
						backgroundImage: `radial-gradient( circle at ${mousePosition.x}px ${mousePosition.y}px, var(--Light-Red), var(--Red) 60% )`,
					}}
				>
					Create A New Spot
				</button>
			</div>
			<div className="spot-list">
				{spots?.map((spot, i) => {
					if (!spot) return;
					return <OwnedSpotCard key={spot.id} spot={spot} delay={150 * i}/>;
				})}
			</div>
		</>
	);
}
