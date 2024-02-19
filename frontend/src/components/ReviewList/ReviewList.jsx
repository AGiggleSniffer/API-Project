import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadReviewsById } from "../../store/review";

export default function ReviewList({ rating, spotId }) {
	const dispatch = useDispatch();

    useEffect(() => {
        console.log(spotId)
		dispatch(loadReviewsById(spotId));
	}, [dispatch, spotId, rating]);

    return (
        <>
            <h3>REVIEWS</h3>
        </>
    );
}
