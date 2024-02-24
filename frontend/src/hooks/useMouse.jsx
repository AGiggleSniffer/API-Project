import { useEffect, useState } from "react";

export default function useMouse(ref) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, xOffset: 0, yOffset: 0 });
	useEffect(() => {
		const updateMousePos = (e) => {
			setMousePosition({ x: e.clientX, y: e.clientY, xOffset: e.offsetX, yOffset: e.offsetY });
		};

		const element = ref.current;
		element.addEventListener("mousemove", updateMousePos);
		return () => element.removeEventListener("mousemove", updateMousePos);
    }, [mousePosition, ref]);
    return mousePosition;
}
