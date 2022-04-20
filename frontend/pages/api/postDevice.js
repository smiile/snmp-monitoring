import { snmpApi } from '../../config';

export default async function handler(req, res) {
  try {
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
          'Content-Type': 'application/json'
      }
    };

    const response = await fetch(`${snmpApi}/device`, options)
    const parsedResponse = await response.json();
    res.status(200).json(parsedResponse);
  } catch(error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}