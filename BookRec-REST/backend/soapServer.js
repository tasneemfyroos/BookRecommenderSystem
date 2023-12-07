import createSoapService from './soapService.js';


async function startSoapService() {
  try {
    await createSoapService();
    console.log('SOAP service initialized successfully');
  } catch (error) {
    console.error('Error initializing SOAP service:', error);
  }
}

export default startSoapService;
