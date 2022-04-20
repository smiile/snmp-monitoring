import { snmpApi } from '../../config';

export default async function handler(req, res) {
  try {
    const options = {
      method: 'PUT',
    };

    const { id, name, host, expressionId, oid } = req.query;

    const response = await fetch(`${snmpApi}/device?id=${id}&name=${name}&host=${host}&oid=${oid}&expressionId=${expressionId}`, options);
    const parsedResponse = await response.json();
    res.status(200).json(parsedResponse);
  } catch(error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}