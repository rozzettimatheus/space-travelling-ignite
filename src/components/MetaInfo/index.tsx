import { ReactElement, ReactNode } from 'react';
import { IconBaseProps } from 'react-icons';

import styles from './meta-info.module.scss';

interface MetaInfoProps {
  children: ReactNode;
  icon: ReactElement<IconBaseProps>;
}

export function MetaInfo({ children, icon }: MetaInfoProps): JSX.Element {
  return (
    <span className={styles.metaInfo}>
      {icon}
      {children}
    </span>
  );
}
