import { useEffect, useState } from "react";
import { getOpeningStatus } from "../utils/openingHours";

const useOpeningStatus = (openingHours) => {
    const [status, setStatus] = useState(() =>
        getOpeningStatus(openingHours)
    );

    useEffect(() => {
        const updateStatus = () => {
            setStatus(getOpeningStatus(openingHours));
        };

        updateStatus();

        // Check again every minute
        const interval = setInterval(updateStatus, 60 * 1000);

        return () => clearInterval(interval);
    }, [openingHours]);

    return status;
};

export default useOpeningStatus;