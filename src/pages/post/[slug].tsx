/* eslint-disable react/no-danger */
import { useMemo } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import * as Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../services/prismic';

import { MetaInfo } from '../../components/MetaInfo';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { estimateTotalReading } from '../../utils/estimate-total-reading';

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

  const totalTime = useMemo(
    () => estimateTotalReading(post.data.content),
    [post.data.content]
  );

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | Space Travelling</title>
      </Head>

      <main>
        <section>
          <div className={styles.banner}>
            <img src={post.data.banner.url} alt="banner" />
          </div>

          <article className={`${styles.post} ${commonStyles.container}`}>
            <h1>{post.data.title}</h1>

            <div className={styles.postInformation}>
              <MetaInfo icon={<FiCalendar size={16} />}>
                <time>
                  {format(
                    new Date(post.first_publication_date),
                    'dd MMM yyyy',
                    {
                      locale: ptBR,
                    }
                  )}
                </time>
              </MetaInfo>

              <MetaInfo icon={<FiUser size={16} />}>
                <span>{post.data.author}</span>
              </MetaInfo>

              <MetaInfo icon={<FiClock size={16} />}>
                <span>{totalTime} min</span>
              </MetaInfo>
            </div>

            <div className={styles.postContent}>
              {post.data.content?.map((section, idx) => (
                <div key={String(idx + 1)} className={styles.postSection}>
                  <h3 className={styles.sectionTitle}>{section.heading}</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(section.body),
                    }}
                  />
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      pageSize: 5,
    }
  );

  const paths = posts.results.map(item => ({
    params: { slug: item.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ctx => {
  const prismic = getPrismicClient();
  const { slug } = ctx.params;

  const { data, first_publication_date, uid } = await prismic.getByUID(
    'post',
    String(slug)
  );

  return {
    props: {
      post: {
        data,
        first_publication_date,
        uid,
      },
    },
  };
};
