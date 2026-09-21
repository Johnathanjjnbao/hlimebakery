import { textFor } from '../utils/i18n';

function isGoogleEmbedUrl(url) {
  return typeof url === 'string' && (/\/maps\/embed/i.test(url) || /[?&]output=embed(?:&|$)/i.test(url));
}

export default function LocationMap({ address, mapUrl, locale = 'vi', className = '' }) {
  const localizedAddress = textFor(address, locale).trim();
  const fallbackAddress = typeof address === 'object' ? (address?.vi || address?.ko || '').trim() : localizedAddress;
  const queryAddress = localizedAddress || fallbackAddress;
  const embedUrl = isGoogleEmbedUrl(mapUrl)
    ? mapUrl
    : queryAddress ? `https://www.google.com/maps?q=${encodeURIComponent(queryAddress)}&output=embed` : '';
  const openUrl = mapUrl || (queryAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryAddress)}` : '');
  const title = locale === 'ko' ? 'Hlime 매장 Google 지도' : 'Google Maps vị trí cửa hàng Hlime';
  const openLabel = locale === 'ko' ? 'Google 지도에서 보기' : 'Mở Google Maps';
  const fallbackLabel = locale === 'ko' ? '지도 정보가 없습니다.' : 'Chưa có thông tin bản đồ.';

  return (
    <div className={`location-map${className ? ` ${className}` : ''}`}>
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : <p className="location-map__fallback">{fallbackLabel}</p>}
      {openUrl && <a className="location-map__link" href={openUrl} target="_blank" rel="noopener noreferrer">{openLabel} ↗</a>}
    </div>
  );
}
