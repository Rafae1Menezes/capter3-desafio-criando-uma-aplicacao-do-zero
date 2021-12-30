import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

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

export default function Post({ Post }: PostProps): JSX.Element {
  return (
    <>
      <div className={commonStyles.container}>
        <Header />
      </div>

      <div className={styles.banner}>
        <Image src="/banner.png" alt="banner" layout="fill" />
      </div>

      <div className={commonStyles.container}>
        <article className={styles.article}>
          <h1>Criando um app CRA do zero</h1>
          <div className={styles.info}>
          <FiCalendar /> 15 Mar 2021 
          <FiUser /> Joseph Oliveira 
          <FiClock /> 4 min
          </div>

          <h2>Proin et varius</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <p>
            Nullam dolor sapien, vulputate eu diam at, condimentum hendrerit
            tellus. Nam facilisis sodales felis, pharetra pharetra lectus auctor
            sed.
          </p>
          <p>
            Ut venenatis mauris vel libero pretium, et pretium ligula faucibus.
            Morbi nibh felis, elementum a posuere et, vulputate et erat. Nam
            venenatis.
          </p>

          <h2>Cras laoreet mi</h2>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.{' '}
            <a href="#">Laboriosam veniam dicta ad voluptatibus</a> delectus
            fugiat natus, aliquam perspiciatis! Dolorem commodi alias maiores
            asperiores iusto qui, cupiditate ad ut nihil et! delectus
            fugiat natus, aliquam perspiciatis! Dolorem commodi alias maiores
            asperiores iusto qui, cupiditate ad ut nihil et! delectus
            fugiat natus, aliquam perspiciatis! Dolorem commodi alias maiores
            asperiores iusto qui, cupiditate ad ut nihil et!
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam
            veniam dicta ad voluptatibus delectus fugiat natus, aliquam
            perspiciatis! Dolorem commodi alias maiores asperiores iusto qui,
            cupiditate ad ut nihil et! aliquam perspiciatis! Dolorem commodi alias maiores
            asperiores iusto qui, cupiditate ad ut nihil et! delectus
            fugiat natus, aliquam perspiciatis! Dolorem commodi alias maiores
            asperiores iusto qui, cupiditate ad ut nihil et! delectus
            fugiat natus, aliquam perspiciatis! Dolorem commodi alias maiores
            asperiores iusto qui, cupiditate ad ut nihil et!
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam
            veniam dicta ad voluptatibus delectus fugiat natus, aliquam
            perspiciatis! Dolorem commodi alias maiores asperiores iusto qui,
            cupiditate ad ut nihil et! aliquam perspiciatis! Dolorem commodi alias maiores
            asperiores iusto qui, cupiditate ad ut nihil et! delectus
            fugiat natus, aliquam perspiciatis! Dolorem commodi alias maiores
            asperiores iusto qui, cupiditate ad ut nihil et! delectus
            fugiat natus, aliquam perspiciatis! Dolorem commodi alias maiores
            asperiores iusto qui, cupiditate ad ut nihil et!
          </p>
        </article>
      </div>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
