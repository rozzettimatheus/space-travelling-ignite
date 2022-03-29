import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Post } from '../../pages';
import styles from './post-item.module.scss';
import { MetaInfo } from '../MetaInfo';

type PostProps = Post;

export function PostItem({
  data,
  uid,
  first_publication_date,
}: PostProps): JSX.Element {
  function formatPublicationDate(date: string): string {
    return format(new Date(date), 'dd MMM yyyy', {
      locale: ptBR,
    });
  }

  return (
    <Link href={`/post/${uid}`}>
      <a key={uid} className={styles.post}>
        <strong className={styles.title}>{data.title}</strong>
        <p className={styles.subtitle}>{data.subtitle}</p>
        <div>
          <MetaInfo icon={<FiCalendar size={16} />}>
            <time>{formatPublicationDate(first_publication_date)}</time>
          </MetaInfo>

          <MetaInfo icon={<FiUser size={16} />}>
            <span>{data.author}</span>
          </MetaInfo>
        </div>
      </a>
    </Link>
  );
}
