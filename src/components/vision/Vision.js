import React, { useState, useEffect, useRef, useCallback } from 'react';

const Vision = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [stats, setStats] = useState({
        zones_total: 0,
        zones_occupied: 0,
        vehicles_in_zone: 0,
        parked: 0,
        frontal: 0,
        reversa: 0
    });
    const [sourceType, setSourceType] = useState('video');
    const [videoFile, setVideoFile] = useState(null);
    const [status, setStatus] = useState('Desconectado');
    
    const wsRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const connectWebSocket = useCallback(() => {
        const ws = new WebSocket('ws://159.203.17.234:8000/api/v1/vision/ws');
        
        ws.onopen = () => {
            console.log('WebSocket conectado');
            setIsConnected(true);
            setStatus('Sistema listo');
        };
        
        ws.onmessage = (event) => {
            if (event.data instanceof Blob) {
                // Es un frame de video
                const urlCreator = window.URL || window.webkitURL;
                const imageUrl = urlCreator.createObjectURL(event.data);
                
                const img = new Image();
                img.onload = () => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                    }
                    urlCreator.revokeObjectURL(imageUrl);
                };
                img.src = imageUrl;
            } else {
                // Es un mensaje JSON (stats o control)
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.type === 'stats') {
                        setStats({
                            zones_total: data.zones_total || 0,
                            zones_occupied: data.zones_occupied || 0,
                            vehicles_in_zone: data.vehicles_in_zone || 0,
                            parked: data.parked || 0,
                            frontal: data.frontal || 0,
                            reversa: data.reversa || 0
                        });
                    } else if (data.type === 'status') {
                        if (data.status === 'started') {
                            setIsProcessing(true);
                            setStatus(`LIVE - ${data.source || 'Cámara'}`);
                        } else if (data.status === 'stopped') {
                            setIsProcessing(false);
                            setStatus('Detenido');
                        } else if (data.status === 'error') {
                            setStatus(data.message || 'Error');
                            setIsProcessing(false);
                        }
                    }
                } catch (e) {
                    console.error('Error parsing message:', e);
                }
            }
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setStatus('Error de conexión');
        };
        
        ws.onclose = () => {
            console.log('WebSocket desconectado');
            setIsConnected(false);
            setStatus('Desconectado');
            
            // Intentar reconectar después de 3 segundos
            reconnectTimeoutRef.current = setTimeout(() => {
                console.log('Intentando reconectar...');
                connectWebSocket();
            }, 3000);
        };
        
        wsRef.current = ws;
    }, []);

    // Conectar WebSocket al montar
    useEffect(() => {
        connectWebSocket();
        
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connectWebSocket]);

    const startProcessing = async () => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            setStatus('WebSocket no conectado');
            return;
        }

        setStatus('Iniciando...');
        
        try {
            if (sourceType === 'webcam') {
                // Enviar comando de inicio por WebSocket
                wsRef.current.send(JSON.stringify({
                    action: 'start',
                    source_type: 'webcam'
                }));
            } else if (sourceType === 'video' && videoFile) {
                // Para video, primero subir el archivo
                await uploadAndStartVideo();
            }
        } catch (error) {
            console.error('Error starting processing:', error);
            setStatus('Error al iniciar');
        }
    };

    const stopProcessing = () => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            setStatus('WebSocket no conectado');
            return;
        }

        wsRef.current.send(JSON.stringify({
            action: 'stop'
        }));
    };

    const uploadAndStartVideo = async () => {
        if (!videoFile) return;

        try {
            setStatus('Subiendo video...');
            
            // Subir archivo por HTTP
            const formData = new FormData();
            formData.append('video', videoFile);
            
            const uploadResponse = await fetch('http://159.203.17.234:8000/api/v1/vision/upload', {
                method: 'POST',
                body: formData
            });
            
            const uploadResult = await uploadResponse.json();
            
            if (uploadResult.status === 'success') {
                // Iniciar procesamiento por WebSocket
                wsRef.current.send(JSON.stringify({
                    action: 'start',
                    source_type: 'video',
                    video_path: uploadResult.filename
                }));
            } else {
                setStatus(uploadResult.message || 'Error al subir video');
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            setStatus('Error al subir video');
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setVideoFile(file);
            setStatus(`Archivo seleccionado: ${file.name}`);
        }
    };

    const refreshStats = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                action: 'stats'
            }));
        }
    };

    return (
        <div style={{ 
            padding: '20px', 
            maxWidth: '1400px', 
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Header */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: '2px solid #333',
                paddingBottom: '10px'
            }}>
                <h2 style={{ margin: 0 }}>Sistema de Visión Artificial</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: isConnected ? '#00ff00' : '#ff0000',
                        display: 'inline-block'
                    }}></span>
                    <span>{status}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                {/* Video Section */}
                <div>
                    <div style={{ 
                        backgroundColor: '#1a1a1a', 
                        borderRadius: '8px',
                        padding: '10px',
                        marginBottom: '20px'
                    }}>
                        <canvas 
                            ref={canvasRef}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '100%',
                                borderRadius: '4px',
                                backgroundColor: '#000'
                            }}
                        />
                        {!isProcessing && (
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: '#fff',
                                textAlign: 'center'
                            }}>
                                <p>Sube un video para comenzar</p>
                                <p>RTX 4000 Ada GPU - Servidor Listo</p>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div style={{ 
                        backgroundColor: '#f5f5f5', 
                        padding: '20px', 
                        borderRadius: '8px' 
                    }}>
                        <h3>Fuente de Video</h3>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ marginRight: '20px', opacity: 0.5 }}>
                                <input
                                    type="radio"
                                    value="webcam"
                                    checked={sourceType === 'webcam'}
                                    onChange={(e) => setSourceType(e.target.value)}
                                    disabled={true}
                                />
                                {' '}Cámara Web (No disponible en servidor)
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="video"
                                    checked={sourceType === 'video'}
                                    onChange={(e) => setSourceType(e.target.value)}
                                    disabled={isProcessing}
                                />
                                {' '}Archivo de Video ✓
                            </label>
                        </div>

                        {sourceType === 'video' && (
                            <div style={{ marginBottom: '15px' }}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    disabled={isProcessing}
                                    style={{ marginBottom: '10px' }}
                                />
                                {videoFile && (
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                        {videoFile.name}
                                    </p>
                                )}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={startProcessing}
                                disabled={!isConnected || isProcessing || (sourceType === 'video' && !videoFile)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: isProcessing ? '#666' : '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                {isProcessing ? 'Transmitiendo...' : 'Iniciar'}
                            </button>
                            <button
                                onClick={stopProcessing}
                                disabled={!isConnected || !isProcessing}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: !isProcessing ? '#666' : '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: !isProcessing ? 'not-allowed' : 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                Detener
                            </button>
                            <button
                                onClick={refreshStats}
                                disabled={!isConnected}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                Actualizar Stats
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div>
                    <h3>Estadísticas en Tiempo Real</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {[
                            { label: 'Zonas Totales', value: stats.zones_total },
                            { label: 'Zonas Ocupadas', value: stats.zones_occupied },
                            { label: 'Vehículos en Zona', value: stats.vehicles_in_zone },
                            { label: 'Estacionados', value: stats.parked },
                            { label: 'Frontales', value: stats.frontal },
                            { label: 'En Reversa', value: stats.reversa }
                        ].map((stat, idx) => (
                            <div key={idx} style={{
                                backgroundColor: '#fff',
                                padding: '15px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                textAlign: 'center'
                            }}>
                                <div style={{ 
                                    fontSize: '32px', 
                                    fontWeight: 'bold',
                                    color: '#2196F3',
                                    marginBottom: '5px'
                                }}>
                                    {stat.value}
                                </div>
                                <div style={{ 
                                    fontSize: '14px', 
                                    color: '#666' 
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vision;