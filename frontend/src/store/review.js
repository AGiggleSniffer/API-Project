import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";
import { deleteReviewFromSpot, updateReviews } from "./spot";
import { reviewsLoading, reviewsSuccess } from "./uiState";

const LOAD_REVIEWS = "review/loadReviews";
const DELETE_REVIEW = "review/deleteReview";

const loadReviews = (reviews) => ({
	type: LOAD_REVIEWS,
	payload: reviews,
});

const deleteReview = (id) => ({
	type: DELETE_REVIEW,
	id,
});

export const loadReviewsById = (id) => async (dispatch) => {
	dispatch(reviewsLoading());
	const response = await csrfFetch(`/api/spots/${id}/reviews`);

	const reviews = await response.json();
	reviews.spotId = id;
	dispatch(loadReviews(reviews));
	dispatch(reviewsSuccess());
	return reviews;
};

export const addReviewBySpotId = (id, payload) => async (dispatch) => {
	const response = await csrfFetch(`/api/spots/${id}/reviews`, {
		method: "POST",
		body: JSON.stringify(payload),
	});

	const newReview = await response.json();
	dispatch(updateReviews(id, payload.stars));
	await dispatch(loadReviewsById(id));
	return newReview;
};

export const deleteReviewById =
	(id, spotId, reviewRating) => async (dispatch) => {
		const response = await csrfFetch(`/api/reviews/${id}`, {
			method: "DELETE",
		});

		const msg = await response.json();
		dispatch(deleteReview(id));
		dispatch(deleteReviewFromSpot(spotId, reviewRating));
		return msg;
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
		case LOAD_REVIEWS: {
			const newObj = {};
			action.payload.Reviews.forEach((review) => (newObj[review.id] = review));
			return newObj;
		}
		case DELETE_REVIEW: {
			const newObj = { ...state };
			delete newObj[action.id];
			return newObj;
		}
		default:
			return state;
	}
}
