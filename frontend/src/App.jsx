import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import SpotsList from "./components/SpotsList";
import SpotDetails from "./components/SpotDetails";
import CreateSpotForm from "./components/CreateSpotForm";
import OwnedSpots from "./components/OwnedSpots";

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <SpotsList />,
			},
			{
				path: "spots/:id",
				element: <SpotDetails />,
			},
			{
				path: "spots/new",
				element: <CreateSpotForm />,
			},
			{
				path: "spots/current",
				element: <OwnedSpots />,
			},
			{
				path: "spots/:id/edit",
				element: <CreateSpotForm />,
			},
		],
	},
	{
		path: "*",
		element: <Navigate to="/" replace={true} />,
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
