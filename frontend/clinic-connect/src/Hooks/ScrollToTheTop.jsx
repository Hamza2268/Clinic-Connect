import { useEffect } from "react";
import { useLocation } from "react-router-dom";


export default function ScrollToTheTop() {
    const pathName = useLocation()
    useEffect(() => window.scrollTo(0, 0), [])
    window.scrollTo(0, 0);
    return null;
}