import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginForm from "../LoginForm";
import SignupForm from "../SignupForm";
import "./Navigation.css";

export default function Navigation({ isLoaded }) {
	const sessionUser = useSelector((state) => state.session.user);

	const sessionLinks = sessionUser ? (
		<li>
			<ProfileButton user={sessionUser} />
		</li>
	) : (
		<>
			<li>
				<OpenModalButton buttonText="Log In" modalComponent={<LoginForm />} />
			</li>
			<li>
				<OpenModalButton buttonText="Sign Up" modalComponent={<SignupForm />} />
			</li>
		</>
	);

	return (
		<ul>
			<li>
				<NavLink to="/">Home</NavLink>
			</li>
			{isLoaded && sessionLinks}
		</ul>
	);
}
