import { FiCalendar, FiUser } from 'react-icons/fi';

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
      <h2 className={styles.title}>{post.data.title}</h2>
      <h3 className={styles.description}>{post.data.subtitle}</h3>
      <div className={styles.info}>
        <FiCalendar />
        {post.first_publication_date}
        <FiUser />
        {post.data.author}
      </div>
    </div>
  );
}
