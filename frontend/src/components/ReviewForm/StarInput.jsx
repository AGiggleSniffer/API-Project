import { useState } from "react";
import { FaRegStar } from "react-icons/fa";
import "./StarInput.css";

export default function StarInput({ setStarVal }) {
	const [starOne, setStarOne] = useState("empty");
	const [starTwo, setStarTwo] = useState("empty");
	const [starThree, setStarThree] = useState("empty");
	const [starFour, setStarFour] = useState("empty");
	const [starFive, setStarFive] = useState("empty");

	const handleClick = (setter, value) => () => {
		setStarOne("empty");
		setStarTwo("empty");
		setStarThree("empty");
		setStarFour("empty");
		setStarFive("empty");

		setter((state) => (state === "empty" ? "filled" : "empty"));
		setStarVal(value);
	};

	return (
		<span id="star-input">
			<span className={starOne} onClick={handleClick(setStarOne, 1)}>
				<FaRegStar />
			</span>
			<span className={starTwo} onClick={handleClick(setStarTwo, 2)}>
				<FaRegStar />
			</span>
			<span className={starThree} onClick={handleClick(setStarThree, 3)}>
				<FaRegStar />
			</span>
			<span className={starFour} onClick={handleClick(setStarFour, 4)}>
				<FaRegStar />
			</span>
			<span className={starFive} onClick={handleClick(setStarFive, 5)}>
				<FaRegStar />
			</span>
			Stars
		</span>
	);
}
