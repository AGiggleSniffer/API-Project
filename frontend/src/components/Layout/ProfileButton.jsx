import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import * as sessionActions from "../../store/session";

function ProfileButton({ user }) {
	const dispatch = useDispatch();
	const [showMenu, setShowMenu] = useState(false);
	const ref = useRef();

	const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

	const logout = (e) => {
		e.preventDefault();
		dispatch(sessionActions.logout());
	};

	const toggleMenu = (e) => {
		e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
		setShowMenu(!showMenu);
	};

	useEffect(() => {
		if (!showMenu) return;

		const closeMenu = (e) => {
			if (ref.current && !ref.current.contains(e.target)) {
				setShowMenu(false);
			}
		};

		document.addEventListener("click", closeMenu);

		return () => document.removeEventListener("click", closeMenu);
	}, [showMenu]);

	return (
		<>
			<button onClick={toggleMenu}>
				<FaUserCircle />
			</button>
			<ul className={ulClassName}>
				<li>{user.username}</li>
				<li>
					{user.firstName} {user.lastName}
				</li>
				<li>{user.email}</li>
				<li>
					<button onClick={logout}>Log Out</button>
				</li>
			</ul>
		</>
	);
}

export default ProfileButton;
