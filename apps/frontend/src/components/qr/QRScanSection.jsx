import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

const QRScanSection = ({ onScanComplete, status, setStatus }) => {
  const [scanning, setScanning] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment');
  const [progress, setProgress] = useState(100);
  const timerRef = useRef(null);
  const scannerInstance = useRef(null);
  const scannerStateRef = useRef(Html5QrcodeScannerState.UNKNOWN);

  // Scanner lifecycle management
  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
      scannerInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraFacing]);

  const startScanner = () => {
    if (scanning) return;

    // Clear existing scanner
    if (scannerInstance.current) {
      stopScannerInstance();
    }

    const scanner = new Html5Qrcode('qr-reader');
    scannerInstance.current = scanner;
    setStatus('init');
    setScanning(true);
    setProgress(100);

    // Track scanner state
    scannerStateRef.current = Html5QrcodeScannerState.STARTING;

    // 30-second timeout
    let countdown = 30;
    timerRef.current = setInterval(() => {
      countdown--;
      setProgress((countdown / 30) * 100);
      if (countdown === 0) {
        stopScanner();
        setStatus('timeout');
      }
    }, 1000);

    scanner
      .start(
        { facingMode: cameraFacing },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          stopScanner();

          // Validate QR format
          const qrData = decodedText.split(',');
          if (qrData.length !== 2 || !qrData[0] || !qrData[1]) {
            setStatus('invalid');
            return;
          }

          const [instagram_id, enrollment_no] = qrData;
          onScanComplete({ instagram_id, enrollment_no });
        },
        (error) => {
          if (error.name === 'NotAllowedError') {
            setStatus('camera-permission-denied');
            scannerStateRef.current = Html5QrcodeScannerState.UNKNOWN;
          } else if (error.name === 'NotFoundError') {
            setStatus('camera-error');
            scannerStateRef.current = Html5QrcodeScannerState.UNKNOWN;
          }
        }
      )
      .then(() => {
        scannerStateRef.current = Html5QrcodeScannerState.SCANNING;
      })
      .catch((error) => {
        if (error.name === 'NotAllowedError') {
          setStatus('camera-permission-denied');
          scannerStateRef.current = Html5QrcodeScannerState.UNKNOWN;
        } else {
          setStatus('camera-error');
          scannerStateRef.current = Html5QrcodeScannerState.UNKNOWN;
        }
      });
  };

  const stopScannerInstance = () => {
    const scanner = scannerInstance.current;
    if (scanner && typeof scanner.stop === 'function') {
      // Only stop if scanner is in a stoppable state
      if (
        scannerStateRef.current === Html5QrcodeScannerState.SCANNING ||
        scannerStateRef.current === Html5QrcodeScannerState.PAUSED
      ) {
        scanner
          .stop()
          .then(() => {
            scannerStateRef.current = Html5QrcodeScannerState.STOPPED;
          })
          .catch((error) => {
            console.warn('Scanner stop error:', error.message);
            scannerStateRef.current = Html5QrcodeScannerState.UNKNOWN;
          });
      }
    }
  };

  const stopScanner = () => {
    clearInterval(timerRef.current);
    setScanning(false);
    setProgress(0);
    stopScannerInstance();
  };

  const renderStatus = () => {
    switch (status) {
      case 'fetching':
        return (
          <p className="text-gray-700 animate-pulse">
            Fetching user details...
          </p>
        );
      case 'invalid':
        return <p className="text-red-500">Invalid or mismatched QR code.</p>;
      case 'redeemed':
        return (
          <p className="text-green-600">This code has already been redeemed.</p>
        );
      case 'timeout':
        return (
          <p className="text-yellow-500">⏳ Time's up! Please scan again.</p>
        );
      case 'camera-error':
        return <p className="text-red-600">📷 Camera not found</p>;
      case 'camera-permission-denied':
        return (
          <p className="text-red-600">
            📷 Camera permission denied. Please allow access.
          </p>
        );
      default:
        return (
          <p className="text-gray-600">
            📷 Align the QR inside the frame to scan
          </p>
        );
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto text-center">
      {renderStatus()}

      <div className="relative w-full aspect-square bg-black rounded-xl shadow-lg overflow-hidden my-4">
        <div id="qr-reader" className="absolute inset-0"></div>

        {/* Scan animation */}
        {scanning && (
          <div className="absolute inset-x-10 top-0 h-1 bg-red-500 animate-ping rounded-full"></div>
        )}

        {/* Corner markers */}
        {[
          'top-5 left-5',
          'top-5 right-5',
          'bottom-5 left-5',
          'bottom-5 right-5',
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute w-5 h-5 border-2 border-white ${pos}`}
          ></div>
        ))}
      </div>

      {/* Progress Bar */}
      {scanning && (
        <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full bg-gray-500 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Camera Controls */}
      <div className="mt-6 space-y-3">
        <button
          onClick={() =>
            setCameraFacing((prev) =>
              prev === 'environment' ? 'user' : 'environment'
            )
          }
          className="px-4 py-2 rounded-full text-white bg-gray-700 hover:bg-gray-900 transition"
        >
          Switch Camera
        </button>

        {!scanning && (
          <button
            onClick={startScanner}
            className="block w-full py-3 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-black"
          >
            Scan Again
          </button>
        )}
      </div>
    </div>
  );
};

export default QRScanSection;
