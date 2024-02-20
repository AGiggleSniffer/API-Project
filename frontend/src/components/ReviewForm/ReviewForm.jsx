import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { addReviewBySpotId } from "../../store/review";
import ErrorDisplay from "../ErrorDisplay";
import StarInput from "./StarInput";

export default function ReviewForm({ spotId }) {
	const ref = useRef();
	const dispatch = useDispatch();
	const { closeModal } = useModal();
	const [stars, setStars] = useState(0);
	const [review, setReview] = useState("");
	const [disabled, setDisabled] = useState(true);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [errors, setErrors] = useState({})

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await dispatch(addReviewBySpotId(spotId, { review, stars }));
			closeModal();
		} catch (err) {
			const msg = await err.json();
			setErrors(msg);
		}
	};

	useEffect(() => {
		if (review.length < 10 || stars < 1) setDisabled(true);
		else setDisabled(false);
	}, [review, stars]);

	useEffect(() => {
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
			<h1 className="form-header">How was your stay?</h1>
			<form className="modal-form" onSubmit={handleSubmit}>
				{errors?.message && <ErrorDisplay msg={errors.message} />}
				<textarea
					placeholder="Leave your review here..."
					value={review}
					onChange={(e) => setReview(e.target.value)}
				/>
				{/* <input
					type="number"
					value={stars}
					onChange={(e) => setStars(e.target.value)}
				/> */}
				<StarInput setStarVal={setStars}/>
				<button
					type="submit"
					disabled={disabled}
					ref={ref}
					style={{
						backgroundImage: `radial-gradient( circle at ${mousePosition.x}px ${mousePosition.y}px, var(--Light-Red), var(--Red) 60% )`,
					}}
				>
					Submit your Review
				</button>
			</form>
		</>
	);
}
