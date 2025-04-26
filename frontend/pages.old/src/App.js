import React, { useState } from 'react';
import axios from 'axios';

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

function App() {
    const [formData, setFormData] = useState({
        gicsGroup: '',
        teamSize: '',
        capital: '',
        numClients: '',
        socialImpact: ''
    });
    const [advice, setAdvice] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/api/advice', { 
                companyInfo: formData 
            });
            
            if (response.data.choices?.[0]?.message?.content) {
                setAdvice(response.data.choices[0].message.content);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching advice:', error);
            setError(error.response?.data?.error || 'Failed to get advice. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Industrial Advisor</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                                    className="w-4 h-4 text-blue-600"
                                    required
                                />
                                <label htmlFor={group} className="ml-2 text-sm">
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
                    <label className="block mb-2 font-medium">
                        Social Impact Score (1-10)
                    </label>
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
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg 
                             hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Getting Advice...' : 'Get Advice'}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {advice && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Recommendations:</h2>
                    <div className="whitespace-pre-wrap text-gray-700">{advice}</div>
                </div>
            )}
        </div>
    );
}

export default App;