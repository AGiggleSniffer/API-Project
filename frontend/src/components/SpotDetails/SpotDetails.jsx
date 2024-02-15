import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
import { findASpotById, selectSpot } from "../../store/spot";
import "./SpotDetails.css";

export default function SpotDetails() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const spot = useSelector(selectSpot(id));

	useEffect(() => {
		dispatch(findASpotById(id));
	}, [dispatch, id]);

	if (!spot) return <h2>No Spot Exists for ID: {id}</h2>;
	return (
		<div id="details">
			<div id="detail-header">
				<h2 id="spot-name">{spot.name}</h2>
				<h3 id="spot-location">{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>
			</div>
			<div id="image-board">
				<span id="main-image">
					<img src={spot.SpotImages[0]?.url} />
				</span>
				<span>
					<img src={spot.SpotImages[0]?.url} />
				</span>
				<span>
					<img src={spot.SpotImages[0]?.url} />
				</span>
				<span>
					<img src={spot.SpotImages[0]?.url} />
				</span>
				<span>
					<img src={spot.SpotImages[0]?.url} />
				</span>
			</div>
			<div id="reserve">
				<span>
					<h2 id="host">{`Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`}</h2>
				</span>
				<span id="reserve-button-container">
					<span>${spot.price} night</span>
					<span id="reserve-details">
						<FaRegStar />
						{spot.avgStarRating} - {spot.numReviews} reviews
					</span>
					<button id="reserve-button">Reserve</button>
				</span>
			</div>
			<div id="review-container">
				<span>reviews</span>
			</div>
		</div>
	);
}
