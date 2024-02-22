import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

const LOAD_SPOTS = "spots/loadSpots";
const LOAD_CURR = "spots/currSpots";
const ADD_SPOT_ID = "spots/addSpotById";
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

export const deleteReviewFromSpot = (spotId, reviewRating) => ({
	type: DELETE_REVIEW,
	payload: { spotId, reviewRating },
});

export const loadAllSpots = () => async (dispatch) => {
	const response = await csrfFetch("/api/spots");

	const spots = await response.json();
	dispatch(loadSpots(spots));
	return spots;
};

export const loadCurrSpots = () => async (dispatch) => {
	const response = await csrfFetch(`/api/spots/current`);

	const spots = await response.json();
	dispatch(currSpots(spots));
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

	for (let img in images) {
		await csrfFetch(`/api/spots/${id}/images`, {
			method: "POST",
			body: JSON.stringify({ url: images[img], preview: true }),
		});
	}

	return id;
};

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

const initialState = { allSpots: {}, detailedSpots: {}, currentSpots: {} };

export default function spotsReducer(state = initialState, action) {
	switch (action.type) {
		case ADD_SPOT_ID:
			return {
				...state,
				detailedSpots: {
					...state.detailedSpots,
					[action.payload.id]: action.payload,
				},
			};
		case LOAD_SPOTS:
			return {
				...state,
				allSpots: { ...state.allSpots, ...action.payload.Spots },
			};
		case LOAD_CURR:
			return {
				...state,
				currentSpots: { ...state.currentSpots, ...action.payload.Spots },
			};
		case DELETE_REVIEW: {
			const newObj = { ...state };
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
