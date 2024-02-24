import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
import "./OwnedSpotCard.css";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotForm from "./DeleteSpotForm";
import useMouse from "../../hooks/useMouse";

export default function OwnedSpotCard({ spot, delay }) {
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

	const navigate = useNavigate();
	const ref = useRef();
	const mousePosition = useMouse(ref);
	const [tooltipBool, setTooltip] = useState(false);
	const [opacity, setOpacity] = useState(0);
	const [translate, setTranslate] = useState(200);

	const handleClick = () => {
		navigate(`/spots/${id}`);
	};

	const updateSpot = () => {
		navigate(`/spots/${id}/edit`);
	};

	const styles = {
		opacity: opacity,
		transform: `translateY(${translate}px)`,
	};

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

	useEffect(() => {
		setTimeout(() => {
			setOpacity(100);
			setTranslate(0);
		}, delay);
	}, [delay]);

	return (
		<>
			<div className="spot-card" style={styles}>
				<div className="image-container" ref={ref} onClick={handleClick}>
					<img src={previewImage} alt={description} className="spot-image" />
				</div>
				<span className="details" onClick={handleClick}>
					<strong>{city}, </strong>
					{state}
				</span>
				<span className="rating" onClick={handleClick}>
					<FaRegStar />
					{typeof avgStarRating === "number"
						? avgStarRating.toFixed(1)
						: avgStarRating}
				</span>
				<span className="price" onClick={handleClick}>
					<strong>${price}</strong> night
				</span>
				<span className="current-buttons" style={{ cursor: "default" }}>
					<button className="grey" onClick={updateSpot}>
						Update
					</button>
					<OpenModalButton
						buttonText="Delete"
						modalComponent={<DeleteSpotForm spotId={spot.id} />}
					/>
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
