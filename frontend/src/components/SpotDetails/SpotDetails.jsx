import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FaRegStar } from "react-icons/fa";
import { findASpotById, selectSpot } from "../../store/spot";
import { selectReviewsArray } from "../../store/review";
import ReviewList from "../ReviewList";
import ReviewForm from "../ReviewForm";
import OpenModalButton from "../OpenModalButton";
import ReserveButton from "./ReserveButton";
import "./SpotDetails.css";

export default function SpotDetails() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const spot = useSelector(selectSpot(id));
	const reviews = useSelector(selectReviewsArray);
	const sessionUser = useSelector((state) => state.session.user);
	const allowSpotReview = sessionUser && spot?.Owner.id !== sessionUser?.id;
	const ownReview = useMemo(
		() => reviews?.find((review) => review.User.id === sessionUser?.id),
		[reviews, sessionUser],
	);

	useEffect(() => {
		dispatch(findASpotById(id));
	}, [dispatch, id]);

	console.log(spot?.Owner.id, sessionUser?.id);

	return (
		<div id="details">
			<div id="detail-header">
				<h3 id="spot-name">{spot?.name ? spot.name : `Spot doesnt Exist for ID: ${id}`}</h3>
				<h4 id="spot-location">{`${spot?.city}, ${spot?.state}, ${spot?.country}`}</h4>
			</div>
			<div id="image-board">
				<span id="main-image">
					<img src={spot?.SpotImages[0]?.url} />
				</span>
				<span>
					<img src={spot?.SpotImages[1]?.url} />
				</span>
				<span>
					<img src={spot?.SpotImages[2]?.url} />
				</span>
				<span>
					<img src={spot?.SpotImages[3]?.url} />
				</span>
				<span>
					<img src={spot?.SpotImages[4]?.url} />
				</span>
			</div>
			<div id="reserve">
				<span id="host">
					<h3>
						Hosted By {spot?.Owner.firstName} {spot?.Owner.lastName}
					</h3>
					<p>{spot?.description}</p>
				</span>
				<span id="reserve-button-container">
					<ReserveButton spotId={id} />
				</span>
			</div>
			<div id="review-container">
				{isNaN(spot?.avgStarRating) ? (
					<>
						<h3>
							<FaRegStar className="star" />
							{spot?.avgStarRating}
						</h3>
						{allowSpotReview && (
							<>
								<OpenModalButton
									buttonText="Post Your Review"
									modalComponent={<ReviewForm spotId={spot?.id} />}
								/>
								<h4>Be the first to post a review!</h4>
							</>
						)}
					</>
				) : (
					<>
						<h3>
							<FaRegStar className="star" />
							{spot?.avgStarRating.toFixed(1)} - {spot?.numReviews} review
							{spot?.numReviews > 1 ? "s" : null}
						</h3>
						{allowSpotReview && !ownReview && (
							<OpenModalButton
								buttonText="Post Your Review"
								modalComponent={<ReviewForm spotId={spot?.id} />}
							/>
						)}
						<ReviewList spotId={spot?.id} />
					</>
				)}
			</div>
		</div>
	);
}
