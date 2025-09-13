import { v4 as uuidv4 } from "uuid";

export const generateRoomId = () => uuidv4();

export const removeUserFromQueue = (socketId, queue) => {
  const index = queue.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return queue.splice(index, 1)[0];
  }
  return null;
};

export const findUserInQueue = (socketId, queue) => {
  return queue.find((user) => user.socketId === socketId);
};
