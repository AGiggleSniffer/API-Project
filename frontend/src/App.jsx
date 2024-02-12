import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import SpotsList from "./components/SpotsList";

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <SpotsList />,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
