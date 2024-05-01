import React from 'react';
import { useState } from 'react';
import {FinishScreen, QuizProgressBar} from "../Components/progress";
import { NavB } from "../Components/NavBar";
import "../CSS/Tests.css";
import { Question, questionJsonProps } from "../Components/Question";

const openEndedQuestions: Array<questionJsonProps> = [
    {
        questionText: "Describe a complex problem you've faced in the past. How did you approach solving it?",
        type: "open-ended" as const
    },
    {
        questionText: "How do you interact in a team setting? Give examples of your role in different group dynamics.",
        type: "open-ended" as const
    },
    {
        questionText: "What method do you use to prioritize your tasks at work or in daily life? Please explain why you chose this method.",
        type: "open-ended" as const
    },
    {
        questionText: "Can you describe a learning experience that significantly impacted your personal or professional development?",
        type: "open-ended" as const
    },
    {
        questionText: "What project have you been involved with that you found particularly exciting or fulfilling? Describe what made it so.",
        type: "open-ended" as const
    },
    {
        questionText: "Tell us about a challenge you faced at work or in life. How did you manage and what was the outcome?",
        type: "open-ended" as const
    },
    {
        questionText: "What aspects of a work culture are most important to you and why?",
        type: "open-ended" as const
    }
];


export default function DetailedTestScreen() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<string[]>(new Array(openEndedQuestions.length).fill(''));
    const answeredCount = responses.filter(response => response.trim() !== '').length;

    const handleTextChange = (text: string) => {
        const updatedResponses = responses.map((response, index) =>
            index === currentQuestionIndex ? text : response
        );
        setResponses(updatedResponses);
    };


    function handleQuestionChange(isGoingForward: boolean) {
        /**
         * function passed to Question element to have the 'next' and 'previous' buttons handle going forward and back
         * for the questions in the test
         * @author Stephen Sayers
         *
         * @param isGoingForward: Returned from the buttons in the Question element. If it's true then the user wants
         * to go to the next question, if it's false they want to go back to the last question
         */

        if (isGoingForward) {setCurrentQuestionIndex(currentQuestionIndex + 1);}
        else {setCurrentQuestionIndex(currentQuestionIndex - 1);}
    }

    /*
    const handleSubmit = () => {
        console.log("Submitted responses: ", responses);
        // Submit logic here
    };

     */

    return (
        <>
            <NavB/>
            <div className="d-body">
                <QuizProgressBar answeredCount={answeredCount} num_questions={openEndedQuestions.length} />
                {currentQuestionIndex < openEndedQuestions.length ? (
                    <Question
                        questionJson={openEndedQuestions[currentQuestionIndex]}
                        onTextChange={handleTextChange}
                        textResponse={responses[currentQuestionIndex]}
                        onQuestionChange={handleQuestionChange}
                        currentQuestionIndex={currentQuestionIndex}
                    />
                ):(
                    <FinishScreen
                        setIndex={setCurrentQuestionIndex}
                        questions={openEndedQuestions}
                        responses={responses}
                    />
                )}
            </div>
        </>
    );
}