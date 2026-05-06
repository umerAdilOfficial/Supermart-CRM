import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function BarcodeScanner({ onScan }) {
  const scannerRef = useRef(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false,
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        if (scannedRef.current) return;

        scannedRef.current = true;

        onScan(decodedText);

        // prevent multiple scans
        setTimeout(() => {
          scannedRef.current = false;
        }, 1500);
      },
      (error) => {
        // ignore scan errors
      },
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [onScan]);

  return <div id="reader" className="w-full" />;
}
