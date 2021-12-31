import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { useState } from 'react';

import ItemListPost from '../components/ItemListPost';

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

function formatPosts(posts): Post[] {
  const postsFormated: Post[] = posts.map(post => {
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

  return postsFormated;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [isAllLoad, setisAllLoad] = useState(false);

  const loadPage = async (): Promise<void> => {
    const res = await fetch(nextPage)
      .then(response => response.json())
      .then(data => data);

    if (res.results.length) {
      const newPosts = formatPosts(res.results);
      setPosts([...posts, ...newPosts]);
      setNextPage(res.next_page);
    }
    if (res.total_pages === res.page) setisAllLoad(true);
  };

  const handleLoad = (): void => {
    loadPage();
  };

  return (
    <div className={commonStyles.container}>
      <img src="logo.svg" alt="logo" className={styles.logo} />

      {posts.map(post => (
        <ItemListPost key={post.uid} post={post} />
      ))}

      <button
        type="button"
        className={`${styles.botao} ${isAllLoad ? styles.desactived : ''}`}
        onClick={handleLoad}
      >
        Carregar Mais
      </button>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  // refazer esse query
  const postsResponse = await prismic.query('', {
    pageSize: 2,
    page: 1,
  });

  const posts: Post[] = formatPosts(postsResponse.results);

  const postPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination: postPagination,
    },
  };
};
