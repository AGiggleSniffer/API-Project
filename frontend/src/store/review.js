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
	payload: newReview,
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
	dispatch(loadReviewsById(id));
	// dispatch(addReview(newReview));
	return newReview;
};

const selectReviews = (state) => {
	return state.reviews;
};

export const selectReviewsArray = createSelector(selectReviews, (reviews) => {
	return Object.values(reviews);
});

const initialState = {};
export default function reviewsReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD_REVIEWS:
			return { ...action.payload.Reviews };
		case ADD_REVIEW:
			return { [action.payload.id]: { ...action.payload }, ...state };
		default:
			return state;
	}
}
