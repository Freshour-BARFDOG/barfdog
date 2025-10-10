import axios from 'axios';
import fs from 'fs';
import FormData from "form-data";
import { LIFET_PASSWORD, LIFET_USERNAME } from 'constants/aiObesityAnalysis';
import { IncomingForm } from 'formidable';

export const config = { api: { bodyParser: false } };

const parseForm = (req) => {
  const form = new IncomingForm({ keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { fields, files } = await parseForm(req);

    const fileField = files.file;
    const file = Array.isArray(fileField) ? fileField[0] : fileField;
    const weight = Array.isArray(fields.weight) ? fields.weight[0] : fields.weight;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    if (!weight) return res.status(400).json({ message: 'Weight is required' });

    const formData = new FormData();
    formData.append('weight', weight);
    formData.append('file', fs.createReadStream(file.filepath), file.originalFilename);

    const token = Buffer.from(`${LIFET_USERNAME}:${LIFET_PASSWORD}`).toString('base64');

    const { data } = await axios.post(
      'https://lifetdev.co.kr/Interface/Obesity/New',
      formData,
      { headers: { Authorization: `Basic ${token}`, ...formData.getHeaders() }, maxBodyLength: Infinity }
    );

    return res.status(200).json(data);
  } catch (error) {
    console.error('Upload proxy error:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Upload failed' });
  }
}