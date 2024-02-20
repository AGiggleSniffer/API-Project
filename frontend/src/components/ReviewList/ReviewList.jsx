import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadReviewsById, selectReviewsArray } from "../../store/review";
import "./ReviewList.css";

export default function ReviewList({ spotId }) {
	const ref = useRef();
	const dispatch = useDispatch();
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const reviews = useSelector(selectReviewsArray);
	const user = useSelector((state) => state.session.user);

	useEffect(() => {
		dispatch(loadReviewsById(spotId));
	}, [dispatch, spotId]);

	useEffect(() => {
		if (!ref.current) return;
		const updateMousePos = (e) => {
			setMousePosition({ x: e.offsetX, y: e.offsetY });
		};
		const buttonRef = ref.current;
		buttonRef.addEventListener("mousemove", updateMousePos);
		return () => {
			buttonRef.removeEventListener("mousemove", updateMousePos);
		};
	}, []);

	return (
		<>
			{reviews?.map((review) => {
				const { id, User, updatedAt, review: msg } = review;
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
							<button
								ref={ref}
								className="review-delete"
								style={{
									backgroundImage: `radial-gradient( circle at ${mousePosition.x}px ${mousePosition.y}px, var(--Light-Red), var(--Red) 60% )`,
								}}
							>
								Delete
							</button>
						)}
					</div>
				);
			})}
		</>
	);
}
