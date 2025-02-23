"use client"
import Playlist from "@/components/Playlist";
import { Song } from "@/db/schema";
import StepOneForm from "./step-one-form";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface StepOneTutorialProps {
    playlist: Song[];
    recommendationsList: Song[];
}

const StepOneTutorial: React.FC<StepOneTutorialProps> = ({ playlist, recommendationsList }) => {
    const [tutorialState, setTutorialState] = useState(0);
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        const tutorialComplete = localStorage.getItem('tutorialComplete');
        setShowTutorial(!tutorialComplete);
    }, []);

    const nextTutorialState = () => {
        setTutorialState(tutorialState + 1);
    };

    const scrollToStepTwo = () => {
        const element = document.getElementById('stepTwoTutorial');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!showTutorial) {
        return <StepOneForm recommendations={recommendationsList} tutorialState={tutorialState} nextTutorialState={nextTutorialState} />;
    }

    return (
        <>
            <Popover open={tutorialState === 0}>
            <Playlist playlist={playlist} />
                <PopoverContent className="w-80 border-foreground flex flex-col gap-4">
                    1. Listen to the playlist above and get the overall vibe of the songs
                    <Button onClick={() => { nextTutorialState();
                        scrollToStepTwo();
                    }} className="mt-4">Next</Button>
                </PopoverContent>
                <PopoverTrigger className="sr-only"></PopoverTrigger>
            </Popover>
            <div id="stepOneTutorial">
            <StepOneForm recommendations={recommendationsList} tutorialState={tutorialState} nextTutorialState={nextTutorialState} />
            </div>
        </>
    );
};

export default StepOneTutorial;