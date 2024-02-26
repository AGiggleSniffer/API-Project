import { useRef, useState } from "react";
import { FaRegStar, FaCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectSpot } from "../../store/spot";
import useMouse from "../../hooks/useMouse";

export default function ReserveButton({ spotId }) {
	const [alertActive, setAlertActive] = useState(false);
	const spot = useSelector(selectSpot(spotId));
	const ref = useRef();
	const mousePosition = useMouse(ref);

	const handleClick = () => {
		setAlertActive(true);
		const delay = 3000;
		setTimeout(() => {
			setAlertActive(false);
		}, delay);
	};

	return (
		<>
			<span id="price-container">
				<span id="reserve-price">${spot?.price}</span> <span>night</span>
			</span>
			<span id="reserve-details">
				<FaRegStar className="star" />
				{spot?.avgStarRating > 0 ? spot?.avgStarRating.toFixed(1) : "New!"}
				<FaCircle className="circle" /> {spot?.numReviews} review
				{spot?.numReviews > 1 ? "s" : null}
			</span>
			<button
				onClick={handleClick}
				id="reserve-button"
				ref={ref}
				className="red"
				style={{
					backgroundImage: `radial-gradient( circle at ${mousePosition.xOffset}px ${mousePosition.yOffset}px, var(--Light-Red), var(--Red) 60% )`,
				}}
			>
				Reserve
				{alertActive && <div id="alert">Feature Coming Soon...</div>}
			</button>
		</>
	);
}
