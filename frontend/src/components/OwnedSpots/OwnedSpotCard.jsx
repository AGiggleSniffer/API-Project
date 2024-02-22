import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
import "./OwnedSpotCard.css";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotForm from "./DeleteSpotForm";

export default function OwnedSpotCard({ spot }) {
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

	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [tooltipBool, setTooltip] = useState(false);
	const navigate = useNavigate();
	const ref = useRef();

	useEffect(() => {
		const updateMousePos = (e) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};

		const imageContainer = ref.current;
		imageContainer.addEventListener("mousemove", updateMousePos);
		return () =>
			imageContainer.removeEventListener("mousemove", updateMousePos);
	}, [mousePosition]);

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

	const handleClick = () => {
		navigate(`/spots/${id}`);
	};

	const updateSpot = () => {
		navigate(`/spots/${id}/edit`);
	};

	return (
		<>
			<div className="spot-card">
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