import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import ErrorDisplay from "../ErrorDisplay";
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
	const ref = useRef();

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

		const buttonRef = ref.current;
		buttonRef.addEventListener("mousemove", updateMousePos);
		return () => buttonRef.removeEventListener("mousemove", updateMousePos);
	}, []);

	return (
		<>
			<h1 className="form-header">Sign Up</h1>
			<form className="modal-form" onSubmit={handleSubmit}>
				<strong>Welcome to AirBnB</strong>
				{errors.email && <ErrorDisplay msg={errors.email} />}
				<input
					placeholder="Email"
					type="text"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				{errors.username && <ErrorDisplay msg={errors.username} />}
				<input
					placeholder="Username"
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				{errors.firstName && <ErrorDisplay msg={errors.firstName} />}
				<input
					placeholder="First Name"
					type="text"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
				/>
				{errors.lastName && <ErrorDisplay msg={errors.lastName} />}
				<input
					placeholder="Last Name"
					type="text"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
				/>
				{errors.password && <ErrorDisplay msg={errors.lastName} />}
				<input
					placeholder="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				{errors.confirmPassword && (
					<ErrorDisplay msg={errors.confirmPassword} />
				)}
				<input
					placeholder="Confirm Password"
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
				<button
					type="submit"
					disabled={disabled}
					ref={ref}
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
