import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Layout from "./components/Layout";

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <h1>Welcome!</h1>,
			},
			{
				path: "/login",
				element: <LoginForm />,
			},
			{
				path: "/signup",
				element: <SignupForm />,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
