import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadReviewsById, selectReviewsArray } from "../../store/review";
import "./ReviewList.css";
import ReviewCard from "./ReviewCard";

export default function ReviewList({ spotId }) {
	const dispatch = useDispatch();
	const reviews = useSelector(selectReviewsArray);
	const user = useSelector((state) => state.session.user);

	useEffect(() => {
		dispatch(loadReviewsById(spotId));
	}, [dispatch, spotId]);

	return (
		<>
			{reviews?.map((review, i) => {
				return (
					<ReviewCard
						key={review.id}
						review={review}
						spotId={spotId}
						userId={user?.id}
						delay={120 * i}
					/>
				);
			})}
		</>
	);
}
