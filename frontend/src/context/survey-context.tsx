'use client';
import {
    SurveyType,
    initialValues,
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



type SurveyContextType = {
    surveyData: SurveyType;
    updateSurveyDetails: (step: keyof SurveyType, data: Partial<SurveyType[keyof SurveyType]>) => void;
    dataLoaded: boolean;
    setModelOrder: (modelOrder: string[]) => void;
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

    const setModelOrder = useCallback(
        (modelOrder: string[]) => {
            
            
            setSurveyData(prev => ({
                ...prev,
                stepOne: {
                    ...prev.stepOne,
                    modelId: modelOrder[0],
                },
                stepTwo: {
                    ...prev.stepTwo,
                    modelId: modelOrder[0],
                },
                stepThree: {
                    ...prev.stepThree,
                    modelId: modelOrder[0],
                },
                stepFour: {
                    ...prev.stepFour,
                    modelId: modelOrder[1],
                },
                stepFive: {
                    ...prev.stepFive,
                    modelId: modelOrder[1],
                },
                stepSix: {
                    ...prev.stepSix,
                    modelId: modelOrder[1],
                },
                stepSeven: {
                    ...prev.stepSeven,
                    modelId: modelOrder[2],
                },
                stepEight: {
                    ...prev.stepEight,
                    modelId: modelOrder[2],
                },
                stepNine: {
                    ...prev.stepNine,
                    modelId: modelOrder[2],
                },

            }));
        }
    , []);

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
            setModelOrder,

        }),
        [surveyData, dataLoaded, updateSurveyDetails, setModelOrder]
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
