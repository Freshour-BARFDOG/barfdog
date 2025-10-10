import axios from "axios";
import { LIFET_PASSWORD, LIFET_USERNAME } from "constants/aiObesityAnalysis";

const token = Buffer.from(`${LIFET_USERNAME}:${LIFET_PASSWORD}`).toString('base64');

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	const { surveyId } = req.query;

	if (!surveyId) {
		return res.status(400).json({ message: 'surveyId is required' });
	}

	try {
		const { data } = await axios.get(
			`https://lifetdev.co.kr/Interface/Obesity/Result?surveyId=${surveyId}`,
			{
				headers: {
					Authorization: `Basic ${token}`,
				},
			}
		);

		return res.status(200).json(data);
	} catch (error) {
		console.error('Proxy error', error);
		return res.status(500).json({ message: 'Failed to fetch obesity result' });
	}
}