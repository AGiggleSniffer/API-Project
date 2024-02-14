import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import SpotsList from "./components/SpotsList";
import SpotDetails from "./components/SpotDetails";

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <SpotsList />,
			},
			{
				path: "spot/:id",
				element: <SpotDetails />
			}
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
