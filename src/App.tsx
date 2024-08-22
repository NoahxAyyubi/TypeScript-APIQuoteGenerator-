import { useState, useEffect } from 'react';
import { FaQuoteLeft, FaQuoteRight, FaClipboard } from 'react-icons/fa';
import './App.css';
import gsap from 'gsap';

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
  const colors = [
    "#271918", "#762708", "#A47063", "#C49D7E",
    "#664B36", "#846247", "#B9A389", "#ADB6B1", "#AAA494",
    "#C2A198", "#C9B9AA", "#A6A09E", "#CFD0D2", "#D8D7D2",
    "#648072", "#B7806C", "#B5AFAD", "#7298AD", "#AEC1D2"
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
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

  useEffect(() => {
    const segments = document.querySelectorAll('.segment');
    const quoteMarks = document.querySelectorAll('.quote-mark');

    // Animate the quotation marks
    gsap.fromTo(
      quoteMarks,
      { rotation: 0 },
      { rotation: 360, duration: 1.5}
    );

    // Animate the text segments
    gsap.fromTo(
      segments,
      { opacity: 0, y: 10 }, // Start at opacity 0 and y 20px
      { opacity: 1, y: 0, duration: .5, ease: "power3.out", stagger: .5 } // Animate to opacity 1 and y 0px with stagger
    );
  }, [quote]);

  return (
    <div className='background' style={{ backgroundColor: color }}>
      <div id="quote-box">
        <div className="quote-content" style={{ color: color }}>
          <FaQuoteLeft 
            size="25" 
            style={{ marginRight: "10px" }} 
            className="quote-mark"
          />
          <div id="text" style={{ margin: "5px" }}>
            {quote ? quote.content.split(',').map((segment, index) => (
              <span
                key={index}
                className="segment"
              >
                {segment}{index < quote.content.split(',').length - 1 ? ', ' : ''}
              </span>
            )) : "Noah's Aesthetic Quote Generator..."}
          </div>
          <FaQuoteRight 
            size="25" 
            style={{ marginLeft: "auto" }} 
            className="quote-mark"
          />
          <h5 id="author">{quote ? quote.author : ''}</h5>
        </div>

        <div className='generate-random-button'>
          <button 
            id="new-quote" 
            onClick={generateRandomQuote} 
            style={{ backgroundColor: color }}>
            Generate Random Quote
          </button>
          <FaClipboard 
            size="35" 
            style={{ cursor: "pointer", color: color }} 
            onClick={copyToClipboard} 
            title="Copy to clipboard" 
          />
        </div>
        <div className="emotion-buttons">
          <button 
            onClick={() => handleEmotionClick('motivational')}
            style={{ backgroundColor: color }}>
            What the sigma?
          </button>
          <button 
            onClick={() => handleEmotionClick('wisdom')}
            style={{ backgroundColor: color }}>
            A fool, I am, so make me wise.
          </button>
          <button 
            onClick={() => handleEmotionClick('faith')}
            style={{ backgroundColor: color }}>
            Give me faith.
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
