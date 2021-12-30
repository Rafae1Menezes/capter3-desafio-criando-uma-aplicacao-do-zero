import { GetStaticProps } from 'next';
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
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const post: Post = {
    uid: '123',
    first_publication_date: '15 Mar 2021',
    data: {
      title: 'Como utilizar Hooks',
      subtitle: 'Pensando em sincronização em vez de ciclo de vida',
      author: 'Joseph Oliveira',
    },
  };

  return (
    <div className={commonStyles.container}>
        <img src="logo.svg" alt="logo" className={styles.logo} />
        <ItemListPost post={post} />
         <ItemListPost post={post} />
         <ItemListPost post={post} /> 
        <LoadMore /> 
    </div>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
