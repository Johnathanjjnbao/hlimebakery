export default function SectionHeading({ eyebrow, title, text, action, center = false }) {
  return (
    <div className={`section-heading${center ? ' section-heading--center' : ''}`}>
      <div className="section-heading__copy">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {title && <h2>{title}</h2>}
        {text && <p>{text}</p>}
      </div>
      {action}
    </div>
  );
}

