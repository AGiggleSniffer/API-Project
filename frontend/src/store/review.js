import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

const LOAD_REVIEWS = "review/loadReviews";
const ADD_REVIEW = "review/addReview";

const loadReviews = (reviews) => ({
	type: LOAD_REVIEWS,
	payload: reviews,
});

const addReview = (newReview) => ({
	type: ADD_REVIEW,
	paylaod: newReview,
});

export const loadReviewsById = (id) => async (dispatch) => {
	const response = await csrfFetch(`spots/${id}/reviews`);

	if (response.ok) {
		console.log("WORKING", response, "\nID", id);
		const reviews = await response.json();
		console.log("THUNK", reviews);
		dispatch(loadReviews(reviews));
		return reviews;
	}
};

export const addReviewBySpotId = (id, payload) => async (dispatch) => {
	const response = await csrfFetch(`spots/${id}/reviews`, {
		method: "POST",
		body: payload,
	});

	if (response.ok) {
		const newReview = await response.json();
		dispatch(addReview(newReview));
		return newReview;
	}
};

const initialState = {};
export default function spotsReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD_REVIEWS:
			console.log("REDUCER", action);
			return { ...state, ...action.payload };
		case ADD_REVIEW:
			console.log("REDUCER", action);
			return { ...state, ...action.payload };
		default:
			return state;
	}
}
