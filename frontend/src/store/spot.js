import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

const LOADING_SPOTS = "spots/loading";
const LOADING_SUCCESS = "spots/success";
const LOAD_SPOTS = "spots/loadSpots";
const LOAD_CURR = "spots/currSpots";
const ADD_SPOT_ID = "spots/addSpotById";
const UPDATE_SPOT = "spots/updateSpot";
const DELETE_SPOT = "spots/deleteSpot";
const DELETE_REVIEW = "spots/deleteReview";

const loading = () => ({ type: LOADING_SPOTS });
const loadingSuccess = () => ({ type: LOADING_SUCCESS });

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

export const deleteReviewFromSpot = (spotId, reviewRating) => ({
	type: DELETE_REVIEW,
	payload: { spotId, reviewRating },
});

//
// THUNK
//

export const loadAllSpots = () => async (dispatch) => {
	dispatch(loading());
	const response = await csrfFetch("/api/spots");

	const spots = await response.json();
	dispatch(loadSpots(spots));
	dispatch(loadingSuccess());
	return spots;
};

export const loadCurrSpots = () => async (dispatch) => {
	dispatch(loading());
	const response = await csrfFetch(`/api/spots/current`);

	const spots = await response.json();
	dispatch(currSpots(spots));
	dispatch(loadingSuccess());
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
	console.log("BEFORE DISPATCH", id);
	dispatch(deleteSpot(id));
	console.log("WORKING");
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
	loading: false,
};

export default function spotsReducer(state = initialState, action) {
	switch (action.type) {
		case LOADING_SPOTS:
			return { ...state, loading: true };
		case LOADING_SUCCESS:
			return { ...state, loading: false };
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
			console.log(newObj);
			return newObj;
		}
		case DELETE_SPOT: {
			const newObj = { ...state, currentSpots: { ...state.currentSpots } };
			delete newObj.currentSpots[action.payload];
			return newObj;
		}
		case DELETE_REVIEW: {
			const newObj = { ...state, ...state.detailedSpots };
			const mySpot = newObj.detailedSpots[action.payload.spotId];

			if (mySpot.numReviews - 1) {
				mySpot.avgStarRating =
					(mySpot.avgStarRating * mySpot.numReviews -
						action.payload.reviewRating) /
					(mySpot.numReviews - 1);
				mySpot.numReviews--;
			} else {
				mySpot.avgStarRating = "New!";
				mySpot.numReviews = 0;
			}

			return newObj;
		}
		default:
			return state;
	}
}
