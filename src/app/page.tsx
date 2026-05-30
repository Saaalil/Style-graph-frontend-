'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Product {
  imageUrl: string;
  title: string;
  price: string;
  reason: string;
}

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="45" cy="45" r="28" stroke="#8ab4f8" strokeWidth="6"/>
    <line x1="66.1213" y1="65.1213" x2="87.3345" y2="86.3345" stroke="#8ab4f8" strokeWidth="8" strokeLinecap="round"/>
    <path d="M45 27C38.3726 27 33 32.3726 33 39V51C33 52.1046 33.8954 53 35 53H55C56.1046 53 57 52.1046 57 51V39C57 32.3726 51.6274 27 45 27Z" fill="#34A853" opacity="0.8"/>
    <path d="M28 35L33 39V44L28 40V35Z" fill="#34A853" opacity="0.8"/>
    <path d="M62 35L57 39V44L62 40V35Z" fill="#34A853" opacity="0.8"/>
  </svg>
);

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[] | null>(null);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [dbCount, setDbCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/count')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count === 'number') {
          setDbCount(data.count);
        }
      })
      .catch(err => console.error('Failed to fetch DB count:', err));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k: 20 }),
      });

      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || 'Search failed');
      }

      const galleryData = json.data[0];
      
      if (!Array.isArray(galleryData)) {
         throw new Error("Invalid response format from AI Server");
      }

      const parsedResults: Product[] = galleryData.map((item: any) => {
        const imageUrl = item?.image?.url || '';
        const fullCaption = item?.caption || '';
        
        const lines = fullCaption.split('\n');
        const firstLine = lines[0] || '';
        const reason = lines.slice(1).join('\n').trim();
        
        const parts = firstLine.split('·').map((s: string) => s.trim());
        const title = parts[0] || 'Unknown Item';
        const price = parts[1] || '$0';

        return {
          imageUrl,
          title,
          price,
          reason
        };
      });

      setResults(parsedResults);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper fade-in">
      <header className="top-nav">
        <div className="brand">
          <Logo />
          <span className="brand-name">Gist</span>
        </div>
        <div className="nav-actions">
          {dbCount !== null && (
            <span className="live-counter">
              <span className="pulse-dot"></span>
              {dbCount} indexed
            </span>
          )}
        </div>
      </header>

      <section className={`hero-section ${hasSearched ? 'searched-mode' : 'split-mode'}`}>
        {!hasSearched && (
          <div className="hero-content fade-in">
            <h1 className="hero-title">Multimodal<br/>Fashion Search</h1>
            <p className="hero-subtitle">
              Built on Gemini Embedding 2. Gist understands the subtle interplay of style, occasion, and intent to find exactly what you're looking for.
            </p>
            <Link href="/concept" className="concept-btn">
              Understand the concept <ArrowRight size={16} />
            </Link>
          </div>
        )}
        
        <div className="search-pane">
          <form onSubmit={handleSearch} className="search-form">
            <input 
              type="text" 
              className="gist-search-input"
              placeholder="Describe a vibe, occasion, or style..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="gist-search-btn" disabled={loading} title="Search">
              {loading ? <span className="loader"></span> : <Search size={22} />}
            </button>
          </form>
        </div>
      </section>

      {/* Results Section */}
      <main className="results-container">
        {error && <div className="error-message fade-in">{error}</div>}
        
        {results && results.length > 0 && (
          <div className="results-grid fade-in">
            {results.map((product, idx) => (
              <div key={idx} className="gist-card">
                <div className="gist-card-image-wrap">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.title} 
                      className="gist-card-image"
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                  {/* Hover Overlay for Score & Keyword */}
                  {product.reason && (
                    <div className="gist-card-overlay">
                      <div className="overlay-content">
                        <span className="match-label">Match Analysis</span>
                        <p className="match-reason">{product.reason}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="gist-card-info">
                  <h3 className="gist-title">{product.title}</h3>
                  <div className="gist-price">{product.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
