import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";
import { findASpotById } from "./spot";

const LOAD_REVIEWS = "review/loadReviews";

const loadReviews = (reviews) => ({
	type: LOAD_REVIEWS,
	payload: reviews,
});

export const loadReviewsById = (id) => async (dispatch) => {
	const response = await csrfFetch(`/api/spots/${id}/reviews`);

	const reviews = await response.json();
	reviews.spotId = id;
	dispatch(loadReviews(reviews));
	return reviews;
};

export const addReviewBySpotId = (id, payload) => async (dispatch) => {
	const response = await csrfFetch(`/api/spots/${id}/reviews`, {
		method: "POST",
		body: JSON.stringify(payload),
	});

	const newReview = await response.json();
	await dispatch(findASpotById(id));
	await dispatch(loadReviewsById(id));
	return newReview;
};

const selectReviews = (state) => {
	return state.reviews;
};

export const selectReviewsArray = createSelector(selectReviews, (reviews) => {
	return Object.values(reviews).sort((a, b) => {
		return b.id - a.id;
	});
});

const initialState = {};
export default function reviewsReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD_REVIEWS:
			return { ...action.payload.Reviews };
		default:
			return state;
	}
}
