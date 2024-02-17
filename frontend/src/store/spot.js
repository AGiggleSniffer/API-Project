import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

const LOAD_SPOTS = "spots/loadSpots";
const ADD_SPOT_ID = "spots/addSpotById";

const loadSpots = (spots) => ({
	type: LOAD_SPOTS,
	payload: spots,
});

const addSpotById = (spot) => ({
	type: ADD_SPOT_ID,
	payload: spot,
});

export const loadAllSpots = () => async (dispatch) => {
	const response = await csrfFetch("/api/spots");

	if (response.ok) {
		const spots = await response.json();
		dispatch(loadSpots(spots));
		return spots;
	}
};

export const findASpotById = (id) => async (dispatch) => {
	const response = await csrfFetch(`/api/spots/${id}`);

	if (response.ok) {
		const spot = await response.json();
		dispatch(addSpotById(spot));
		return spot;
	}
};

export const addANewSpot = (spot, images) => async () => {
	const response = await csrfFetch(`/api/spots`, {
		method: "POST",
		body: JSON.stringify(spot),
	});

	if (response.ok) {
		const { id } = await response.json();

		for (let img in images) {
			await csrfFetch(`/api/spots/${id}/images`, {
				method: "POST",
				body: JSON.stringify({ url: images[img], preview: true }),
			});
		}

		return id;
	}
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

const initialState = { allSpots: {}, detailedSpots: {} };

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
		default:
			return state;
	}
}
