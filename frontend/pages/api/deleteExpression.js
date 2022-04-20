import { snmpApi } from '../../config';

export default async function handler(req, res) {
  try {
    const options = {
      method: 'DELETE',
    };

    const { id } = req.query;

    const response = await fetch(`${snmpApi}/expression?id=${id}`, options)
    const parsedResponse = await response.json();
    res.status(200).json(parsedResponse);
  } catch(error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}