import { useState } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser } from 'react-icons/fi';

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
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const handleLoad = (): void => {
    fetch(nextPage)
      .then(response => response.json())
      .then(data => {
        setPosts([...posts, ...data.results]);
        setNextPage(data.next_page);
      });
  };

  return (
    <div className={commonStyles.container}>
      <img src="logo.svg" alt="logo" className={styles.logo} />
      {posts.map(post => (
        <div key={post.uid} className={styles.post}>
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
      ))}
      {nextPage && (
        <button
          type="button"
          className={styles.botao}
          onClick={() => handleLoad()}
        >
          Carregar mais posts
        </button>
      )}
      s
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {
      pageSize: 2,
      page: 1,
      orderings: '[document.first_publication_date desc]',
    }
  );

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: postsResponse.results,
      },
    } as HomeProps,
  };
};
