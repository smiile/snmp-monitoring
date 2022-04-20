import { snmpApi } from '../../config';

export default async function handler(req, res) {
  try {
    const { startDate, endDate, deviceId } = req.query;
    const response = await fetch(`${snmpApi}/measurements?startDate=${startDate}&endDate=${endDate}&deviceId=${deviceId}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch(error) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}