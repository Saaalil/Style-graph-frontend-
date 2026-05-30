'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ConceptPage() {
  return (
    <div className="fade-in concept-page" style={{ padding: '4rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
        <ArrowLeft size={16} /> Back to Search
      </Link>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Understanding the Concept</h1>
      
      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.6' }}>
        Traditional search engines rely heavily on exact keyword matches. Gist uses advanced, multimodal embeddings 
        (Gemini Embedding 2) to understand the underlying <em>concept</em> of your query—balancing semantic meaning, occasion, and style to return results that perfectly match your vibe.
      </p>

      <div className="flowchart-container" style={{ margin: '0 auto 3rem auto' }}>
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
    </div>
  );
}
