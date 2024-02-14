import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { findASpotById, selectSpot } from "../../store/spot";
import "./SpotDetails.css"

export default function SpotDetails() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const spot = useSelector(selectSpot(id));

	useEffect(() => {
		dispatch(findASpotById(id));
	}, [dispatch, id]);

	return (
		<>
			<h2 id="spot-name">{spot?.name}</h2>
			<h3 id="spot-location">{`${spot?.city}, ${spot.state}, ${spot.country}`}</h3>
			<div id="image-board">
				<img id="main-image"></img>
				<img></img>
				<img></img>
				<img></img>
				<img></img>
			</div>
			<h2 id="host">{`Hosted by ${spot?.Owner.firstName} ${spot?.Owner.lastName}`}</h2>
			<div id="reserve">
				<span>{spot?.price}</span>
				<span>reviews</span>
				<button>Reserve</button>
			</div>
			<br></br>
			<div id="review-container">
				<span>reviews</span>
			</div>
		</>
	);
}
