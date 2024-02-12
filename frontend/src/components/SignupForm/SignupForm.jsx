import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FaCircleXmark } from "react-icons/fa6";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [disabled, setDisabled] = useState(true);
	const [errors, setErrors] = useState({});
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const { closeModal } = useModal();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			setErrors({});
			return dispatch(
				sessionActions.signup({
					email,
					username,
					firstName,
					lastName,
					password,
				}),
			)
				.then(closeModal)
				.catch(async (res) => {
					const data = await res.json();
					if (data?.errors) {
						setErrors(data.errors);
					}
				});
		}
		return setErrors({
			confirmPassword: "Passwords must match",
		});
	};

	useEffect(() => {
		if (
			username.length < 4 ||
			password.length < 6 ||
			!firstName.length ||
			!lastName.length ||
			!password.length ||
			!confirmPassword.length
		) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [username, password, firstName, lastName, confirmPassword]);

	useEffect(() => {
		const updateMousePos = (e) =>
			setMousePosition({ x: e.offsetX, y: e.offsetY });
		window.addEventListener("mousemove", updateMousePos);
		return () => window.removeEventListener("mousemove", updateMousePos);
	}, []);

	return (
		<>
			<h1 className="form-header">Sign Up</h1>
			<form onSubmit={handleSubmit}>
				<strong>Welcome to AirBnB</strong>
				{errors.email && (
					<div>
						<FaCircleXmark />
						<p>{errors.email}</p>
					</div>
				)}
				<input
					placeholder="Email"
					type="text"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				{errors.username && (
					<div>
						<FaCircleXmark />
						<p>{errors.username}</p>
					</div>
				)}
				<input
					placeholder="Username"
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				{errors.firstName && (
					<div>
						<FaCircleXmark />
						<p>{errors.firstName}</p>
					</div>
				)}
				<input
					placeholder="First Name"
					type="text"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					required
				/>
				{errors.lastName && (
					<div>
						<FaCircleXmark />
						<p>{errors.lastName}</p>
					</div>
				)}
				<input
					placeholder="Last Name"
					type="text"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					required
				/>
				{errors.password && (
					<div>
						<FaCircleXmark />
						<p>{errors.password}</p>
					</div>
				)}
				<input
					placeholder="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				{errors.confirmPassword && (
					<div>
						<FaCircleXmark />
						<p>{errors.confirmPassword}</p>
					</div>
				)}
				<input
					placeholder="Confirm Password"
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>
				<button
					type="submit"
					disabled={disabled}
					style={{
						backgroundImage: `radial-gradient( circle at ${mousePosition.x}px ${mousePosition.y}px, var(--Light-Red), var(--Red) 60% )`,
					}}
				>
					Sign Up
				</button>
			</form>
		</>
	);
}

export default SignupFormModal;
