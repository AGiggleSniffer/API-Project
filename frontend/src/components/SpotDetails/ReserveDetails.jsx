import { FaRegStar } from "react-icons/fa";

export default function ReserveDetails({ avgRating, numReviews }) {

	

	return (
		<span id="reserve-details">
			<FaRegStar />
			{isNaN(avgRating) ? avgRating : avgRating.toFixed(1)} - {numReviews}{" "}
			reviews
		</span>
	);
}
