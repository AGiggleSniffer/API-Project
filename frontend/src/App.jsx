import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import SpotsList from "./components/SpotsList";
import SpotDetails from "./components/SpotDetails";
import CreateSpotForm from "./components/CreateSpotForm";

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
				element: <SpotDetails />
			},
			{
				path: "spots/new",
				element: <CreateSpotForm />
			}
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
