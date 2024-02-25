const SPOTS_LOADING = "uiState/loading";
const SPOTS_SUCCESS = "uiState/success";

const REVIEWS_LOADING = "reviews/loading";
const REVIEWS_SUCCESS = "reviews/success";

export const spotsLoading = () => ({ type: SPOTS_LOADING });
export const spotsSuccess = () => ({ type: SPOTS_SUCCESS });

export const reviewsLoading = () => ({ type: REVIEWS_LOADING });
export const reviewsSuccess = () => ({ type: REVIEWS_SUCCESS });

export const selectSpotsLoading = (state) => state.uiState.spotsLoading;
export const selectReviewsLoading = (state) => state.uiState.reviewsLoading;

const initialState = { spotsLoading: false, reviewsLoading: false };

export default function uiStateReducer(state = initialState, action) {
	switch (action.type) {
		case SPOTS_LOADING:
			return { ...state, spotsLoading: true };
		case SPOTS_SUCCESS:
			return { ...state, spotsLoading: false };
		case REVIEWS_LOADING:
			return { ...state, reviewsLoading: true };
		case REVIEWS_SUCCESS:
			return { ...state, reviewsLoading: false };
		case reviewsLoading:
	}
}
