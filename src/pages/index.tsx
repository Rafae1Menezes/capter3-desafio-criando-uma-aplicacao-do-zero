import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';


import ItemListPost from '../components/ItemListPost';
import LoadMore from '../components/LoadMore';


import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  posts: Post[];
}

export default function Home({
  postsPagination,
  posts,
}: HomeProps): JSX.Element {
  return (
    <div className={commonStyles.container}>
      <img src="logo.svg" alt="logo" className={styles.logo} />
      {posts.map(post => (
        <ItemListPost key={post.uid} post={post} />
      ))}
      <LoadMore />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query('', {
    pageSize: 100,
    lang: '*',
    page: 1,
  });

  const posts: Post[] = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.last_publication_date),
        'd LLL yyyy',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      posts,
    },
  };
};
