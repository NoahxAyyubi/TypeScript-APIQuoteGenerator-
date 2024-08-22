import { useState } from 'react';
import { FaQuoteLeft, FaQuoteRight, FaClipboard } from 'react-icons/fa';
import './App.css';

interface Quote {
  _id: string;
  content: string;
  author: string;
  authorSlug: string;
  length: number;
  tags: string[];
}

// Function to fetch a random quote
const fetchRandomQuote = async (): Promise<Quote> => {
  const response = await fetch('https://api.quotable.io/quotes/random');
  const [data] = await response.json();
  return data;
};

// Function to fetch a quote by tag
const fetchQuoteByTag = async (tag: string): Promise<Quote> => {
  const response = await fetch(`https://api.quotable.io/quotes?tags=${tag}`);
  const data = await response.json();
  const quotes = data.results;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

const getColor = (): string => {
  const red = Math.floor(Math.random() * 128);
  const green = Math.floor(Math.random() * 128);
  const blue = Math.floor(Math.random() * 128);
  return `rgb(${red},${green},${blue})`;
}

function App() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [color, setColor] = useState<string>(getColor());

  // Function to generate a random quote
  const generateRandomQuote = async () => {
    const newQuote = await fetchRandomQuote();
    setQuote(newQuote);
    setColor(getColor());
  }

  // Function to handle emotion button clicks
  const handleEmotionClick = async (tag: string) => {
    const newQuote = await fetchQuoteByTag(tag);
    setQuote(newQuote);
    setColor(getColor());
  }

  const copyToClipboard = () => {
    if (quote) {
      navigator.clipboard.writeText(`${quote.content} - ${quote.author}`);
      alert("Quote copied to clipboard!");
    }
  };

  return (
    <div className='background' style={{ backgroundColor: color }}>
      <div id="quote-box">
        <div className="quote-content" style={{ color: color }}>
          <FaQuoteLeft size="25" style={{ marginRight: "10px" }} />
          <h3 id="text" style={{ margin: "5px" }}>
            {quote ? quote.content : "Noah's Quote Generator..."}
          </h3>
          <FaQuoteRight size="25" style={{ marginLeft: "auto" }} />
          <h4 id="author">{quote ? quote.author : ''}</h4>
        </div>

        <div className='generate-random-button'>
          <button 
            id="new-quote" 
            onClick={generateRandomQuote} 
            style={{ borderColor: color }}>
            Generate Random Quote
          </button>
          <FaClipboard 
            size="35" 
            style={{ marginLeft: "10px", cursor: "pointer", color: color }} 
            onClick={copyToClipboard} 
            title="Copy to clipboard" 
          />
        </div>
        <div className="emotion-buttons">
          <button 
            onClick={() => handleEmotionClick('motivational')}
            style={{ borderColor: color }}>
            Sigma Motivation
          </button>
          <button 
            onClick={() => handleEmotionClick('wisdom')}
            style={{ borderColor: color }}>
            A fool, I am, so make me wise.
          </button>
          <button 
            onClick={() => handleEmotionClick('faith')}
            style={{ borderColor: color }}>
            Give me Faith
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
