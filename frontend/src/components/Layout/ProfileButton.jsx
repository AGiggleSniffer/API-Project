import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars } from "react-icons/fa";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "../OpenModalMenuItem";
import LoginForm from "../LoginForm";
import SignupForm from "../SignupForm";
import "./ProfileButton.css";

export default function ProfileButton({ user }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showMenu, setShowMenu] = useState(false);
	const ulRef = useRef();

	const toggleMenu = (e) => {
		e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
		setShowMenu(!showMenu);
	};

	useEffect(() => {
		if (!showMenu) return;

		const closeMenu = (e) => {
			if (!ulRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		};

		document.addEventListener("click", closeMenu);

		return () => document.removeEventListener("click", closeMenu);
	}, [showMenu]);

	const closeMenu = () => setShowMenu(false);

	const logout = (e) => {
		e.preventDefault();
		dispatch(sessionActions.logout());
		closeMenu();
		navigate("/");
	};

	const manageSpots = () => {
		closeMenu();
		navigate("spots/current")
	}

	const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
	const buttonClassName = "profile-button" + (showMenu ? " menu-open" : "");

	return (
		<>
			{user && (
				<span onClick={() => navigate("spots/new")} id="create-spot">
					Create A New Spot
				</span>
			)}
			<button className={buttonClassName} onClick={toggleMenu}>
				<FaBars />
				<FaUserCircle />
			</button>
			<menu className={ulClassName} ref={ulRef}>
				{user ? (
					<>
						<li>
							Hello, {user.firstName} {user.lastName}
						</li>
						<li>{user.email}</li>
						<li id="manage-spots" onClick={manageSpots}>
							Manage Spots
						</li>
						<li>
							<button onClick={logout}>Log Out</button>
						</li>
					</>
				) : (
					<>
						<OpenModalMenuItem
							itemText="Log In"
							onItemClick={closeMenu}
							modalComponent={<LoginForm />}
						/>
						<OpenModalMenuItem
							itemText="Sign Up"
							onItemClick={closeMenu}
							modalComponent={<SignupForm />}
						/>
					</>
				)}
			</menu>
		</>
	);
}
