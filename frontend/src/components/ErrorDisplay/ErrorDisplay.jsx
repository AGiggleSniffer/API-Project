import { FaCircleXmark } from "react-icons/fa6";

export default function ErrorDisplay({ msg }) {
	return (
		<div>
			<FaCircleXmark />
			<p>{msg}</p>
		</div>
	);
}
