// Footer.test.tsx

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Footer from './Components/Footer';
import Loading from './Components/Loading';
import { BrowserRouter as Router } from 'react-router-dom';
import { NavB } from './Components/NavBar';
import {exportResult,QuizProgressBar,FinishScreen} from './Components/progress';

describe('Footer component', () => {
  it('renders without crashing', () => {
    render(<Footer />);
  });

  it('updates input value when typed', () => {
    const { getByPlaceholderText } = render(<Footer />);
    const input = getByPlaceholderText('Insert API Key Here');
    
    fireEvent.change(input, { target: { value: 'testApiKey' } });

    expect(input.value).toBe('testApiKey');
  });

  it('submits form with correct API key', () => {
    const mockLocalStorageSetItem = jest.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: mockLocalStorageSetItem,
      },
      writable: true,
    });

    const { getByPlaceholderText, getByText } = render(<Footer />);
    const input = getByPlaceholderText('Insert API Key Here');
    const submitButton = getByText('Submit');

    fireEvent.change(input, { target: { value: 'testApiKey' } });
    fireEvent.click(submitButton);

    expect(mockLocalStorageSetItem).toHaveBeenCalledWith('MYKEY', JSON.stringify('testApiKey'));
  });
});
  describe('Loading component', () => {
    it('renders without crashing', () => {
      render(<Loading />);
    });

    it('renders loading text', () => {
      const { getByText } = render(<Loading />);
      const loadingText = getByText('Loading');

      expect(loadingText).toBeInTheDocument();
    });

    it('renders spinner element', () => {
      const { getByRole } = render(<Loading />);
      const spinner = getByRole('status');

      expect(spinner).toBeInTheDocument();
    });

    it('has correct spinner styles', () => {
      const { getByRole } = render(<Loading />);
      const spinner = getByRole('status');

      expect(spinner).toHaveStyle('width: 5em; height: 5em;');
    });
  });
  describe('NavB component', () => {
    it('renders without crashing', () => {
      render(
        <Router>
          <NavB />
        </Router>
      );
    });
  
    it('renders brand link correctly', () => {
      const { getByText } = render(
        <Router>
          <NavB />
        </Router>
      );
      const brandLink = getByText('Career Finder');
  
      expect(brandLink).toBeInTheDocument();
      expect(brandLink.getAttribute('href')).toBe('/');
    });
  
    it('renders basic test link correctly', () => {
      const { getByText } = render(
        <Router>
          <NavB />
        </Router>
      );
      const basicTestLink = getByText('Basic Test');
  
      expect(basicTestLink).toBeInTheDocument();
      expect(basicTestLink.getAttribute('href')).toBe('/basic-test');
    });
  
    it('renders detailed test link correctly', () => {
      const { getByText } = render(
        <Router>
          <NavB />
        </Router>
      );
      const detailedTestLink = getByText('Detailed Test');
  
      expect(detailedTestLink).toBeInTheDocument();
      expect(detailedTestLink.getAttribute('href')).toBe('/detailed-test');
    });
  });
  describe('progress components', () => {
    const questions = [
      { questionText: 'Question 1' },
      { questionText: 'Question 2' },
      { questionText: 'Question 3' },
    ];
    const responses = ['Response 1', 'Response 2', 'Response 3'];
    const setIndexMock = jest.fn();
    const navigateMock = jest.fn();
  
    it('renders without crashing', () => {
      render(
        <FinishScreen
          setIndex={setIndexMock}
          questions={questions}
          responses={responses}
        />
      );
    });
  
    it('renders congratulations message', () => {
      const { getByText } = render(
        <FinishScreen
          setIndex={setIndexMock}
          questions={questions}
          responses={responses}
        />
      );
      const congratulationsMessage = getByText("Congratulations! You've finished the test!");
  
      expect(congratulationsMessage).toBeInTheDocument();
    });
  
    it('calls navigate function with correct path and state when "Take me to the results" button is clicked', () => {
      const { getByText } = render(
        <FinishScreen
          setIndex={setIndexMock}
          questions={questions}
          responses={responses}
        />
      );
      const takeMeToResultsButton = getByText('Take me to the results');
  
      fireEvent.click(takeMeToResultsButton);
  
      expect(navigateMock).toHaveBeenCalledWith("/results", { state: expect.any(String) });
    });
  
    it('calls setIndex function with 0 when "Let me review my answers" button is clicked', () => {
      const { getByText } = render(
        <FinishScreen
          setIndex={setIndexMock}
          questions={questions}
          responses={responses}
        />
      );
      const reviewAnswersButton = getByText('Let me review my answers');
  
      fireEvent.click(reviewAnswersButton);
  
      expect(setIndexMock).toHaveBeenCalledWith(0);
    });
  });
  describe('QuizProgressBar', () => {
    it('renders correctly with given progress', () => {
      const answeredCount = 2;
      const num_questions = 10;
      
      // Render the component with mocked ProgressBar
      const { getByText } = render(
        <QuizProgressBar answeredCount={answeredCount} num_questions={num_questions} />
      );
  
      // Check if progress text is rendered
      expect(getByText('Quiz Progress')).toBeInTheDocument();
  
      // Calculate expected progress percentage
      const expectedProgressPercent = Math.floor((answeredCount / num_questions) * 100);
      const expectedLabel = `${expectedProgressPercent}%`;
  
      // Check if ProgressBar is rendered with correct props
      expect(document.querySelector('.progress-bar')).toBeInTheDocument();
      expect(document.querySelector('.progress-bar').getAttribute('aria-valuenow')).toBe(expectedProgressPercent.toString());
      expect(getByText(expectedLabel)).toBeInTheDocument();
    });
  });
  describe('exportResults function', () => {
    it('combines questions and responses into a single string', () => {
      // Mock input data
      const questions = [
        { questionText: 'Question 1' },
        { questionText: 'Question 2' },
        { questionText: 'Question 3' },
      ];
      const responses = ['Response 1', 'Response 2', 'Response 3'];
  
      // Expected combined string
      const expectedResults =
        "Q1: Question 1\n" +
        "A1: Response 1\n\n" +
        "Q2: Question 2\n" +
        "A2: Response 2\n\n" +
        "Q3: Question 3\n" +
        "A3: Response 3\n\n";
  
      // Call the function with mock data
      const results = exportResults(questions, responses);
  
      // Check if the returned string matches the expected string
      expect(results).toEqual(expectedResults);
    });
  });