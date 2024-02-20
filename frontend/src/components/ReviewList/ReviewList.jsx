import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadReviewsById } from "../../store/review";

export default function ReviewList({ spotId }) {
	const dispatch = useDispatch();
	const reviews = useSelector((state) => state.reviews.Reviews);

	useEffect(() => {
		dispatch(loadReviewsById(spotId));
	}, [dispatch, spotId]);

	return (
		<>
			{reviews?.map((review) => {
				const { id, User, updatedAt, review: msg } = review;
				const [month, , year] = new Intl.DateTimeFormat("en-US", {
					month: "long",
					year: "numeric",
				}).formatToParts(new Date(updatedAt));
				return (
					<span key={id}>
						<p>{User.firstName}</p>
						<p>
							{month.value} {year.value}
						</p>
						<p>{msg}</p>
					</span>
				);
			})}
		</>
	);
}
