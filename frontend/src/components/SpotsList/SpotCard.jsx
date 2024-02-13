import { useState, useEffect, useRef } from "react";
import { FaRegStar } from "react-icons/fa";
import "./SpotCard.css";

export default function SpotCard({ spot }) {
	const { city, state, avgStarRating, price, previewImage, description, name } =
		spot;

	const ref = useRef();
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [tooltipDisabled, setTooltipDisabled] = useState(false);

	useEffect(() => {
		const updateMousePos = (e) => {
			const cache = { x: e.clientX, y: e.clientY };
			setMousePosition({ x: e.clientX, y: e.clientY });

			console.log(cache === mousePosition, cache, mousePosition);
		};
		ref.current.addEventListener("mousemove", updateMousePos);
		return () => window.removeEventListener("mousemove", updateMousePos);
	}, [mousePosition]);

	useEffect(() => {
		const time = 1000;

		const setTooltip = (e) => {
			const myTimeout = setTimeout(() => {
				setTooltipDisabled(true);
			}, time);
		};

		ref.current.addEventListener("mouseover", setTooltip);
		return () => {
			window.removeEventListener("mouseover", setTooltip);
		};
	}, [price]);

	return (
		<>
			<div className="spot-card" ref={ref}>
				<div className="image-container">
					<img src={previewImage} alt={description} className="spot-image" />
				</div>
				<span className="details">
					<strong>{city}, </strong>
					{state}
				</span>
				<span className="rating">
					<FaRegStar />
					{avgStarRating.toFixed(1)}
				</span>
				<span className="price">
					<strong>${price}</strong> night
				</span>
			</div>
			{tooltipDisabled && (
				<div
					className="tooltip"
					style={{ top: mousePosition.y + 10, left: mousePosition.x + 10 }}
				>
					{city}
				</div>
			)}
		</>
	);
}
