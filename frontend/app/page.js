'use client';

import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const GICS_GROUPS = [
  "Energy",
  "Materials",
  "Industrials",
  "Consumer Discretionary",
  "Consumer Staples",
  "Health Care", 
  "Financials",
  "Information Technology",
  "Communication Services",
  "Utilities",
  "Real Estate"
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'es', name: 'Español' }
];

export default function Home() {
  const [formData, setFormData] = useState({
    gicsGroup: 'Energy',
    teamSize: '5',
    capital: '100000',
    numClients: '0',
    socialImpact: '1',
    language: 'en'
  });
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stream, setStream] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAdvice('');
    try {
      const url = `/api/advice?stream=${stream}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyInfo: formData, language: formData.language })
      });
      if (!response.ok) {
        throw new Error('Failed to get advice. Please try again later.');
      }
      if (stream) {
        // Stream mode
        if (!response.body) throw new Error('No response body');
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value);
            setAdvice(prev => prev + chunk);
          }
        }
      } else {
        // Non-stream mode
        const data = await response.json();
        setAdvice(data.advice);
      }
    } catch (error) {
      console.error('Error fetching advice:', error);
      setError('Failed to get advice. Please try again later.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Industrial Advisor</h1>
       <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center mb-4">
          <label className="mr-2 font-medium">Stream output</label>
          <input
            type="checkbox"
            checked={stream}
            onChange={e => setStream(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-3 font-medium">Output Language</label>
          <div className="grid grid-cols-3 gap-4">
            {LANGUAGES.map(({ code, name }) => (
              <div key={code} className="flex items-center">
                <input
                  type="radio"
                  id={`lang-${code}`}
                  name="language"
                  value={code}
                  checked={formData.language === code}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={`lang-${code}`} className="ml-2 text-sm text-gray-700">
                  {name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-3 font-medium">GICS Group</label>
          <div className="grid grid-cols-2 gap-4">
            {GICS_GROUPS.map(group => (
              <div key={group} className="flex items-center">
                <input
                  type="radio"
                  id={group}
                  name="gicsGroup"
                  value={group}
                  checked={formData.gicsGroup === group}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  required
                />
                <label htmlFor={group} className="ml-2 text-sm text-gray-700">
                  {group}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Team Size</label>
          <input
            type="number"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Capital (USD)</label>
          <input
            type="number"
            name="capital"
            value={formData.capital}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Number of Clients</label>
          <input
            type="number"
            name="numClients"
            value={formData.numClients}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Social Impact Score (1-10)</label>
          <input
            type="number"
            name="socialImpact"
            value={formData.socialImpact}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min="1"
            max="10"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Additional Context</h2>
                    <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        rows={4}
                        placeholder="Any additional information about your company..."
                    />
                </div>

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center"
          disabled={loading}
        >
          {loading && (
            <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          )}
          {loading ? 'Getting Advice...' : 'Get Advice'}
        </button>
      </form>

      {advice && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recommendations:</h2>
          <div className="prose prose-blue max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 text-gray-700" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                li: ({node, ...props}) => <li className="mb-2" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic" {...props} />
                ),
                code: ({node, inline, ...props}) => (
                  inline ? 
                    <code className="bg-gray-100 rounded px-1 py-0.5" {...props} /> :
                    <code className="block bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto" {...props} />
                ),
              }}
            >
              {advice}
            </ReactMarkdown>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
        </div>
      )}
    </main>
  );
}