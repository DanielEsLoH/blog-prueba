import { createConsumer } from "@rails/actioncable";
const API_WS_URL = import.meta.env.VITE_API_WS_URL || "ws://localhost:3000/cable";

let consumer = null;

export const getConsumer = () => {
  if (!consumer) {
    const token = localStorage.getItem("token");
    consumer = createConsumer(`${API_WS_URL}?token=${token}`);
  }
  return consumer;
};

export const resetConsumer = () => {
  if (consumer) {
    consumer.disconnect();
    consumer = null;
  }
};