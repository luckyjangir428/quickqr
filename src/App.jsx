import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

function App() {
  const [text, setText] = useState("");
  const [qrType, setQrType] = useState("url");

  const [wifiName, setWifiName] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(250);

  // Generate QR code content
  const getQRValue = () => {
    switch (qrType) {
      case "wifi":
        if (!wifiName.trim()) return "";

        return `WIFI:T:WPA;S:${wifiName};P:${wifiPassword};;`;

      case "email":
        return email.trim() ? `mailto:${email.trim()}` : "";

      case "phone":
        return phone.trim() ? `tel:${phone.trim()}` : "";

      default:
        return text.trim();
    }
  };

  // Validate input
  const getInputValue = () => {
    switch (qrType) {
      case "wifi":
        return wifiName.trim();

      case "email":
        return email.trim();

      case "phone":
        return phone.trim();

      default:
        return text.trim();
    }
  };

  // Download QR code
  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code");

    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const image = new Image();

    canvas.width = size;
    canvas.height = size;

    image.onload = () => {
      context.drawImage(image, 0, 0, size, size);

      const pngUrl = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");

      downloadLink.href = pngUrl;
      downloadLink.download = "quickqr.png";

      downloadLink.click();
    };

    image.src =
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(svgData);
  };

  // Copy QR content
  const copyQRContent = async () => {
    const qrValue = getQRValue();

    if (!qrValue) return;

    try {
      await navigator.clipboard.writeText(qrValue);
      alert("QR content copied successfully!");
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Unable to copy content.");
    }
  };

  // Reset form
  const resetForm = () => {
    setText("");
    setWifiName("");
    setWifiPassword("");
    setEmail("");
    setPhone("");
    setColor("#000000");
    setSize(250);
    setQrType("url");
  };

  // Display preview text
  const getPreviewText = () => {
    switch (qrType) {
      case "wifi":
        return `Wi-Fi Network: ${wifiName}`;

      case "email":
        return email;

      case "phone":
        return phone;

      default:
        return text;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            QuickQR
          </h1>

          <p className="mt-3 text-slate-600">
            Generate and download QR codes instantly.
          </p>
        </header>

        {/* Main Container */}
        <div className="grid gap-8 rounded-2xl bg-white p-6 shadow-lg md:grid-cols-2">

          {/* Input Section */}
          <div>

            {/* QR Type */}
            <label className="mb-2 block font-medium text-slate-700">
              QR Code Type
            </label>

            <select
              value={qrType}
              onChange={(event) => setQrType(event.target.value)}
              className="mb-6 w-full rounded-lg border border-slate-300 p-3"
            >
              <option value="url">Website URL</option>
              <option value="text">Plain Text</option>
              <option value="wifi">Wi-Fi</option>
              <option value="email">Email</option>
              <option value="phone">Phone Number</option>
            </select>

            {/* URL and Text */}
            {(qrType === "url" || qrType === "text") && (
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Enter text or URL"
                className="h-32 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
              />
            )}

            {/* Wi-Fi */}
            {qrType === "wifi" && (
              <>
                <input
                  value={wifiName}
                  onChange={(event) => setWifiName(event.target.value)}
                  placeholder="Wi-Fi Network Name"
                  className="mb-3 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />

                <input
                  type="password"
                  value={wifiPassword}
                  onChange={(event) => setWifiPassword(event.target.value)}
                  placeholder="Wi-Fi Password"
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />
              </>
            )}

            {/* Email */}
            {qrType === "email" && (
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter email address"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
              />
            )}

            {/* Phone */}
            {qrType === "phone" && (
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
              />
            )}

            {/* QR Color */}
            <label className="mt-6 block font-medium text-slate-700">
              QR Code Color
            </label>

            <input
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              className="mt-2 h-12 w-full cursor-pointer rounded-lg"
            />

            {/* QR Size */}
            <label className="mt-6 block font-medium text-slate-700">
              QR Code Size
            </label>

            <select
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3"
            >
              <option value={150}>Small</option>
              <option value={250}>Medium</option>
              <option value={350}>Large</option>
              <option value={500}>Extra Large</option>
            </select>

            {/* Download Button */}
            <button
              onClick={downloadQRCode}
              disabled={!getInputValue()}
              className="mt-8 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Download QR Code
            </button>

            {/* Copy Button */}
            <button
              onClick={copyQRContent}
              disabled={!getInputValue()}
              className="mt-3 w-full rounded-lg border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Copy QR Content
            </button>

            {/* Reset Button */}
            <button
              onClick={resetForm}
              className="mt-3 w-full rounded-lg bg-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
            >
              Reset
            </button>

          </div>

          {/* Preview Section */}
          <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 p-6">

            {getQRValue() ? (
              <>
                <div className="rounded-xl bg-white p-4 shadow-sm">

                  <QRCodeSVG
                    id="qr-code"
                    value={getQRValue()}
                    size={size}
                    fgColor={color}
                    bgColor="#ffffff"
                    level="H"
                  />

                </div>

                <p className="mt-4 break-all text-center text-sm text-slate-500">
                  {getPreviewText()}
                </p>
              </>
            ) : (
              <p className="text-center text-slate-400">
                Your QR code will appear here.
              </p>
            )}

          </div>

        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-slate-500">
          Create QR codes for free with QuickQR.
        </footer>

      </div>
    </div>
  );
}

export default App;