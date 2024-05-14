import React from 'react';
import { useNavigate } from "react-router-dom";
import {ProgressBar, Button, Form} from 'react-bootstrap';
import { questionJsonProps } from "./Question";
import "../CSS/Progress.css";
import '../CSS/Tests.css'


export function QuizProgressBar({answeredCount, num_questions}: {
    answeredCount: number,
    num_questions: number
}): JSX.Element {
    const progressPercent = Math.floor((answeredCount / num_questions) * 100);
    return (
        <div className="progress-bar-container">
            <h3>Quiz Progress</h3>
            <ProgressBar
                now={progressPercent}
                label={`${progressPercent}%`}
                variant="primary"/>
        </div>
    );
}


/**
 * takes the questions and responses and combines the text of the question with its response, used in <FinishScreen>
 * to pass on the results of the test to the OpenAI API
 *@author Stephen
 *
 * @param questions the array of the questions that were asked to the user
 * @param responses the users responses, its expected that the responses are the same length as questions
 * @param major the major that the user entered in FinishScreen, isn't added onto the results if the user entered nothing
 */
function exportResults(questions: Array<questionJsonProps>, responses: Array<string>, major: string): string {
    let results: string = ""
    for (let i = 0; i < questions.length; i++) { // I don't even know how you could use the string methods for this
        results += ("Q" + (i + 1).toString() + ": " + questions[i].questionText + "\n");
        results += ("A" + (i + 1).toString() + ": " + responses[i] + "\n\n");
    }
    if (major.length > 0) {results += "The test taker only wants careers from these major(s) " + major + "\n"}

    console.log(results);

    return results;
}


/**
 * When a test is finished this element takes the place of the question box to alert the user that they can go on to
 * the results of the test
 * @author Stephen
 *
 */
export function FinishScreen({setIndex, questions, responses}: {
    setIndex: React.Dispatch<React.SetStateAction<number>>,
    questions: Array<questionJsonProps>,
    responses: Array<string>;
}): JSX.Element {
    const [major, setMajor] = React.useState<string>("");
    const navigate = useNavigate();
    function changeMajor(event: React.ChangeEvent<HTMLInputElement>) {setMajor(event.target.value);}

    return (
        <div className="question-container"> {/* Takes the place of the question container*/}
            <h1>Congratulations! You've finished the test!</h1>
            <p className="finish-text-body">
                This marks an exciting milestone on your journey towards finding the perfect career fit. Our
                cutting-edge AI technology is diligently analyzing your responses to provide you with
                comprehensive insights into your strengths, preferences, and potential career paths. when you're
                ready, click below to uncover the personalized results that await you.
            </p>
            <Form>
                <Form.Label>Would you like us to only pick careers for a certain major or majors?:</Form.Label>
                <Form.Control
                    placeholder="Insert majors here or leave blank"
                    onChange={changeMajor}
                />
            </Form>
            <div className="finish-button-container">
                <Button className="finish-button" onClick={() => navigate("/results", {state: exportResults(questions, responses, major)})}>
                    Take me to the results
                </Button>
                <Button className="finish-button" onClick={() => setIndex(0)}>
                    Let me review my answers
                </Button>
            </div>
        </div>
    )
}