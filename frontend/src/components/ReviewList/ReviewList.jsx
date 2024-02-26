import "./ReviewList.css";
import ReviewCard from "./ReviewCard";

export default function ReviewList({ reviews, spot, user }) {
	return (
		<>
			{reviews?.map((review, i) => {
				return (
					<ReviewCard
						key={review.id}
						review={review}
						spotId={spot?.id}
						userId={user?.id}
						delay={120 * i}
					/>
				);
			})}
		</>
	);
}
