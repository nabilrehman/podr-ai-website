import SignalingServer from './signaling';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
new SignalingServer(PORT);