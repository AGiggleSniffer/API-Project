import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReviewById } from "../../store/review";
import useMouse from "../../hooks/useMouse";

export default function DeleteReviewForm({ reviewId, spotId, reviewRating }) {
	const dispatch = useDispatch();
	const { closeModal } = useModal();
	const ref = useRef();
	const mousePosition = useMouse(ref);
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await dispatch(deleteReviewById(reviewId, spotId, reviewRating));
			closeModal();
		} catch (err) {
			const msg = await err.json();
			console.error(msg);
		}
	};

	return (
		<>
			<h1 className="form-header">Confirm Delete</h1>
			<form className="modal-form" onSubmit={handleSubmit}>
				<h3>Are you sure you want to delete this review?</h3>
				<button
					type="submit"
					className="red"
					ref={ref}
					style={{
						backgroundImage: `radial-gradient( circle at ${mousePosition.xOffset}px ${mousePosition.yOffset}px, var(--Light-Red), var(--Red) 60% )`,
					}}
				>
					Yes (Delete Review)
				</button>
				<button type="button" onClick={closeModal} className="grey">
					No (Keep Review)
				</button>
			</form>
		</>
	);
}
