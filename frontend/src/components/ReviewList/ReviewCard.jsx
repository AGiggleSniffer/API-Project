import { useEffect, useState } from "react";
import DeleteReviewForm from "./DeleteReviewForm";
import OpenModalButton from "../OpenModalButton";

export default function ReviewCard({ userId, review, spotId, delay }) {
	const { id, User, updatedAt, review: msg, stars } = review;
	const [month, , year] = new Intl.DateTimeFormat("en-US", {
		month: "long",
		year: "numeric",
	}).formatToParts(new Date(updatedAt));

	const [opacity, setOpacity] = useState(0);
	const [scale, setScale] = useState(0.8);
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpacity(100);
			setScale(1);
		}, delay);

		return () => clearTimeout(timeoutId);
	}, [delay, msg]);

	const styles = {
		opacity: opacity,
		transform: `scale(${scale})`,
    };

	return (
		<div className="review-card" key={id} style={styles}>
			<span>{User.firstName}</span>
			<span className="review-date">
				{month.value} {year.value}
			</span>
			<span className="review-message">{msg}</span>
			{userId === User.id && (
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
}
