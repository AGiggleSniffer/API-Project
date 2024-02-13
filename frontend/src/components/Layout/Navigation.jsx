import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaAirbnb } from "react-icons/fa";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

export default function Navigation({ isLoaded }) {
	const sessionUser = useSelector((state) => state.session.user);
	const navigate = useNavigate();
	const handleClick = () => navigate("/");

	return (
		<nav>
			<span className="logo" onClick={handleClick}>
				<FaAirbnb />
				Book&Stay
			</span>
			{isLoaded && (
				<span>
					<ProfileButton user={sessionUser} />
				</span>
			)}
		</nav>
	);
}
