class ROS2Service {	// This class handles all communication between our React app and ROS2
  // Private variables - Local ones
  private ws: WebSocket | null = null;                                    // The WebSocket connection to ROS2
  private listeners: { [topic: string]: (message: any) => void } = {};   // Storage for callback functions

  connect(url: string = 'ws://localhost:9090'): Promise<boolean> {	// Connection to ROS2 rosbridge server
    // Returns a Promise - means this function is asynchronous (takes time to complete)
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);					// Create WebSocket connection to rosbridge server (default port 9090)
        
        this.ws.onopen = () => {					// Event handler for connection
          console.log('Connected to ROS2 Bridge');
          resolve(true);
        };

        this.ws.onerror = (error) => {					// Event handler for failed connection
          console.error('ROS2 WebSocket error:', error);
          reject(error);
        };

        this.ws.onmessage = (event) => {				// Event handler: What to do when we receive ANY message from ROS2
          const data = JSON.parse(event.data); 				// Parse the JSON string back into a JavaScript object
          // Send this data to our message handler (defined below)
          this.handleMessage(data);
        };

        this.ws.onclose = () => {					// Event handler for closed connection
          console.log('Disconnected from ROS2 Bridge');
        };

      } catch (error) {
        // If anything goes wrong during setup, report the error
        reject(error);
      }
    });
  }

  // Subscribe to a specific ROS2 topic
  subscribe(topic: string, messageType: string, callback: (message: any) => void) {
    if (!this.ws) return;						// Check if we're connected first

    const subscribeMessage = {// Create the subscribe message in the format rosbridge expects
      op: 'subscribe',        // Operation type: subscribe
      topic: topic,           // Which ROS2 topic to listen to (e.g., '/noblenara/odom')
      type: messageType       // What type of messages to expect (e.g., 'nav_msgs/Odometry')
    };

    this.ws.send(JSON.stringify(subscribeMessage));			// Send the subscribe request to rosbridge as a JSON string
    
    this.listeners[topic] = callback;					// Store the callback function so we can call it when messages arrive
  }


// NEW: Publish a message to a ROS2 topic
  publish(topic: string, messageType: string, message: any) {
    if (!this.ws) {
      console.warn('Cannot publish: Not connected to ROS2');
      return;
    }

    const publishMessage = {
      op: 'publish', // Operation type: publish (send data)
      topic: topic, // Which topic to send to
      type: messageType, // Message type
      msg: message // The actual data to send
    };

    this.ws.send(JSON.stringify(publishMessage));
  }

  // NEW: Specific method for publishing velocity commands
  publishVelocity(linear: number, angular: number) {
    const velocityMessage = {
      linear: {
        x: angular, // Rotation speed (left/right)
        y: 0.0,
        z: 0.0
      },
      angular: {
        x: 0.0,
        y: 0.0,
        z: linear // Forward/backward speed
      }
    };

    this.publish('/noblenara/cmd_vel', 'geometry_msgs/Twist', velocityMessage);
    console.log(`🚀 Sent velocity: linear=${linear}, angular=${angular}`);
  }

  // NEW: Quick stop method
  stopRobot() {
    this.publishVelocity(0, 0);
    console.log('🛑 Robot stopped');
  }
  
  private handleMessage(data: any) {					// Private method to handle incoming messages from ROS2
    // Check if this is a published message (actual topic data)
    if (data.op === 'publish' && this.listeners[data.topic]) {
      // Find the callback function we stored for this topic
      // Call it with the message data (data.msg contains the actual ROS2 message)
      this.listeners[data.topic](data.msg);
    }
    // Note: rosbridge sends different types of messages:
    // - op: 'publish' = actual topic data
    // - op: 'status' = connection status updates
    // - etc.
  }

  // Method to cleanly disconnect from ROS2
  disconnect() {
    if (this.ws) {
      this.stopRobot(); // Stop robot before disconnecting
      this.ws.close();        // Close the WebSocket connection
      this.ws = null;         // Clear our reference
    }
  }
}
  

// Create a single instance that the whole app can use
// This is called the "Singleton" pattern - one shared instance
export const ros2Service = new ROS2Service();