import { useState } from 'react';
import DemoImage from '../components/DemoImage';
import { useApp } from '../context/AppContext';
import { contactContent, siteContent } from '../data/siteContent';
import { textFor } from '../utils/i18n';

export default function ContactPage() {
  const { locale, showToast } = useApp();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = (event) => {
    event.preventDefault();
    showToast(locale === 'ko' ? '데모 폼입니다. 메시지는 전송되지 않았습니다.' : 'Form demo — chưa gửi tin nhắn thật.');
  };

  return (
    <main id="main-content">
      <section className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="eyebrow">{textFor(contactContent.hero.eyebrow, locale)}</p>
          <h1>{textFor(contactContent.hero.title, locale)}</h1>
          <p>{textFor(contactContent.hero.text, locale)}</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-layout">
          <div className="contact-stack">
            <figure className="contact-atmosphere" data-demo-admin="contact-atmosphere-media">
              <DemoImage src={contactContent.atmosphereImage} alt={textFor(contactContent.atmosphereAlt, locale)} loading="eager" />
              <figcaption><span>{locale === 'ko' ? 'Hlime의 한 장면 · 데모' : 'Một góc Hlime · Demo'}</span></figcaption>
            </figure>
            <article className="contact-card">
              <p className="eyebrow">{locale === 'ko' ? '주소' : 'Địa chỉ'}</p>
              <h2>{locale === 'ko' ? '흘라임 베이커리 & 파티세리' : 'Hlime Bakery & Pâtisserie'}</h2>
              <p>{textFor(siteContent.address, locale)}</p>
              <a className="text-link" href={siteContent.mapUrl} target="_blank" rel="noreferrer">{locale === 'ko' ? '지도 열기 ↗' : 'Mở bản đồ ↗'}</a>
            </article>
            <div className="contact-card-grid">
              <article className="contact-card contact-card--small">
                <p className="eyebrow">{locale === 'ko' ? '연락처' : 'Liên hệ'}</p>
                <p><a href={siteContent.phoneHref}>{siteContent.phone}</a><br /><a href={`mailto:${siteContent.email}`}>{siteContent.email}</a></p>
              </article>
              <article className="contact-card contact-card--small">
                <p className="eyebrow">{locale === 'ko' ? '영업시간' : 'Giờ mở cửa'}</p>
                <p>{locale === 'ko' ? '월요일 – 일요일' : 'Thứ Hai – Chủ Nhật'}<br />08:00 – 21:00</p>
              </article>
            </div>
            <div className="map-placeholder" role="img" aria-label={locale === 'ko' ? '데모 매장 지도' : 'Vị trí cửa hàng demo trên bản đồ'}>
              <span aria-hidden="true">H</span><p>{locale === 'ko' ? '데모 매장 지도' : 'Bản đồ chi nhánh demo'}</p>
            </div>
          </div>

          <form className="form-card" onSubmit={submit}>
            <p className="eyebrow">{locale === 'ko' ? '상담이 필요하신가요?' : 'Cần Hlime tư vấn?'}</p>
            <h2>{locale === 'ko' ? '메시지를 남겨주세요' : 'Để lại lời nhắn'}</h2>
            <p className="muted">{locale === 'ko' ? '이 양식은 프론트엔드 데모이며 실제로 전송되지 않습니다.' : 'Form chỉ mô phỏng giao diện, chưa gửi dữ liệu thật.'}</p>
            <label className="field">
              <span>{locale === 'ko' ? '이름' : 'Họ và tên'}</span>
              <input type="text" name="name" autoComplete="name" required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder={locale === 'ko' ? '이름' : 'Tên của bạn'} />
            </label>
            <label className="field">
              <span>{locale === 'ko' ? '전화번호' : 'Số điện thoại'}</span>
              <input type="tel" name="phone" autoComplete="tel" required value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder={locale === 'ko' ? '예: 090 123 4567' : 'Ví dụ: 090 123 4567'} />
            </label>
            <label className="field">
              <span>{locale === 'ko' ? '문의 내용' : 'Nội dung cần hỗ trợ'}</span>
              <textarea name="message" rows="5" required value={form.message} onChange={(event) => update('message', event.target.value)} placeholder={locale === 'ko' ? '어떤 디저트나 행사를 준비하고 계신가요?' : 'Bạn đang quan tâm món bánh hoặc dịp nào?'} />
            </label>
            <button className="button button--primary button--full" type="submit">{locale === 'ko' ? '데모 메시지 보내기' : 'Gửi thử lời nhắn'}</button>
          </form>
        </div>
      </section>
    </main>
  );
}

