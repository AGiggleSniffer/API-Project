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
				<h3 id="spot-name">{spot.name}</h3>
				<h4 id="spot-location">{`${spot.city}, ${spot.state}, ${spot.country}`}</h4>
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
				<span id="host">
					<h3 >{`Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`}</h3>
					<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos, excepturi, architecto ad incidunt enim reiciendis eius quibusdam quisquam corrupti, aperiam vitae suscipit. Quam animi asperiores sunt nemo quisquam commodi velit. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus distinctio est deleniti cupiditate libero? Ipsum, atque ullam temporibus, vel voluptatibus impedit hic sapiente quasi numquam nobis quisquam, distinctio quam maxime. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas officia voluptate expedita recusandae architecto error mollitia reiciendis velit? Veritatis ullam placeat similique aspernatur laudantium optio nobis modi porro mollitia ducimus?</p>
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
