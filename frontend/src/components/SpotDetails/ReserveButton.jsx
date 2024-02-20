import { useEffect, useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectSpot } from "../../store/spot";

export default function ReserveButton({ spotId }) {
	const [alertActive, setAlertActive] = useState(false);
	const spot = useSelector(selectSpot(spotId));

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
				{isNaN(spot?.avgStarRating)
					? spot?.avgStarRating
					: spot?.avgStarRating.toFixed(1)}{" "}
				- {spot?.numReviews} reviews
			</span>
			<button onClick={handleClick} id="reserve-button">
				Reserve
				{alertActive && <div id="alert">Feature Coming Soon...</div>}
			</button>
		</>
	);
}
