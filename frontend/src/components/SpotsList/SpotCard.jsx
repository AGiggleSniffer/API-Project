import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
import "./SpotCard.css";
import useMouse from "../../hooks/useMouse";

export default function SpotCard({ spot, delay }) {
	const {
		id,
		city,
		state,
		avgStarRating,
		price,
		previewImage,
		description,
		name,
	} = spot;

	const [tooltipBool, setTooltip] = useState(false);
	const navigate = useNavigate();
	const ref = useRef();
	const mousePosition = useMouse(ref);

	useEffect(() => {
		const delay = 1000;
		let timeoutID;
		const enableTooltip = () => {
			timeoutID = setTimeout(() => {
				setTooltip(true);
			}, delay);
		};

		const disableTooltip = () => {
			clearTimeout(timeoutID);
			setTooltip(false);
		};

		const imageContainer = ref.current;
		imageContainer.addEventListener("mouseenter", enableTooltip);
		imageContainer.addEventListener("mouseleave", disableTooltip);
		return () => {
			imageContainer.removeEventListener("mouseenter", enableTooltip);
			imageContainer.removeEventListener("mouseleave", disableTooltip);
		};
	}, []);

	const [opacity, setOpacity] = useState(0);
	const [translate, setTranslate] = useState(200);
	const [scale, setScale] = useState(0.8);
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpacity(100);
			setTranslate(0);
			setScale(1);
		}, delay);

		return () => clearTimeout(timeoutId);
	});

	const handleClick = () => {
		navigate(`spots/${id}`);
	};

	const styles = { opacity: opacity, transform: `translateY(${translate}px) scale(${scale})` };

	return (
		<>
			<div
				className="spot-card"
				onClick={handleClick}
				style={styles}
			>
				<div className="image-container" ref={ref}>
					<img src={previewImage} alt={description} className="spot-image" />
				</div>
				<span className="details">
					<strong>{city}, </strong>
					{state}
				</span>
				<span className="rating">
					<FaRegStar />
					{typeof avgStarRating === "number"
						? avgStarRating.toFixed(1)
						: avgStarRating}
				</span>
				<span className="price">
					<strong>${price}</strong> night
				</span>
			</div>
			{tooltipBool && (
				<div
					className="tooltip"
					style={{ top: mousePosition.y + 20, left: mousePosition.x + 10 }}
				>
					<strong>{name}</strong>, {city}
				</div>
			)}
		</>
	);
}
