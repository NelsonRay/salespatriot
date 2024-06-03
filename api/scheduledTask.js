import axios from 'axios';

module.exports = async function (req, res) {
	try {
		// Make the API call
		const response = await axios.get('https://salespatriot.com/api/emails/process-emailed-rfqs');

		// Handle the response
		console.log('API call successful:', response.data);
		res.status(200).json({ message: 'API call successful' });
	} catch (error) {
		console.error('Error calling API:', error);
		res.status(500).json({ error: 'Error calling API' });
	}
};
