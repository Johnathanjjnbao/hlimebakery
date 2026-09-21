import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { localizedPath } from '../utils/i18n';

export default function AppLink({ to, children, ...props }) {
  const { locale } = useApp();
  return <Link to={localizedPath(to, locale)} {...props}>{children}</Link>;
}

