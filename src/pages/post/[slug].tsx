import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';

import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  return (
    <>
      <div className={commonStyles.container}>
        <Header />
      </div>

      <div className={styles.banner}>
        <Image src={post.data.banner.url} alt="banner" layout="fill" />
      </div>

      <div className={commonStyles.container}>
        <article className={styles.article}>
          <h1>{post.data.title}</h1>
          <div className={styles.info}>
            <FiCalendar /> {post.first_publication_date}
            <FiUser /> {post.data.author}
            <FiClock /> 4 min
          </div>

          {post.data.content.map((part, index) => (
            <div key={part.heading}>
              {console.log(part)}
              <h2>{part.heading}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(part.body) }}
              />
            </div>
          ))}
        </article>
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  //   const prismic = getPrismicClient();
  //   const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', slug, {});

  const post: Post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'd LLL yyyy',
      { locale: ptBR }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.author1.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
  };
};
