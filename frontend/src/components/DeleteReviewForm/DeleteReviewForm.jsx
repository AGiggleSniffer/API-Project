import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReviewById } from "../../store/review";

export default function DeleteReviewForm({ reviewId, spotId, reviewRating }) {
	const dispatch = useDispatch();
	const { closeModal } = useModal();
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			console.log("FORM", reviewId, spotId)
			await dispatch(deleteReviewById(reviewId, spotId, reviewRating));
			closeModal();
		} catch (err) {
            const msg = await err.json();
            console.error(msg);
		}
	};

	return (
		<>
			<h1>Confirm Delete</h1>
			<span>Are you sure you want to delete this review?</span>
			<form className="modal-form" onSubmit={handleSubmit}>
				<button type="submit" className="yes">
					Yes (Delete Review)
				</button>
				<button onClick={closeModal} className="no">
					No (Keep Review)
				</button>
			</form>
		</>
	);
}
