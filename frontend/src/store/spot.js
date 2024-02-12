import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

const LOAD_SPOTS = "spots/loadSpots";
const ADD_SPOT = "spots/addSpot";

const loadSpots = (spots) => ({
	type: LOAD_SPOTS,
	payload: spots,
});

const addSpot = (spot) => ({
	type: ADD_SPOT,
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

export const addASpot = (spot) => async (dispatch) => {
	const response = await csrfFetch("/api/spots", {
		method: "POST",
		body: spot,
	});

	if (response.ok) {
		const spot = await response.json();
		dispatch(addSpot(spot));
		return spot;
	}
};

export const selectAllSpots = (state) => state.spots;

export const selectASpot = (state, id) => state.spots[id];

export const selectSpotsArray = createSelector(selectAllSpots, (spots) =>
	Object.values(spots),
);

const initialState = { spots: null };

export default function spotsReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD_SPOTS:
			return { ...action.payload.Spots };
		default:
			return state;
	}
}
