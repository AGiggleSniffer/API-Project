import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteASpotById } from "../../store/spot";
import useMouse from "../../hooks/useMouse";

export default function DeleteSpotForm({ spotId }) {
	const dispatch = useDispatch();
	const { closeModal } = useModal();
	const ref = useRef();
	const mousePosition = useMouse(ref);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			dispatch(deleteASpotById(spotId));
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
				<h3>Are you sure you want to delete this spot from the listing?</h3>
				<button
					type="submit"
					className="red"
					ref={ref}
					style={{
						backgroundImage: `radial-gradient( circle at ${mousePosition.xOffset}px ${mousePosition.yOffset}px, var(--Light-Red), var(--Red) 60% )`,
					}}
				>
					Yes (Delete Spot)
				</button>
				<button type="button" onClick={closeModal} className="grey">
					No (Keep Spot)
				</button>
			</form>
		</>
	);
}
