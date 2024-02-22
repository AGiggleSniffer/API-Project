import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadReviewsById, selectReviewsArray } from "../../store/review";
import DeleteReviewForm from "../DeleteReviewForm";
import OpenModalButton from "../OpenModalButton";
import "./ReviewList.css";

export default function ReviewList({ spotId }) {
	const dispatch = useDispatch();
	const reviews = useSelector(selectReviewsArray);
	const user = useSelector((state) => state.session.user);

	useEffect(() => {
		dispatch(loadReviewsById(spotId));
	}, [dispatch, spotId]);

	return (
		<>
			{reviews?.map((review) => {
				const { id, User, updatedAt, review: msg, stars } = review;
				const [month, , year] = new Intl.DateTimeFormat("en-US", {
					month: "long",
					year: "numeric",
				}).formatToParts(new Date(updatedAt));

				return (
					<div className="review-card" key={id}>
						<span>{User.firstName}</span>
						<span className="review-date">
							{month.value} {year.value}
						</span>
						<span className="review-message">{msg}</span>
						{user?.id === User.id && (
							<OpenModalButton
								buttonText="Delete"
								modalComponent={
									<DeleteReviewForm
										reviewId={id}
										spotId={spotId}
										reviewRating={stars}
									/>
								}
							/>
						)}
					</div>
				);
			})}
		</>
	);
}
