import { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

export default function LoginForm() {
	const dispatch = useDispatch();
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const { closeModal } = useModal();

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrors({});
		return dispatch(sessionActions.login({ credential, password }))
			.then(closeModal)
			.catch(async (res) => {
				const data = await res.json();
				if (data && data.errors) {
					setErrors(data.errors);
				}
			});
	};

	useEffect(() => {
		const updateMousePos = (e) =>
			setMousePosition({ x: e.offsetX, y: e.offsetY });
		window.addEventListener("mousemove", updateMousePos);
		return () => window.removeEventListener("mousemove", updateMousePos);
	}, []);

	return (
		<>
			<h1 className="form-header">Log In</h1>
			<form onSubmit={handleSubmit}>
				<strong>Welcome Back</strong>
				<input
					placeholder="Username or Email"
					type="text"
					value={credential}
					onChange={(e) => setCredential(e.target.value)}
					required
				/>
				<input
					placeholder="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				{errors.credential && <p>{errors.credential}</p>}
				<button
					type="submit"
					style={{
						backgroundImage: `radial-gradient( circle at ${mousePosition.x}px ${mousePosition.y}px, var(--Light-Red), var(--Red) 60% )`,
					}}
				>
					Log In
				</button>
			</form>
		</>
	);
}
