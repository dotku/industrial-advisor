import { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [formData, setFormData] = useState({
        gicsGroup: '',
        teamSize: '',
        capital: '',
        numClients: '',
        socialImpact: ''
    });
    const [advice, setAdvice] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/advice', { companyInfo: formData });
            setAdvice(response.data.advice);
        } catch (error) {
            console.error('Error fetching advice:', error);
        }
    };

    return (
        <div>
            <h1>Industrial Advisor</h1>
            <form onSubmit={handleSubmit}>
                <input name="gicsGroup" placeholder="GICS Group" onChange={handleChange} />
                <input name="teamSize" placeholder="Team Size" onChange={handleChange} />
                <input name="capital" placeholder="Capital" onChange={handleChange} />
                <input name="numClients" placeholder="Number of Clients" onChange={handleChange} />
                <textarea name="socialImpact" placeholder="Social Impact" onChange={handleChange}></textarea>
                <button type="submit">Get Advice</button>
            </form>
            {advice && <p>{advice}</p>}
        </div>
    );
}
