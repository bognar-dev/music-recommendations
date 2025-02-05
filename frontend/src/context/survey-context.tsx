'use client';
import {
    SurveyType,
    surveySchema,
} from '@/lib/survey-schema';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

const LOCAL_STORAGE_KEY = 'multi-page-survey-data';


const initialValues: SurveyType = {
    stepOne: {
        step: 1,
        modelId: '1',
        songRatings: [] as { modelId: string; songId: number; songName: string; rating: number; }[],
        modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
    },
    stepTwo: {
        step: 2,
        modelId: '2',
        songRatings: [] as { modelId: string; songId: number; songName: string; rating: number; }[],
        modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
    },
    stepThree: {
        step: 3,
        modelId: '3',
        songRatings: [] as { modelId: string; songId: number; songName: string; rating: number; }[],
        modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
    },
    stepFour: {
        step: 4,
        age: 13,
        country: 'UK',
        preference: 'model1',
        feedback: ''
    }
}
type SurveyContextType = {
    surveyData: SurveyType;
    updateSurveyDetails: (step: keyof SurveyType, data: Partial<SurveyType[keyof SurveyType]>) => void;
    dataLoaded: boolean;
    resetLocalStorage: () => void;
};

export const SurveyContext = createContext<SurveyContextType | null>(null);

export const SurveyContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [surveyData, setSurveyData] = useState<SurveyType>(initialValues);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        const loadedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
        console.log('loadedDataString:', loadedDataString);
        if (!loadedDataString) {
            setSurveyData(initialValues);
            setDataLoaded(true);
            return;
        }
        
        try {
            const parsedData = JSON.parse(loadedDataString);
            const validated = surveySchema.safeParse(parsedData);
            if (validated.success) {
                console.log('Loaded data:', validated.data);
                setSurveyData(validated.data);
            } else {
                console.log('Validation failed:', validated.error);
                setSurveyData(initialValues);
            }
        } catch (error) {
            console.log('Error loading data:', error);
            setSurveyData(initialValues);
        }
        setDataLoaded(true);
    }, []);

    useEffect(() => {
        if (dataLoaded) {
            saveDataToLocalStorage(surveyData);
        }
    }, [surveyData, dataLoaded]);

    const updateSurveyDetails = useCallback(
        (step: keyof SurveyType, data: Partial<SurveyType[keyof SurveyType]>) => {
            setSurveyData(prev => ({
                ...prev,
                [step]: { ...prev[step], ...data }
            }));
        },
        []
    );

    const saveDataToLocalStorage = (currentSurveyData: SurveyType) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentSurveyData));
    };


    const resetLocalStorage = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setSurveyData(initialValues);
    };

    const contextValue = useMemo(
        () => ({
            surveyData,
            dataLoaded,
            updateSurveyDetails,
            resetLocalStorage,
        }),
        [surveyData, dataLoaded, updateSurveyDetails]
    );

    return (
        <SurveyContext.Provider value={contextValue}>
            {children}
        </SurveyContext.Provider>
    );
};

export function useSurveyContext() {
    const context = useContext(SurveyContext);
    if (context === null) {
        throw new Error(
            'useSurveyContext must be used within a SurveyContextProvider'
        );
    }
    return context;
}
