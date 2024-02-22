import { useEffect, useRef, useState } from "react";
import { FaRegStar, FaCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectSpot } from "../../store/spot";

export default function ReserveButton({ spotId }) {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [alertActive, setAlertActive] = useState(false);
	const spot = useSelector(selectSpot(spotId));
	const ref = useRef();

	const handleClick = () => {
		setAlertActive(true);
		const delay = 3000;
		setTimeout(() => {
			setAlertActive(false);
		}, delay);
	};

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
			<span id="price-container">
				<span id="reserve-price">${spot?.price}</span> <span>night</span>
			</span>
			<span id="reserve-details">
				<FaRegStar className="star" />
				{isNaN(spot?.avgStarRating)
					? spot?.avgStarRating
					: spot?.avgStarRating.toFixed(1)}{" "}
				<FaCircle className="circle" /> {spot?.numReviews} review{spot?.numReviews > 1 ? "s" : null}
			</span>
			<button
				onClick={handleClick}
				id="reserve-button"
				ref={ref}
				className="red"
				style={{
					backgroundImage: `radial-gradient( circle at ${mousePosition.x}px ${mousePosition.y}px, var(--Light-Red), var(--Red) 60% )`,
				}}
			>
				Reserve
				{alertActive && <div id="alert">Feature Coming Soon...</div>}
			</button>
		</>
	);
}
