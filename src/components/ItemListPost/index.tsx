import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

import styles from './itemListPost.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface ItemListPostProps {
  post: Post;
}

export default function ItemListPost({ post }: ItemListPostProps): JSX.Element {
  return (
    <div className={styles.post}>
      <Link href={`/post/${post.uid}`} passHref>
        <h2 className={styles.title}>
          <a>{post.data.title}</a>
        </h2>
      </Link>

      <h3 className={styles.description}>{post.data.subtitle}</h3>
      <div className={styles.info}>
        <FiCalendar />
        <span>
          {format(new Date(post.first_publication_date), 'd LLL yyyy', {
            locale: ptBR,
          })}
        </span>
        <FiUser />
        <span>{post.data.author}</span>
      </div>
    </div>
  );
}
