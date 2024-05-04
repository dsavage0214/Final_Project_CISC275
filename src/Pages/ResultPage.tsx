import React, { useEffect, useState } from "react";
import { find_key } from "../Components/Footer";
import OpenAI from "openai";
import "../CSS/ReportScreen.css";
import { Accordion } from "react-bootstrap";
import LoadingPage from "./LoadingPage";
import {useLocation} from "react-router-dom";

let apiKey: string | undefined = find_key();

// Initialize OpenAI API
const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });

// these two interfaces are needed to pass the JSON that GPT generates without getting errors
interface rootJson extends Object {
  careers: Array<JsonParam>; // see jsonParam for what this is
}

interface JsonParam extends Object {
  job: string; // the name of the job
  description: string; // what you'd do in the job
  justification: string; // why GPT picked this job for the user
  training: string; // what degree, certification, ect you'd need for the job
  orgs: Array<string>; // what company, charity, government, ect. hires people in this job
}

function ResultAccordion({
  GPTReport,
}: {
  GPTReport: rootJson | undefined;
}): JSX.Element {
  /**
   * Takes the JSON report given by the API request to OpenAPI and then formats it into a Bootstrap accordion
   * @author: Stephen Sayers
   */

  function makeAccordionBody(json_object: JsonParam, i: number) {
    /**
     * makes the body of each accordion fold. Used as a callback function in the return of ResultAccordion function
     * @author: Stephen Sayers
     */
    return (
      <Accordion.Item eventKey={i.toString()}>
        <Accordion.Header>{json_object.job}</Accordion.Header>
        <Accordion.Body>
          <p>
            <b>What is this job:</b> {json_object.description}
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

  return (
    <Accordion alwaysOpen={true}>
      {GPTReport?.careers.map(makeAccordionBody)}
    </Accordion>
  );
}

export default function ResultPage(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [report, setReport] = useState<Array<JsonParam>>();
  const location = useLocation()

  useEffect(() => {
    async function assist_report() {
      const career_asst: string = "asst_BkCqfCEjPOnW3Z3X0ePsamu8";
      const results: string = location.state;

      // split up the prompt into variables to make it easier to understand what's being asked of the API
      const job_str: string = "What's the best career for the user based off of these results? Make the JSON key for" +
          " the job \"job\"\n\n"
      const desc_str: string = "Write a 3 sentence paragraph explaining what that job entails. Make the JSON key for " +
          "the description \"description\"\n\n"
      const just_str: string = "Explain why the job is a good fit for the test taker. Respond as if you were speaking " +
          "to the test taker. Make the JSON key for the explanation \"justification\"\n\n"
      const train_str: string = "For each career, what training or education is needed? Please make the JSON key for " +
          "each explanation \"training\"\n\n"
      const org_str: string = "For each career, list a couple of organizations that would hire in that field? Make " +
          "the JSON key for each explanation \"orgs\""

      const assistant = await openai.beta.assistants.retrieve(career_asst);
      const thread = await openai.beta.threads.create();

      const message = await openai.beta.threads.messages.create(
          thread.id,
          {
            role: "user",
            content: "Here is the results of the test\n" + results +
                job_str + desc_str + just_str + train_str + org_str
          }
      )

      let run = await openai.beta.threads.runs.createAndPoll(
          thread.id, {assistant_id: career_asst}
      )

      if (run.status === "completed") {

      }
    }

    /*
    async function gen_report() {
      /**
       * Calls the OpenAI API to generate a JSON file containing ChatGPT's career suggestions, should only be called
       * in the useEffect hook
       * @author Stephen Sayers
       */
    /*
    const sys_role: string =
          "You're the reviewer of the results of a career test. You'll provide people the best possible suggestions for " +
          "the career someone should take based off of the results of the test. Responses should be in JSON format where " +
          "each career suggested should be its own JSON object, the root key for the JSON should be titled \"careers\"." +
          "\n\nThe results of the test are the following:\n\n";
      const results: string = location.state;

      const report = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: sys_role + results }, // GPT's role and the test results
          {
            role: "assistant",
            content:
              'What\'s the 10 best careers for the test taker? Make the JSON key for each career "job"',
          },
          {
            role: "user",
            content:
              "For each career, write a 3 sentence paragraph explaining what that job entails. Make the JSON key for " +
               "each description \"description\"",
          },
          {
            role: "user",
            content:
              "For each career, Explain why the job is a good fit for the test taker. Respond as if you " +
              "were speaking to the test taker and, Make the JSON key for each explanation \"justification\"",
          },
          {
            role: "user",
            content:
              "For each career, what training or education is needed? Please make the JSON key for each " +
              "explanation \"training\""
          },
          {
            role: "user",
            content:
              "For each career, list a couple of organizations that would hire in that field? Make the " +
              "JSON key for each explanation \"orgs\"",
          },
        ],
        max_tokens: 4096, // was able to generate pretty good results in the playground with this length
        response_format: { type: "json_object" }, // will probably be easier to handle than a string
      });
      console.log("GPT finished due to: " + report.choices[0].finish_reason); // to see if GPT needs more tokens
      console.log("JSON generated:" + report.choices[0].message.content);
      if (report.choices[0].message.content !== null) {
        setReport(JSON.parse(report.choices[0].message.content));
        setIsLoading(false);
      } else {
        await gen_report();
      } // the message is null, API call failed and needs to be done again
      
    }
    gen_report();
  */

  }, [location.state]);

  return (
    <div className={"placeholder-container"}>
      <h2>Test Completed!</h2>
      {/*isLoading ? <LoadingPage /> : <ResultAccordion GPTReport={report} />*/}
    </div>
  );
}
