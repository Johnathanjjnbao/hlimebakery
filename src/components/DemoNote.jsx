export default function DemoNote({ children, style }) {
  return <div className="demo-note" style={style}><span aria-hidden="true">ⓘ</span><span>{children}</span></div>;
}

