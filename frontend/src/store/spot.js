import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";
import { spotsLoading, spotsSuccess } from "./uiState";

const LOAD_SPOTS = "spots/loadSpots";
const LOAD_CURR = "spots/currSpots";
const ADD_SPOT_ID = "spots/addSpotById";
const UPDATE_SPOT = "spots/updateSpot";
const DELETE_SPOT = "spots/deleteSpot";
const UPDATE_REVIEWS = "spots/updateReviews";
const DELETE_REVIEW = "spots/deleteReview";

const loadSpots = (spots) => ({
	type: LOAD_SPOTS,
	payload: spots,
});

const currSpots = (spots) => ({
	type: LOAD_CURR,
	payload: spots,
});

const addSpotById = (spot) => ({
	type: ADD_SPOT_ID,
	payload: spot,
});

const deleteSpot = (spotId) => ({
	type: DELETE_SPOT,
	payload: spotId,
});

export const updateReviews = (spotId, stars) => ({
	type: UPDATE_REVIEWS,
	payload: { spotId, stars },
});

export const deleteReviewFromSpot = (spotId, reviewRating) => ({
	type: DELETE_REVIEW,
	payload: { spotId, reviewRating },
});

//
// THUNK
//

export const loadAllSpots = () => async (dispatch) => {
	dispatch(spotsLoading());
	const response = await csrfFetch("/api/spots");

	const spots = await response.json();
	dispatch(loadSpots(spots));
	dispatch(spotsSuccess());
	return spots;
};

export const loadCurrSpots = () => async (dispatch) => {
	dispatch(spotsLoading());
	const response = await csrfFetch(`/api/spots/current`);

	const spots = await response.json();
	dispatch(currSpots(spots));
	dispatch(spotsSuccess());
	return spots;
};

export const findASpotById = (id) => async (dispatch) => {
	const response = await csrfFetch(`/api/spots/${id}`);

	const spot = await response.json();
	dispatch(addSpotById(spot));
	return spot;
};

export const addANewSpot = (spot, images) => async () => {
	const response = await csrfFetch(`/api/spots`, {
		method: "POST",
		body: JSON.stringify(spot),
	});

	const { id } = await response.json();

	images.forEach(async (img) => {
		if (img) {
			await csrfFetch(`/api/spots/${id}/images`, {
				method: "POST",
				body: JSON.stringify({ url: img, preview: true }),
			});
		}
	});

	return id;
};

export const updateSpotById = (spot, payload, images) => async () => {
	const { id, SpotImages } = spot;
	await csrfFetch(`/api/spots/${id}`, {
		method: "PUT",
		body: JSON.stringify(payload),
	});

	await SpotImages.forEach(async (img) => {
		await csrfFetch(`/api/spot-images/${img.id}`, {
			method: "DELETE",
		});
	});

	await images.forEach(async (img) => {
		if (img) {
			await csrfFetch(`/api/spots/${id}/images`, {
				method: "POST",
				body: JSON.stringify({ url: img, preview: true }),
			});
		}
	});

	return id;
};

export const deleteASpotById = (id) => async (dispatch) => {
	const response = await csrfFetch(`/api/spots/${id}`, { method: "DELETE" });

	const msg = await response.json();
	dispatch(deleteSpot(id));
	return msg;
};

//
// SELECTORS
//

export const selectAllSpots = (state) => {
	return state.spots.allSpots;
};

export const selectSpot = (id) => (state) => {
	return state.spots.detailedSpots[id] || undefined;
};

export const selectSpotsArray = createSelector(selectAllSpots, (spots) => {
	return Object.values(spots);
});

export const selectCurrSpots = (state) => {
	return state.spots.currentSpots;
};

export const selectCurrSpotsArr = createSelector(selectCurrSpots, (spots) => {
	return Object.values(spots);
});

const initialState = {
	allSpots: {},
	detailedSpots: {},
	currentSpots: {},
};

export default function spotsReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD_SPOTS:
			return {
				...state,
				allSpots: { ...state.allSpots, ...action.payload.Spots },
			};
		case LOAD_CURR: {
			const newObj = { ...state, currentSpots: {} };
			action.payload.Spots.forEach(
				(spot) => (newObj.currentSpots[spot.id] = spot),
			);
			return newObj;
		}
		case ADD_SPOT_ID:
			return {
				...state,
				detailedSpots: {
					...state.detailedSpots,
					[action.payload.id]: action.payload,
				},
			};
		case UPDATE_SPOT: {
			const newObj = { ...state, detailedSpots: { ...state.detailedSpots } };
			return newObj;
		}
		case DELETE_SPOT: {
			const newObj = { ...state, currentSpots: { ...state.currentSpots } };
			delete newObj.currentSpots[action.payload];
			return newObj;
		}
		case UPDATE_REVIEWS: {
			const { stars, spotId } = action.payload;
			const newObj = { ...state, detailedSpots: { ...state.detailedSpots } };
			const mySpot = newObj.detailedSpots[spotId];

			if (mySpot.numReviews > 0) {
				mySpot.avgStarRating =
					(mySpot.avgStarRating * mySpot.numReviews + stars) /
					(mySpot.numReviews + 1);
			} else {
				mySpot.avgStarRating = stars;
			}

			mySpot.numReviews++;
			return newObj;
		}
		case DELETE_REVIEW: {
			const { reviewRating, spotId } = action.payload;
			const newObj = { ...state, detailedSpots: {...state.detailedSpots} };
			const mySpot = newObj.detailedSpots[spotId];

			if (mySpot.numReviews - 1) {
				mySpot.avgStarRating =
					(mySpot.avgStarRating * mySpot.numReviews - reviewRating) /
					(mySpot.numReviews - 1);
			} else {
				mySpot.avgStarRating = "New!";
			}

			mySpot.numReviews--;
			return newObj;
		}
		default:
			return state;
	}
}
