import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Commenter from '../../components/Commenter';

function calcTime(content): string {
  const totalPalavras = content.reduce((acc, actual) => {
    const text = RichText.asText(actual.body);
    const tamanho = text.split(' ').length;

    return acc + tamanho;
  }, 0);

  const minutos = Math.ceil(totalPalavras / 200);

  return `${minutos} min`;
}

interface Post {
  uid: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
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
  edit: string;
  prevpost: Post | null;
  nextpost: Post | null;
}

export default function Post({
  post,
  edit,
  prevpost,
  nextpost,
}: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <div className={styles.loading}>Carregando...</div>;
  }

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
            <FiCalendar />

            <span>
              {format(new Date(post.first_publication_date), 'd LLL yyyy', {
                locale: ptBR,
              })}
            </span>

            <FiUser />
            <span>{post.data.author}</span>
            <FiClock />
            <span>{calcTime(post.data.content)}</span>
          </div>
          <div className={styles.edit}>{edit}</div>

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

        <div className={styles.separator} />

        {(prevpost || nextpost) && (
          <div className={styles.buttons}>
            {nextpost && (
              <div className={styles.nextpost}>
                <Link href={`/post/${nextpost.uid}`} passHref>
                  <a>{nextpost.data.title}</a>
                </Link>
                <span>Post Anterior</span>
              </div>
            )}
            {prevpost && (
              <div className={styles.prevpost}>
                <Link href={`/post/${prevpost.uid}`} passHref>
                  <a>{prevpost.data.title}</a>
                </Link>
                <span>Próximo Post</span>
              </div>
            )}
          </div>
        )}

        <Commenter />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    { orderings: '[document.first_publication_date desc]' }
  );

  const paths = posts.results.reduce((acc, post, index) => {
    if (index < 2) return [...acc, { params: { slug: post.uid } }];
    return acc;
  }, []);

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  let edit = '';

  const response = await prismic.getByUID('post', `${slug}`, {
    pageSize: 2,
    page: 1,
  });

  const prevpost = (
    await prismic.query(Prismic.predicates.at('document.type', 'post'), {
      pageSize: 1,
      after: `${response.id}`,
      orderings: '[document.first_publication_date desc]',
    })
  ).results;

  const nextpost = (
    await prismic.query(Prismic.predicates.at('document.type', 'post'), {
      pageSize: 1,
      after: `${response.id}`,
      orderings: '[document.first_publication_date]',
    })
  ).results;

  console.log(response);

  if (response?.first_publication_date !== response?.last_publication_date) {
    const date = format(
      new Date(response.last_publication_date),
      "d LLL yyyy', às' H:m",
      {
        locale: ptBR,
      }
    );
    edit = `* editado em ${date}`;
  }

  return {
    props: {
      post: response,
      edit,
      prevpost: prevpost.length ? prevpost[0] : null,
      nextpost: nextpost.length ? nextpost[0] : null,
    } as PostProps,
    revalidate: 60 * 30, // 30 minutos
  };
};
