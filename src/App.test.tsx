/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { NavB } from "./Components/NavBar";
import { FinishScreen } from "./Components/progress";
import "./Pages/HomeScreen";
import { questionJsonProps } from "./Components/Question";
import HomeScreen from "./Pages/HomeScreen";

// Tests for NavB component
describe("NavB component", () => {
  // Test to check if Navbar renders with correct branding
  test("renders Navbar with correct branding", () => {
    const { getByText } = render(
      <Router>
        <NavB />
      </Router>
    );
    const brandingElement = getByText(/Career Finder/i); // Check if "Career Finder" text is rendered
    expect(brandingElement).toBeInTheDocument();
  });

  // Test to check if navigation links render correctly
  test("renders navigation links", () => {
    const { getByText } = render(
      <Router>
        <NavB />
      </Router>
    );
    const basicTestLink = getByText(/Basic Test/i); // Check if "Basic Test" link is rendered
    const detailedTestLink = getByText(/Detailed Test/i); // Check if "Detailed Test" link is rendered

    expect(basicTestLink).toBeInTheDocument();
    expect(detailedTestLink).toBeInTheDocument();
  });
});

// Tests for FinishScreen component
describe("FinishScreen component", () => {
  const questions: Array<questionJsonProps> = [ // a fake question list to pass to the tests
    {
      questionText: "placeholder",
      type: "open-ended"
    }
  ]

  // Test to check if congratulations message renders
  test("renders congratulations message", () => {
    const { getByText } = render(
      <Router>
        <FinishScreen setIndex={() => {}} questions={questions} responses={[""]}/>
      </Router>
    );
    const congratulationsMessage = getByText(
      /Congratulations! You've finished the test!/i
    ); // Check if congrats message is rendered
    expect(congratulationsMessage).toBeInTheDocument();
  });

  // Test to check if "Take me to the results" button renders
  test('renders "Take me to the results" button', () => {
    const { getByText } = render(
      <Router>
        <FinishScreen setIndex={() => {}} questions={questions} responses={[""]}/>
      </Router>
    );
    const resultsButton = getByText(/Take me to the results/i); // Check if "Take me to the results" button is rendered
    expect(resultsButton).toBeInTheDocument();
  });

  // Test to check if "Let me review my answers" button renders
  test('renders "Let me review my answers" button', () => {
    const { getByText } = render(
      <Router>
        <FinishScreen setIndex={() => {}} questions={questions} responses={[""]}/>
      </Router>
    );
    const reviewButton = getByText(/Let me review my answers/i); // Check if "Let me review my answers" button is rendered
    expect(reviewButton).toBeInTheDocument();
  });
});

// Tests for HomeScreen component
describe("HomeScreen component", () => {
  // Test to check if basic test blurb renders
  test("renders basic test blurb", () => {
    const { getByText } = render(<HomeScreen />);
    const basicTestHeader = getByText(/Basic Test/i); // Check if "Basic Test" header is rendered
    const basicTestText = getByText(
      /Concerned about the path of your career\?/i
    ); // Check if description text is rendered
    expect(basicTestHeader).toBeInTheDocument();
    expect(basicTestText).toBeInTheDocument();
  });

  // Test to check if detailed test blurb renders
  test("renders detailed test blurb", () => {
    const { getByText } = render(<HomeScreen />);
    const detailedTestHeader = getByText(/Detailed Test/i); // Check if "Detailed Test" header is rendered
    const detailedTestText = getByText(
      /Looking to dive deep into your career options\?/i
    ); // Check if description text is rendered
    expect(detailedTestHeader).toBeInTheDocument();
    expect(detailedTestText).toBeInTheDocument();
  });

  // Test to check if inputting API key and clicking submit button calls handleSubmit
  test("inputting API key and clicking submit button calls handleSubmit", () => {
    const { getByPlaceholderText, getByText } = render(<HomeScreen />);
    const apiKeyInput = getByPlaceholderText(/Insert API Key Here/i); // Get the input field by its placeholder text
    const submitButton = getByText(/Submit/i); // Get the submit button by its text

    fireEvent.change(apiKeyInput, { target: { value: "test-api-key" } }); // Simulate typing an API key
    fireEvent.click(submitButton); // Simulate clicking the submit button
  });
});
