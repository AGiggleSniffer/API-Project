import "./SpotCard.css";
import { FaRegStar } from "react-icons/fa";

export default function SpotCard({ spot }) {
	const { city, state, avgStarRating, price, previewImage, description } = spot;
	return (
		<div className="spot-card">
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
	);
}
