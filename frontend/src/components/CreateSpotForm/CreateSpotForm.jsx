import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateSpotForm.css";

export default function CreateSpotForm() {
	const [country, setCountry] = useState("");
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [description, setDescription] = useState("");
	const [title, setTitle] = useState("");
	const [price, setPrice] = useState("");
	const [images, setImages] = useState({ 0: "", 1: "", 2: "", 3: "", 4: "" });
	const [validationErrors, setValidationErrors] = useState({});
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const ref = useRef();

	useEffect(() => {
		const updateMousePos = (e) => {
			setMousePosition({ x: e.offsetX, y: e.offsetY });
		};
		const buttonRef = ref.current;
		buttonRef.addEventListener("mousemove", updateMousePos);
		return () => buttonRef.removeEventListener("mousemove", updateMousePos);
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
        const errors = {};
        if (description.length < 30) errors.description = "Description needs a minimum of 30 characters";
        
        const paylaod = {
            country,
            address,
            city,
            state,
            latitude,
            description,
            title,
            price,
            images
        }

        setValidationErrors(errors);
    };
    
    useEffect(() => {
        console.log(validationErrors)
    }, [validationErrors])

	const handleImageState = (imageId) => (e) =>
		setImages((state) => ({ ...state, [imageId]: e.target.value }));

	return (
		<div id="create-spot-form">
			<h2>Create a new Spot</h2>
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
						required
						value={country}
						onChange={(e) => setCountry(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Address"
						required
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
					<input
						type="text"
						placeholder="City"
						required
						value={city}
						onChange={(e) => setCity(e.target.value)}
					/>
					<input
						type="text"
						placeholder="STATE"
						required
						value={state}
						onChange={(e) => setState(e.target.value)}
					/>
					<input
						type="number"
						placeholder="Latitude"
						required
						value={latitude}
						onChange={(e) => setLatitude(e.target.value)}
					/>
					<input
						type="number"
						placeholder="Longitude"
						required
						value={longitude}
						onChange={(e) => setLongitude(e.target.value)}
					/>
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
						required
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
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
						required
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
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
						required
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>
				</span>
				<span>
					<h3>Liven up your spot with photos</h3>
					<h4>Submit a link to at least one photo to publish your spot.</h4>
					<input
						type="url"
						placeholder="Preview Image URL"
						required
						value={images[0]}
						onChange={handleImageState(0)}
					/>
					<input
						type="url"
						placeholder="Image URL"
						value={images[1]}
						onChange={handleImageState(1)}
					/>
					<input
						type="url"
						placeholder="Image URL"
						value={images[2]}
						onChange={handleImageState(2)}
					/>
					<input
						type="url"
						placeholder="Image URL"
						value={images[3]}
						onChange={handleImageState(3)}
					/>
					<input
						type="url"
						placeholder="Image URL"
						value={images[4]}
						onChange={handleImageState(4)}
					/>
				</span>
				<button
					type="submit"
					ref={ref}
					style={{
						backgroundImage: `radial-gradient( circle at ${mousePosition.x}px ${mousePosition.y}px, var(--Light-Red), var(--Red) 60% )`,
					}}
				>
					Create Spot
				</button>
			</form>
		</div>
	);
}
