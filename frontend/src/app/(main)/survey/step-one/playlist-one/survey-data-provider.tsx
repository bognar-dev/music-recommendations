'use client';

import { useSurveyContext } from '@/context/survey-context';
import { useEffect, useState } from 'react';

// Client component that accesses the survey context and passes the data as a prop
export default function SurveyDataProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);
    const { surveyData, dataLoaded } = useSurveyContext();

    // Store survey data in a serializable format for server components
    const [serializedData, setSerializedData] = useState('');

    useEffect(() => {
        setMounted(true);
        if (dataLoaded) {
            // Convert data to JSON string to pass to server component
            setSerializedData(JSON.stringify(surveyData));
        }
    }, [dataLoaded, surveyData]);

    if (!mounted || !dataLoaded) {
        return <div>Loading survey data...</div>;
    }

    // Add the serialized data as a data attribute that server components can read
    return (
        <div data-survey-data={serializedData}>
            {children}
        </div>
    );
}
