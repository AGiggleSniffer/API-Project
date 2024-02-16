import { useState, useEffect, useRef } from "react";
import { FaCircleXmark } from "react-icons/fa6";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

export default function LoginForm() {
	const dispatch = useDispatch();
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const [disabled, setDisabled] = useState(true);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const { closeModal } = useModal();
	const ref = useRef();
	const demoref = useRef();

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrors({});
		return dispatch(sessionActions.login({ credential, password }))
			.then(closeModal)
			.catch(async (res) => {
				const data = await res.json();
				if (data && data.message) {
					setErrors({ credential: data.message });
				}
			});
	};

	const loginDemo = () => {
		setCredential("Demo-lition");
		setPassword("password");
	};

	useEffect(() => {
		if (credential.length < 4 || password.length < 6) setDisabled(true);
		else setDisabled(false);
	}, [credential, password]);

	useEffect(() => {
		const updateMousePos = (e) => {
			setMousePosition({ x: e.offsetX, y: e.offsetY });
		};
		const buttonRef = ref.current;
		const demoButton = demoref.current;
		buttonRef.addEventListener("mousemove", updateMousePos);
		demoButton.addEventListener("mousemove", updateMousePos);
		return () => {
			buttonRef.removeEventListener("mousemove", updateMousePos);
			demoButton.removeEventListener("mousemove", updateMousePos);
		};
	}, []);

	return (
		<>
			<h1 className="form-header">Log In</h1>
			<form className="modal-form" onSubmit={handleSubmit}>
				<strong>Welcome Back</strong>
				{errors.credential && (
					<div>
						<FaCircleXmark />
						<p>{errors.credential}</p>
					</div>
				)}
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
				<button
					type="submit"
					disabled={disabled}
					ref={ref}
					style={{
						backgroundImage: `radial-gradient( circle at ${mousePosition.x}px ${mousePosition.y}px, var(--Light-Red), var(--Red) 60% )`,
					}}
				>
					Log In
				</button>
				<button
					type="submit"
					onClick={loginDemo}
					className="demo"
					ref={demoref}
					style={{
						backgroundImage: `radial-gradient( circle at ${mousePosition.x}px ${mousePosition.y}px, var(--Lighter-Grey), var(--Light-Grey) 60% )`,
					}}
				>
					Demo User
				</button>
			</form>
		</>
	);
}
