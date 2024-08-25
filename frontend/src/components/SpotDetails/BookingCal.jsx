import { useEffect, useState } from "react";
import "./Cal.css";

export default function BookingCal() {
    const [days, setDays] = useState([]);

	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth();

	const formattedDate = date.toLocaleString("en-US", {
		month: "long",

		year: "numeric",
    });
    
	useEffect(() => {
		const display = document.querySelector(".display");

		const previous = document.querySelector(".left");

		const next = document.querySelector(".right");

		const selected = document.querySelector(".selected");
        
		const daysArr = [];

		const firstDay = new Date(year, month, 1);

		const firstDayIndex = firstDay.getDay();

		const lastDay = new Date(year, month + 1, 0);

		const numberOfDays = lastDay.getDate();

		for (let x = 1; x <= firstDayIndex; x++) {
			daysArr.push(<div></div>);
		}

		for (let i = 1; i <= numberOfDays; i++) {
			const currentDate = new Date(year, month, i);

			// div.dataset.date = currentDate.toDateString();

			// div.innerHTML += i;

			// days.appendChild(div);

			if (
				currentDate.getFullYear() === new Date().getFullYear() &&
				currentDate.getMonth() === new Date().getMonth() &&
				currentDate.getDate() === new Date().getDate()
			) {
				daysArr.push(<div className="current-date">{i}</div>);
			} else {
				daysArr.push(<div>{i}</div>);
			}
		}

		setDays(daysArr);
	}, [setDays, month, year]);

	return (
		<div className="container">
			<div className="calendar">
				<header>
					<pre className="left">◀</pre>

					<div className="header-display">
						<p className="display">{formattedDate}</p>
					</div>

					<pre className="right">▶</pre>
				</header>

				<div className="week">
					<div>Su</div>

					<div>Mo</div>

					<div>Tu</div>

					<div>We</div>

					<div>Th</div>

					<div>Fr</div>

					<div>Sa</div>
				</div>

				<div className="days">{days}</div>
			</div>

			<div className="display-selected">
				<p className="selected"></p>
			</div>
		</div>
	);
}
