'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface Product {
  imageUrl: string;
  title: string;
  price: string;
  reason: string;
}

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

      // Parse the Gradio gallery data
      const galleryData = json.data[0];
      
      if (!Array.isArray(galleryData)) {
         throw new Error("Invalid response format from AI Server");
      }

      const parsedResults: Product[] = galleryData.map((item: any) => {
        const imageUrl = item?.image?.url || '';
        const fullCaption = item?.caption || '';
        
        // Parse "Title · $Price · Score: X\nReason"
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
    <div className="fade-in">
      {/* Hero Section */}
      <section className={`hero ${hasSearched ? 'compact' : ''}`}>
        <h1>StyleGraph</h1>
        <p>A contextual, minimalist search engine powered by multimodal embeddings.</p>
        
        <div style={{ marginTop: '0.5rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {dbCount !== null ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(66, 133, 244, 0.1)', padding: '4px 12px', borderRadius: '12px', border: '1px solid rgba(66, 133, 244, 0.2)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34A853', boxShadow: '0 0 8px #34A853', animation: 'pulse 2s infinite' }}></div>
              Currently indexing <strong>{dbCount}</strong> products
            </span>
          ) : (
            <span style={{ opacity: 0.5 }}>Connecting to database...</span>
          )}
        </div>
        
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              className="search-input"
              placeholder="e.g. A casual summer dress under $80"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="search-button" disabled={loading} title="Search">
              {loading ? <span className="loader"></span> : <Search size={20} />}
            </button>
          </form>
        </div>
      </section>

      {/* Landing Explanation (Only show when not searched) */}
      {!hasSearched && (
        <section className="explanation-section fade-in">
          <h2>How it works</h2>
          <p>
            Traditional search engines look for exact keyword matches. StyleGraph uses advanced embeddings 
            to understand the <em>concept</em> of what you're looking for, returning results that match your vibe perfectly.
          </p>
          <div className="flowchart-container">
            <div className="flow-node">
              <h3>1. User Query</h3>
              <p>Text description or uploaded image</p>
            </div>
            <div className="flow-arrow"></div>
            <div className="flow-node">
              <h3>2. Query Understanding</h3>
              <p>Custom Keyword Transformation (Regex & Keywords)</p>
            </div>
            <div className="flow-arrow"></div>
            <div className="flow-node">
              <h3>3. Vector Retrieval</h3>
              <p>Gemini Embedding 2 + FAISS find nearest neighbors</p>
            </div>
            <div className="flow-arrow"></div>
            <div className="flow-node">
              <h3>4. Contextual Re-ranking</h3>
              <p>Fast Re-ranking (Sort by FAISS Similarity Score)</p>
            </div>
            <div className="flow-arrow"></div>
            <div className="flow-node" style={{background: 'linear-gradient(145deg, rgba(52,168,83,0.1), rgba(52,168,83,0.02))', borderColor: 'rgba(52,168,83,0.4)'}}>
              <h3 style={{color: 'var(--accent-green)'}}>5. Final Results</h3>
              <p>Filtered, sorted, contextually relevant items</p>
            </div>
          </div>
          
          <div className="disclaimer-box">
            <p>
              <strong>Note:</strong> The returned products may sometimes seem a bit off because the current dataset is a bit messy and contains synthetic labels. However, if someone implements this pipeline with proper product categories and clean data, it works flawlessly.
            </p>
          </div>
        </section>
      )}

      {/* Results Section */}
      {error && <div className="error-message">{error}</div>}
      
      {results && results.length > 0 && (
        <div className="results-grid fade-in">
          {results.map((product, idx) => (
            <div key={idx} className="product-card">
              <div className="product-image-container">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    className="product-image"
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                ) : (
                  <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    No Image
                  </div>
                )}
              </div>
              <div className="product-content">
                <h3 className="product-title">{product.title}</h3>
                <div className="product-price">{product.price}</div>
                {product.reason && (
                  <div className="ai-reason">
                    {product.reason}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
