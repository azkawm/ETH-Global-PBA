declare module "react-qr-scanner" {
  import { CSSProperties } from "react";

  interface QrScannerProps {
    delay?: number;
    onError?: (error: any) => void;
    onScan?: (data: any | null) => void;
    style?: CSSProperties;
  }

  const QrScanner: React.FC<QrScannerProps>;

  export default QrScanner;
}
