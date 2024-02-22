import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReviewById } from "../../store/review";

export default function DeleteReviewForm({ reviewId, spotId, reviewRating }) {
	const dispatch = useDispatch();
	const { closeModal } = useModal();
	const ref = useRef();
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
			<h1 className="form-header">Confirm Delete</h1>
			<form className="modal-form" onSubmit={handleSubmit}>
				<h3>Are you sure you want to delete this review?</h3>
				<button
					type="submit"
					className="red"
					ref={ref}
					style={{
						backgroundImage: `radial-gradient( circle at ${mousePosition.x}px ${mousePosition.y}px, var(--Light-Red), var(--Red) 60% )`,
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
