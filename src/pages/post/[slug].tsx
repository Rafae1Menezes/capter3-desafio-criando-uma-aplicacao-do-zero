import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { useRouter } from 'next/router';

import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

function calcTime(content): string {
  const totalPalavras = content.reduce((acc, actual) => {
    const text = RichText.asText(actual.body);
    const tamanho = text.split(/(\w+)/g).length;

    return acc + tamanho;
  }, 0);

  const minutos = Math.ceil(totalPalavras / 200);

  return `${minutos} minutos`;
}

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
  const router = useRouter();
  return (
    <>
      <div className={commonStyles.container}>
        <Header />
      </div>

      <div className={styles.banner}>
        <Image src={post.data.banner.url} alt="banner" layout="fill" />
      </div>

      <div className={commonStyles.container}>
        {router.isFallback ? (
          <div>Loading...</div>
        ) : (
          <article className={styles.article}>
            <h1>{post.data.title}</h1>
            <div className={styles.info}>
              <FiCalendar /> {post.first_publication_date}
              <FiUser /> {post.data.author}
              <FiClock /> {calcTime(post.data.content)}
            </div>

            {post.data.content.map(part => (
              <div key={part.heading}>
                <h2>{part.heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(part.body),
                  }}
                />
              </div>
            ))}
          </article>
        )}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {}
  );

  const uids = posts.results.map(post => post.uid);

  const paths = [
    { params: { slug: `${uids[0]}` } },
    { params: { slug: `${uids[1]}` } },
  ];

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', `${slug}`, {
    pageSize: 2,
    page: 1,
  });

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
    revalidate: 60 * 30, // 30 minutos
  };
};
