"use client";
import { useEffect, useState } from "react";

export const ConnectionState = ({status}: { status: "idle" | "error" | "connecting" | "pending" }) => {
    if (status === "pending") return null;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        isVisible && (
            <div className="absolute top-0 left-100 z-[1000]">
                <p className={"mb-3 text-red-500"}>{`status: ${status}`}</p>
            </div>
        )
    );
}
