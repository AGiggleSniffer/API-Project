import {useEffect, useRef, useState} from "react"
import { useModal } from "../../context/Modal";

function OpenModalButton({
	modalComponent, // component to render inside the modal
	buttonText, // text of the button that opens the modal
	onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
	onModalClose, // optional: callback function that will be called once the modal is closed
}) {
	const { setModalContent, setOnModalClose } = useModal();
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const ref = useRef();

	const onClick = () => {
		if (onModalClose) setOnModalClose(onModalClose);
		setModalContent(modalComponent);
		if (typeof onButtonClick === "function") onButtonClick();
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
		<button
			onClick={onClick}
			ref={ref}
			className="red"
			style={{
				backgroundImage: `radial-gradient( circle at ${mousePosition.x}px ${mousePosition.y}px, var(--Light-Red), var(--Red) 60% )`,
			}}
		>
			{buttonText}
		</button>
	);
}

export default OpenModalButton;
