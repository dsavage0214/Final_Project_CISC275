import React from 'react';
import { useState } from 'react';
import {FinishScreen, QuizProgressBar} from "../Components/progress";
import { NavB } from "../Components/NavBar";
import "../CSS/Tests.css";
import { Question, questionJsonProps } from "../Components/Question";


const questions: Array<questionJsonProps> = [
    {
        questionText: "What do you enjoy doing in your free time?",
        choices: [
            "Reading and researching",
            "Building or creating things",
            "Organizing events or activities",
            "Helping others",
        ],
        type: "multiple-choice" as const
    },
    {
        questionText: "How do you prefer to work?",
        choices: [
            "Alone, focusing deeply on tasks",
            "In a team, collaborating closely with others",
            "In a dynamic environment with lots of changes",
            "In a structured and predictable setting",
        ],
        type: "multiple-choice" as const
    },
    {
        questionText: "What best describes your decision-making process?",
        choices: [
            "Analytical and data-driven",
            "Intuitive and based on personal values",
            "Practical and based on what works best",
            "Collaborative, considering many perspectives",
        ],
        type: "multiple-choice" as const
    },
    {
        questionText: "Which of these tasks would you enjoy the most?",
        choices: [
            "Solving a complex mathematical problem",
            "Designing a marketing campaign for a new product",
            "Leading a team to achieve a project goal",
            "Teaching or mentoring others",
        ],
        type: "multiple-choice" as const
    },
    {
        questionText: "How do you handle stress?",
        choices: [
            "By planning and organizing",
            "Through creative expression",
            "By talking to others and seeking support",
            "By taking action and facing challenges head-on",
        ],
        type: "multiple-choice" as const
    },
    {
        questionText: "What motivates you to work?",
        choices: [
            "Achieving high-quality results",
            "Making a positive impact on others",
            "Personal growth and learning",
            "Recognition and rewards",
        ],
        type: "multiple-choice" as const
    },
    {
        questionText: "Which environment do you thrive in?",
        choices: [
            "A quiet, solitary workspace",
            "A bustling, energetic office",
            "A flexible and changing setting",
            "A stable and routine-based environment",
        ],
        type: "multiple-choice" as const
    }
];
  export default function BasicTestScreen() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<string[]>(new Array(questions.length).fill(''));

    const handleChoiceSelected = (choice: string) => {
        const isSameChoiceSelectedAgain = responses[currentQuestionIndex] === choice;
        const updatedResponses = responses.map((response, index) =>
            index === currentQuestionIndex ? (isSameChoiceSelectedAgain ? '' : choice) : response
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

    const answeredCount = responses.filter(response => response !== '').length;

    /*
    const handleSubmit = () => {
        console.log("Submitted responses: ", responses);
    };
     */

    return (
        <div>
            <NavB/>
            <div className="b-body">
                <QuizProgressBar answeredCount={answeredCount} num_questions={questions.length} />
                {currentQuestionIndex < questions.length ? (
                    <Question
                        questionJson={questions[currentQuestionIndex]}
                        onChoiceSelected={handleChoiceSelected}
                        selectedAnswer={responses[currentQuestionIndex]}
                        onQuestionChange={handleQuestionChange}
                        currentQuestionIndex={currentQuestionIndex}
                    />
                ):(
                    <FinishScreen
                        setIndex={setCurrentQuestionIndex}
                        questions={questions}
                        responses={responses}
                    />
                ) }
            </div>
        </div>
    );
}