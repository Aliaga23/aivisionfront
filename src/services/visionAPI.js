const API_BASE_URL = 'http://159.203.17.234:8000/api/v1';

export const visionAPI = {
  // REST endpoints
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/vision/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return response.json();
  },

  startProcessing: async (sourceType, videoPath = null) => {
    const response = await fetch(`${API_BASE_URL}/vision/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_type: sourceType,
        video_path: videoPath
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to start processing');
    }
    return response.json();
  },

  stopProcessing: async () => {
    const response = await fetch(`${API_BASE_URL}/vision/stop`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error('Failed to stop processing');
    }
    return response.json();
  },

  uploadVideo: async (videoFile) => {
    const formData = new FormData();
    formData.append('video', videoFile);

    const response = await fetch(`${API_BASE_URL}/vision/start_upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload video');
    }
    return response.json();
  },

  // WebSocket connection helper
  createWebSocketConnection: (onMessage, onConnect, onDisconnect, onError) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//159.203.17.234:8000/api/v1/vision/ws`;
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Vision WebSocket connected');
      if (onConnect) onConnect();
    };

    ws.onclose = () => {
      console.log('Vision WebSocket disconnected');
      if (onDisconnect) onDisconnect();
    };

    ws.onerror = (error) => {
      console.error('Vision WebSocket error:', error);
      if (onError) onError(error);
    };

    ws.onmessage = (event) => {
      if (onMessage) onMessage(event);
    };

    return ws;
  }
};

export default visionAPI;