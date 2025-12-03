import React, { useState, useEffect, useCallback } from 'react';
import { ros2Service } from './ROS2Service';

interface KeyboardControlProps {
  isConnected: boolean;
  maxLinearSpeed?: number;
  maxAngularSpeed?: number;
}

export const KeyboardControl: React.FC<KeyboardControlProps> = ({
  isConnected,
  maxLinearSpeed = 0.0,
  maxAngularSpeed = 0.0
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [currentVelocity, setCurrentVelocity] = useState({ linear: 0, angular: 0 });

  const sendVelocity = useCallback((linear: number, angular: number) => {
    if (!isConnected) return;
    
    ros2Service.publishVelocity(linear, angular);
    setCurrentVelocity({ linear, angular });
  }, [isConnected]);

  const stopRobot = useCallback(() => {
    sendVelocity(0, 0);
  }, [sendVelocity]);

  const handleKeyPress = useCallback((key: string, isPressed: boolean) => {
    if (!isConnected) return;

    setPressedKeys(prev => {
      const newKeys = new Set(prev);
      if (isPressed) {
        newKeys.add(key);
      } else {
        newKeys.delete(key);
      }

      // Calculate velocity based on pressed keys
      let linear = 0;   // angular.z - Forward/backward
      let angular = 0;  // linear.x - Left/right

      if (newKeys.has('ArrowLeft')) angular -= maxAngularSpeed;
      if (newKeys.has('ArrowRight')) angular += maxAngularSpeed;
      if (newKeys.has('ArrowUp')) linear += maxLinearSpeed;
      if (newKeys.has('ArrowDown')) linear -= maxLinearSpeed;

      // Send velocity command
      sendVelocity(linear, angular);

      return newKeys;
    });
  }, [isConnected, maxLinearSpeed, maxAngularSpeed, sendVelocity]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default browser behavior for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
      }

      if (event.key === ' ') {
        stopRobot();
        setPressedKeys(new Set());
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        handleKeyPress(event.key, true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        handleKeyPress(event.key, false);
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyPress, stopRobot]);

  // Stop robot when disconnected
  useEffect(() => {
    if (!isConnected) {
      setPressedKeys(new Set());
      setCurrentVelocity({ linear: 0, angular: 0 });
    }
  }, [isConnected]);

  const isKeyPressed = (key: string) => pressedKeys.has(key);

  return (
    <div className="camera-control-bar">
      <div className="keyboard-controls">
        <div className="arrow-controls">
          <button
            className={`arrow-btn arrow-up ${isKeyPressed('ArrowUp') ? 'pressed' : ''} ${!isConnected ? 'disabled' : ''}`}
            onMouseDown={() => !isConnected || handleKeyPress('ArrowUp', true)}
            onMouseUp={() => handleKeyPress('ArrowUp', false)}
            onMouseLeave={() => handleKeyPress('ArrowUp', false)}
            disabled={!isConnected}
          >
            ↑
          </button>
          <button
            className={`arrow-btn arrow-left ${isKeyPressed('ArrowLeft') ? 'pressed' : ''} ${!isConnected ? 'disabled' : ''}`}
            onMouseDown={() => !isConnected || handleKeyPress('ArrowLeft', true)}
            onMouseUp={() => handleKeyPress('ArrowLeft', false)}
            onMouseLeave={() => handleKeyPress('ArrowLeft', false)}
            disabled={!isConnected}
          >
            ←
          </button>
          <button
            className={`arrow-btn arrow-down ${isKeyPressed('ArrowDown') ? 'pressed' : ''} ${!isConnected ? 'disabled' : ''}`}
            onMouseDown={() => !isConnected || handleKeyPress('ArrowDown', true)}
            onMouseUp={() => handleKeyPress('ArrowDown', false)}
            onMouseLeave={() => handleKeyPress('ArrowDown', false)}
            disabled={!isConnected}
          >
            ↓
          </button>
          <button
            className={`arrow-btn arrow-right ${isKeyPressed('ArrowRight') ? 'pressed' : ''} ${!isConnected ? 'disabled' : ''}`}
            onMouseDown={() => !isConnected || handleKeyPress('ArrowRight', true)}
            onMouseUp={() => handleKeyPress('ArrowRight', false)}
            onMouseLeave={() => handleKeyPress('ArrowRight', false)}
            disabled={!isConnected}
          >
            →
          </button>
        </div>
        
        <div className="space-control">
          <button
            className={`space-btn ${!isConnected ? 'disabled' : ''}`}
            onClick={stopRobot}
            disabled={!isConnected}
          >
            🛑 SPACE
          </button>
        </div>
      </div>

      <div className="control-info">
        <div className="velocity-display">
          L: {currentVelocity.linear.toFixed(2)} | A: {currentVelocity.angular.toFixed(2)}
        </div>
        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
          {isConnected ? 'Use arrow keys + SPACE to stop' : 'ROS2 Disconnected'}
        </div>
      </div>
    </div>
  );
};
