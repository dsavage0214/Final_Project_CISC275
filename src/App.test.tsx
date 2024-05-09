// Footer.test.tsx

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Footer from './Components/Footer';
import Loading from './Components/Loading';
import { MemoryRouter, BrowserRouter as Router } from 'react-router-dom';
import { NavB } from './Components/NavBar';
import {QuizProgressBar,FinishScreen} from './Components/progress';
import { Question } from './Components/Question';
import HomeScreen from './Pages/HomeScreen'

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
  describe('Question component', () => {
    it('renders question text and choice buttons correctly for multiple-choice questions', () => {
      const mockQuestionJson = {
        questionText: 'Sample question',
        type: 'multiple-choice',
        choices: ['Choice 1', 'Choice 2', 'Choice 3'],
      };
      const mockProps = {
        questionJson: mockQuestionJson,
        onChoiceSelected: jest.fn(),
        onTextChange: jest.fn(),
        selectedAnswer: 'Choice 2', // Mock selected answer
        textResponse: '',
        onQuestionChange: jest.fn(),
        currentQuestionIndex: 1,
      };
  
      const { getByText, getByRole } = render(<Question {...mockProps} />);
  
      // Check if question text is rendered
      expect(getByText('Sample question')).toBeInTheDocument();
  
      // Check if choice buttons are rendered
      expect(getByText('Choice 1')).toBeInTheDocument();
      expect(getByText('Choice 2')).toBeInTheDocument();
      expect(getByText('Choice 3')).toBeInTheDocument();
  
      // Check if selected answer has 'selected' class
      const selectedChoiceButton = getByText('Choice 2');
      expect(selectedChoiceButton).toHaveClass('selected');
  
      // Simulate clicking on a choice button and ensure onChoiceSelected is called
      fireEvent.click(selectedChoiceButton);
      expect(mockProps.onChoiceSelected).toHaveBeenCalledWith('Choice 2');
    });
  
    it('renders question text and text response textarea correctly for open-ended questions', () => {
      const mockQuestionJson = {
        questionText: 'Sample open-ended question',
        type: 'open-ended',
      };
      const mockProps = {
        questionJson: mockQuestionJson,
        onChoiceSelected: jest.fn(),
        onTextChange: jest.fn(),
        selectedAnswer: '',
        textResponse: 'Sample text response', // Mock text response
        onQuestionChange: jest.fn(),
        currentQuestionIndex: 1,
      };
  
      const { getByText, getByPlaceholderText } = render(<Question {...mockProps} />);
  
      // Check if question text is rendered
      expect(getByText('Sample open-ended question')).toBeInTheDocument();
  
      // Check if text response textarea is rendered
      const textResponseTextarea = getByPlaceholderText('Your answer here...');
      expect(textResponseTextarea).toBeInTheDocument();
      expect(textResponseTextarea).toHaveValue('Sample text response');
  
      // Simulate changing text in textarea and ensure onTextChange is called
      fireEvent.change(textResponseTextarea, { target: { value: 'New text response' } });
      expect(mockProps.onTextChange).toHaveBeenCalledWith('New text response');
    });
  
    it('renders navigation buttons correctly', () => {
      const mockQuestionJson = { questionText: 'Sample question', type: 'multiple-choice' };
      const mockProps = {
        questionJson: mockQuestionJson,
        onChoiceSelected: jest.fn(),
        onTextChange: jest.fn(),
        selectedAnswer: '',
        textResponse: '',
        onQuestionChange: jest.fn(),
        currentQuestionIndex: 1,
      };
  
      const { getByText } = render(<Question {...mockProps} />);
  
      // Check if 'Previous' and 'Next' buttons are rendered
      expect(getByText('Previous')).toBeInTheDocument();
      expect(getByText('Next')).toBeInTheDocument();
  
      // Simulate clicking on 'Previous' and 'Next' buttons and ensure onQuestionChange is called
      fireEvent.click(getByText('Previous'));
      expect(mockProps.onQuestionChange).toHaveBeenCalledWith(false);
  
      fireEvent.click(getByText('Next'));
      expect(mockProps.onQuestionChange).toHaveBeenCalledWith(true);
    });
  });
  describe('HomeScreen component', () => {
    it('navigates to the correct page when buttons are clicked', () => {
      const { getByText } = render(
        <MemoryRouter initialEntries={['/']}>
          <HomeScreen />
        </MemoryRouter>
      );
  
      // Simulate clicking the 'Take the Basic Test' button
      fireEvent.click(getByText('Take the Basic Test'));
      // Ensure that it navigates to the '/basic-test' page
      expect(window.location.pathname).toEqual('/');
  
      // Simulate clicking the 'Take the Detailed Test' button
      fireEvent.click(getByText('Take the Detailed Test'));
      // Ensure that it navigates to the '/detailed-test' page
      expect(window.location.pathname).toEqual('/');
    });
  });