import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addANewSpot, findASpotById, updateSpotById } from "../../store/spot";
import ErrorDisplay from "../ErrorDisplay";
import "./CreateSpotForm.css";
import useMouse from "../../hooks/useMouse";

export default function CreateSpotForm() {
	const { id: paramId } = useParams();
	const spot = useSelector((state) =>
		paramId ? state.spots.detailedSpots[paramId] : null,
	);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const ref = useRef();
	const mousePosition = useMouse(ref);
	const [country, setCountry] = useState("");
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [lat, setLatitude] = useState("");
	const [lng, setLongitude] = useState("");
	const [description, setDescription] = useState("");
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [images, setImages] = useState(["", "", "", "", ""]);
	const [validationErrors, setValidationErrors] = useState({});

	useEffect(() => {
		if (!paramId) return;
		dispatch(findASpotById(paramId));
	}, [dispatch, paramId]);

	useEffect(() => {
		if (!spot) return;
		setCountry(spot?.country);
		setAddress(spot?.address);
		setCity(spot?.city);
		setState(spot?.state);
		setLatitude(spot?.lat.toString());
		setLongitude(spot?.lng.toString());
		setDescription(spot?.description);
		setName(spot?.name);
		setPrice(spot?.price);
		setImages([
			spot?.SpotImages[0]?.url || "",
			spot?.SpotImages[1]?.url || "",
			spot?.SpotImages[2]?.url || "",
			spot?.SpotImages[3]?.url || "",
			spot?.SpotImages[4]?.url || "",
		]);
	}, [spot]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const errors = {};
		if (description.length < 30)
			errors.description = "Description needs a minimum of 30 characters";
		if (!country.length) errors.country = "Country is required";
		if (!address.length) errors.address = "Address is required";
		if (!city.length) errors.city = "City is required";
		if (!state.length) errors.state = "State is required";
		if (!lat.length) errors.lat = "Latitude is required";
		if (!lng.length) errors.lng = "Longitude is required";
		if (!name.length) errors.name = "Title is required";
		if (!price) errors.price = "Price is required";
		if (!images[0]) errors.preview = "Preview image is required";

		images.forEach((img, i) => {
			if (
				img.endsWith(".jpeg") ||
				img.endsWith(".jpg") ||
				img.endsWith(".png")
			) {
				return;
			} else if (img) {
				if (!errors.images) errors.images = {};
				errors.images[i] = "Image URL must end in .png, .jpg, or .jpeg";
			}
		});

		if (Object.keys(errors).length) return setValidationErrors(errors);

		const payload = {
			address,
			city,
			state,
			country,
			lat,
			lng,
			name,
			description,
			price,
		};

		try {
			let id;
			const reverseImages = images.reverse();
			if (spot?.id) {
				id = await dispatch(updateSpotById(spot, payload, reverseImages));
			} else {
				id = await dispatch(addANewSpot(payload, reverseImages));
			}
			return navigate(`/spots/${id}`);
		} catch (err) {
			const msg = await err.json();
			return setValidationErrors(msg.errors);
		}
	};

	const handleImageState = (imageId) => (e) =>
		setImages((state) => {
			const newArr = [...state];
			newArr[imageId] = e.target.value;
			return newArr;
		});

	return (
		<div id="create-spot-form">
			<h2>{spot ? "Update your Spot" : "Create A New Spot"}</h2>
			<form className="modal-form" onSubmit={handleSubmit}>
				<span>
					<h3>Where&apos;s your place located?</h3>
					<h4>
						Guests will only get your exact address once they&apos;ve booked a
						reservation.
					</h4>
					<input
						type="text"
						placeholder="Country"
						value={country}
						onChange={(e) => setCountry(e.target.value)}
					/>
					{validationErrors?.country && (
						<ErrorDisplay msg={validationErrors.country} />
					)}
					<input
						type="text"
						placeholder="Address"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
					{validationErrors?.address && (
						<ErrorDisplay msg={validationErrors.address} />
					)}
					<input
						type="text"
						placeholder="City"
						value={city}
						onChange={(e) => setCity(e.target.value)}
					/>
					{validationErrors?.city && (
						<ErrorDisplay msg={validationErrors.city} />
					)}
					<input
						type="text"
						placeholder="STATE"
						value={state}
						onChange={(e) => setState(e.target.value)}
					/>
					{validationErrors?.state && (
						<ErrorDisplay msg={validationErrors.state} />
					)}
					<input
						type="number"
						placeholder="Latitude"
						value={lat}
						onChange={(e) => setLatitude(e.target.value)}
					/>
					{validationErrors?.lat && (
						<ErrorDisplay msg={validationErrors?.lat} />
					)}
					<input
						type="number"
						placeholder="Longitude"
						value={lng}
						onChange={(e) => setLongitude(e.target.value)}
					/>
					{validationErrors?.lng && (
						<ErrorDisplay msg={validationErrors?.lng} />
					)}
				</span>
				<span>
					<h3>Describe your place to guests</h3>
					<h4>
						Mention the best features of your space, any ameneties like fast
						Wi-Fi or parking, and what you love about the neighborhood.
					</h4>
					<textarea
						rows="8"
						placeholder="Please write at lease 30 characters"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					{validationErrors?.description && (
						<ErrorDisplay msg={validationErrors.description} />
					)}
				</span>
				<span>
					<h3>Create a title for your spot</h3>
					<h4>
						Catch guests&apos; attention with a spot title that highlights what
						makes your spot special.
					</h4>
					<input
						type="text"
						placeholder="Name of your spot"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					{validationErrors?.name && (
						<ErrorDisplay msg={validationErrors.name} />
					)}
				</span>
				<span>
					<h3>Set a base price for your spot</h3>
					<h4>
						Competitive pricing can help your listing stand out and rank higher
						in search results.
					</h4>
					<input
						type="number"
						placeholder="$ Price per night (USD)"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>
					{validationErrors?.price && (
						<ErrorDisplay msg={validationErrors.price} />
					)}
				</span>
				<span>
					<h3>Liven up your spot with photos</h3>
					<h4>Submit a link to at least one photo to publish your spot.</h4>
					<input
						type="url"
						placeholder="Preview Image URL"
						value={images[0]}
						onChange={handleImageState(0)}
					/>
					{validationErrors?.preview && (
						<ErrorDisplay msg={validationErrors.preview} />
					)}
					{validationErrors?.images && validationErrors.images[0] && (
						<ErrorDisplay msg={validationErrors.images[0]} />
					)}
					<input
						type="url"
						placeholder="Image URL"
						value={images[1]}
						onChange={handleImageState(1)}
					/>
					{validationErrors?.images && validationErrors.images[1] && (
						<ErrorDisplay msg={validationErrors.images[1]} />
					)}
					<input
						type="url"
						placeholder="Image URL"
						value={images[2]}
						onChange={handleImageState(2)}
					/>
					{validationErrors?.images && validationErrors.images[2] && (
						<ErrorDisplay msg={validationErrors.images[2]} />
					)}
					<input
						type="url"
						placeholder="Image URL"
						value={images[3]}
						onChange={handleImageState(3)}
					/>
					{validationErrors?.images && validationErrors.images[3] && (
						<ErrorDisplay msg={validationErrors.images[3]} />
					)}
					<input
						type="url"
						placeholder="Image URL"
						value={images[4]}
						onChange={handleImageState(4)}
					/>
					{validationErrors?.images && validationErrors.images[4] && (
						<ErrorDisplay msg={validationErrors.images[4]} />
					)}
				</span>
				<button
					type="submit"
					ref={ref}
					className="red"
					style={{
						backgroundImage: `radial-gradient( circle at ${mousePosition.xOffset}px ${mousePosition.yOffset}px, var(--Light-Red), var(--Red) 60% )`,
					}}
				>
					Create Spot
				</button>
			</form>
		</div>
	);
}
