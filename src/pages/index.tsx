import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import * as Prismic from '@prismicio/client';

import { getPrismicClient } from '../services/prismic';

import { PostItem } from '../components/PostItem';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

export interface Post {
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
  const [posts, setPosts] = useState(postsPagination.results ?? []);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [loading, setLoading] = useState(false);

  function formatPost(raw: any): Post {
    return {
      uid: raw.uid,
      first_publication_date: raw.first_publication_date,
      data: {
        title: raw.data.title,
        subtitle: raw.data.subtitle,
        author: raw.data.author,
      },
    };
  }

  async function onPaginatePosts(url: string): Promise<void> {
    setLoading(true);

    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      const { results, next_page } = await response.json();
      const formattedPosts = results.map(formatPost);

      setPosts([...posts, ...formattedPosts]);
      setNextPage(next_page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Posts | Space Travelling</title>
      </Head>

      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {posts?.map(post => (
            <PostItem key={post.uid} {...post} />
          ))}

          {!!nextPage &&
            (loading ? (
              <div className={styles.loading}>Carregando...</div>
            ) : (
              <button
                type="button"
                className={styles.loadMore}
                onClick={() => onPaginatePosts(nextPage)}
              >
                Carregar mais posts
              </button>
            ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      pageSize: 2,
    }
  );

  const results: Post[] = postsResponse.results.map(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results,
      },
    },
  };
};
