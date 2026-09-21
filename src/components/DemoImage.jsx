import { useState } from 'react';

const fallbackSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
    <rect width="1200" height="900" fill="#F4DCE3"/>
    <circle cx="600" cy="395" r="120" fill="#FFF9F5" stroke="#D98C9F" stroke-width="6"/>
    <text x="600" y="435" text-anchor="middle" font-family="Georgia,serif" font-size="118" fill="#8A4657">H</text>
    <text x="600" y="595" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" fill="#4A2F2A">Hlime · Demo image</text>
  </svg>
`)}`;

export default function DemoImage({ src, alt, ...props }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed || !src ? fallbackSvg : src}
      alt={alt}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}

