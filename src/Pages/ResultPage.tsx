import React, { useEffect, useState } from "react";
import { find_key } from "../Components/Footer";
import OpenAI from "openai";
import "../CSS/ResultPage.css";
import { Accordion } from "react-bootstrap";
import LoadingPage from "./LoadingPage";
import { useLocation } from "react-router-dom";
import { NavB } from "../Components/NavBar";

const NUM_JOBS = 10; // the amount of jobs you'd want the API to suggest
let apiKey: string | undefined = find_key();
// Initialize OpenAI API
const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });
// The JSON format that the API outputs
interface JsonParam extends Object {
  job: string; // the name of the job
  description: string; // what you'd do in the job
  justification: string; // why GPT picked this job for the user
  training: string; // what degree, certification, ect you'd need for the job
  orgs: Array<string>; // what company, charity, government, ect. hires people in this job
}

/**
 * Takes the JSON report given by the API request to OpenAPI and then formats it into a Bootstrap accordion
 * @author: Stephen Sayers
 */
function ResultAccordion({
  GPTReport,
  numEntries,
}: {
  GPTReport: Array<JsonParam> | undefined;
  numEntries: number;
}): JSX.Element {
  /**
   * makes the body of each accordion fold. Used as a callback function in the return of ResultAccordion function
   * Should be used with Array.prototype.map
   * @author: Stephen Sayers
   *
   * @param json_object - an element from report
   * @param i - the index for the accordion fold, used to make a unique id for the accordion fold
   */
  function makeAccordionBody(json_object: JsonParam, i: number) {
    return (
      <Accordion.Item eventKey={i.toString()}>
        <Accordion.Header>
          <h3 className="accordion-header">{json_object.job}</h3>
        </Accordion.Header>
        <Accordion.Body>
          <p>
            <b>Job description:</b> {json_object.description}
          </p>
          <br />
          <p>
            <b>Why it's a good fit:</b> {json_object.justification}
          </p>
          <br />
          <p>
            <b>training/education needed:</b> {json_object.training}
          </p>
          <br />
          <p>
            <b>Organizations in the field:</b>{" "}
            {json_object.orgs.reduce(
              (print_string: string, org: string) =>
                print_string + (org + ", "),
              ""
            )}
          </p>
        </Accordion.Body>
      </Accordion.Item>
    );
  }

  /**
   * Makes an Accordion fold with the same styling as makeAccordionBody except with placeholders
   * @author Stephen Sayers
   *
   * @param i - the index of the accordion fold. used to make a unique id for the fold
   */
  function makePlaceholderAccordionBody(i: number): JSX.Element {
    return (
      <Accordion.Item eventKey={i.toString()}>
        <Accordion.Header>
          <h3 className="placeholder-header">Loading...</h3>
        </Accordion.Header>
      </Accordion.Item>
    );
  }

  const placeholders: Array<JSX.Element> = [];
  for (let i = numEntries; i < NUM_JOBS; i++) {
    placeholders.push(makePlaceholderAccordionBody(i));
  }

  return (
    <Accordion alwaysOpen={true}>
      {GPTReport?.map(makeAccordionBody)}
      {placeholders}
    </Accordion>
  );
}

export default function ResultPage(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [report, setReport] = useState<Array<JsonParam>>();
  const location = useLocation();
  const assistantID: string = "asst_BkCqfCEjPOnW3Z3X0ePsamu8"; // assistant was made in advance in the OpenAI playground
  const [numEntries, setNumEntries] = useState<number>(0);

  useEffect(() => {
    /**
     * Helper function to genAssistReport. Gets the thread's messages from OpenAI, collects GPT's responses, and then
     * updates the state of report
     * @author Stephen Sayers
     *
     * @param run - the current run from genAssistReport
     */
    async function resolveRun(run: OpenAI.Beta.Threads.Runs.Run) {
      console.log("In resolveRun");
      let messages = await openai.beta.threads.messages.list(run.thread_id);
      let report: Array<JsonParam> = [];
      for (const msg of messages.data.reverse()) {
        if (
          msg.content[0].type === "text" &&
          msg.content[0].text.value[0] === "{"
        ) {
          report = [...report, JSON.parse(msg.content[0].text.value)];
        }
      }
      setReport(report);
      setNumEntries(report.length);
      console.log(report);
    }

    /**
     * Generates a career report using OpenAI's assistants API. Is able to generate the report one career at a time to
     * lower perceived load times compared to genReport
     * @author Stephen Sayers
     */
    async function genAssistReport() {
      const results: string = location.state;

      // split up the prompt into variables to make it easier to understand what's being asked of the API
      const job_str: string =
        "What's the best career for the user based off of these results? Make the JSON key for" +
        ' the job "job"\n\n';
      const desc_str: string =
        "Write a 3 sentence paragraph explaining what that job entails. Make the JSON key for " +
        'the description "description"\n\n';
      const just_str: string =
        "Explain why the job is a good fit for the test taker. Respond as if you were speaking " +
        'to the test taker. Make the JSON key for the explanation "justification"\n\n';
      const train_str: string =
        "For each career, what training or education is needed? Please make the JSON key for " +
        'each explanation "training"\n\n';
      const org_str: string =
        "For each career, list a couple of organizations that would hire in that field? Make " +
        'the JSON key for each explanation "orgs"';

      const thread = await openai.beta.threads.create(undefined);

      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content:
          "Here is the results of the test\n" +
          results +
          job_str +
          desc_str +
          just_str +
          train_str +
          org_str,
      });

      let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: assistantID,
        additional_instructions: "do not use line breaks in your response",
      });
      if (run.status === "completed") {
        await resolveRun(run);
        setIsLoading(false);

        for (let i = 0; i < NUM_JOBS - 1; i++) {
          await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content:
              "Using the test results from the first message, suggest another career. respond in the same " +
              "format as the first message",
          });
          run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistantID,
            additional_instructions: "do not use line breaks in your response",
          });
          if (run.status === "completed") {
            await resolveRun(run);
          } else {
            console.log(run.status);
            if (run.status === "failed") {
              console.log(run.last_error);
            }
          }
        }
      } else {
        console.log(run.status);
        if (run.status === "failed") {
          console.log(run.last_error);
        }
      }
    }
    genAssistReport();
  }, [location.state]);

  return (
    <div>
      <NavB/>
      <div className={"placeholder-container"}>
        <h2>Test Completed!</h2>
        <div className={"accordian"}>
        {isLoading ? (
          <LoadingPage />
        ) : (
          <ResultAccordion GPTReport={report} numEntries={numEntries} />
        )}
        </div>
      </div>
    </div>
  );
}
