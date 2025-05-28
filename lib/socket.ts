import type { Socket } from "socket.io-client"

// Create a socket instance
let socket: Socket

// Function to connect to the socket server
export const connectSocket = () => {
  // In a real app, this would connect to your actual backend
  // For this demo, we'll simulate the connection
  if (!socket) {
    // Mock socket implementation for demo purposes
    const mockSocket = {
      on: (event: string, callback: Function) => {
        // Store callbacks for simulation
        if (!mockCallbacks[event]) {
          mockCallbacks[event] = []
        }
        mockCallbacks[event].push(callback)
        return mockSocket
      },
      off: (event: string) => {
        delete mockCallbacks[event]
        return mockSocket
      },
      emit: (event: string, data: any) => {
        console.log(`Socket emitted ${event}:`, data)
        return mockSocket
      },
      disconnect: () => {
        console.log("Socket disconnected")
      },
    } as unknown as Socket

    socket = mockSocket
    console.log("Socket connected")
  }

  return socket
}

// Store mock callbacks for simulation
const mockCallbacks: { [event: string]: Function[] } = {}

// Export the socket instance
export { socket }
