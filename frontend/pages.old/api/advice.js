export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { companyInfo } = req.body;

        // Simulate advice generation logic or forward the request to another service
        const advice = `Advice for company in ${companyInfo.gicsGroup} with ${companyInfo.teamSize} team members.`;

        res.status(200).json({ advice });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
