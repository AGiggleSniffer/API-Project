import "./Skeleton.css";

export default function ReviewCardSkeleton({ classes }) {
    const classNames = `skeleton ${classes} animate-pulse`
	return (<div className={classNames}></div>);
}
