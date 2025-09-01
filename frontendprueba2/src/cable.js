import { createConsumer } from "@rails/actioncable";
const API_WS_URL = import.meta.env.VITE_API_WS_URL || "ws://localhost:3000/cable";
export default createConsumer(API_WS_URL);
