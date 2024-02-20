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
	const response = await csrfFetch(`/api/spots/${id}/reviews`);

	const reviews = await response.json();
	dispatch(loadReviews(reviews));
	return reviews;
};

export const addReviewBySpotId = (id, payload) => async (dispatch) => {
	const response = await csrfFetch(`/api/spots/${id}/reviews`, {
		method: "POST",
		body: JSON.stringify(payload),
	});

	const newReview = await response.json();
	dispatch(addReview(newReview));
	return newReview;
};

const initialState = {};
export default function reviewsReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD_REVIEWS:
			return { ...state, ...action.payload };
		case ADD_REVIEW:
			return { ...state, ...action.payload };
		default:
			return state;
	}
}
