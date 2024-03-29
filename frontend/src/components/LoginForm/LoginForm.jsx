import { useState, useEffect, useRef } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import ErrorDisplay from "../ErrorDisplay";
import "./LoginForm.css";
import useMouse from "../../hooks/useMouse";

export default function LoginForm() {
	const ref = useRef();
	const mousePosition = useMouse(ref);
	const dispatch = useDispatch();
	const { closeModal } = useModal();
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [disabled, setDisabled] = useState(true);
	const [errors, setErrors] = useState({});

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
		setCredential("FakeUser2");
		setPassword("password3");
	};

	useEffect(() => {
		if (credential.length < 4 || password.length < 6) setDisabled(true);
		else setDisabled(false);
	}, [credential, password]);

	return (
		<>
			<h1 className="form-header">Log In</h1>
			<form className="modal-form" onSubmit={handleSubmit}>
				<strong>Welcome Back</strong>
				{errors.credential && <ErrorDisplay msg={errors.credential} />}
				<input
					placeholder="Username or Email"
					type="text"
					value={credential}
					onChange={(e) => setCredential(e.target.value)}
				/>
				<input
					placeholder="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button
					type="submit"
					disabled={disabled}
					ref={ref}
					className="red"
					style={{
						backgroundImage: `radial-gradient( circle at ${mousePosition.xOffset}px ${mousePosition.yOffset}px, var(--Light-Red), var(--Red) 60% )`,
					}}
				>
					Log In
				</button>
				<button
					type="submit"
					onClick={loginDemo}
					className="grey"
				>
					Demo User
				</button>
			</form>
		</>
	);
}
