import React, { useCallback, useRef, useState } from 'react';
import Post, { IPost } from '../../UI/Post/Post';
import usePost from '../../hooks/usePosts/usePosts';
import { useInfiniteQuery } from 'react-query';
import { getPostsPage } from '../../api/axios';

const infQueryFn = ({ pageParam = 1 }) => getPostsPage(pageParam)

const ingQueryComporator = (lastPage: IPost[], allPages: IPost[][]) => {
  return lastPage.length ? allPages.length + 1 : undefined
}

function ObserverReactQuery() {

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    data,
    error,
  } = useInfiniteQuery(
    '/posts',
    infQueryFn,
    {
      getNextPageParam: ingQueryComporator
    })

  // const lastPostRef = useRef(null)
  const intObserver = useRef<IntersectionObserver | null>(null)

  const lastPostRef = useCallback((post: HTMLDivElement | null) => {

    console.log(isFetchingNextPage, !hasNextPage)

    // если уже загружаем пост ничего не делаем
    if (isFetchingNextPage || !hasNextPage) return

    // проверяем что у нас есть обзервер и убираем его если он есть
    if (intObserver.current) intObserver.current.disconnect()

    // объявляем обзервер и передаем функцию которая вызоветься при срабатывании
    intObserver.current = new IntersectionObserver((posts) => {
      if (posts[0].isIntersecting) {
        console.log('We are near the last post!')
        fetchNextPage()
      }
    })

    // если ref определен тогда можно наблюдать за div
    if (post) intObserver.current.observe(post)

  }, [isFetchingNextPage, hasNextPage])

  if (isError) {
    return <div>Error: {String(error)}</div>
  }

  const content = data?.pages.map(pg => {
    return pg.map((post, i) => {
      if (pg.length === i + 1) {
        return <Post ref={lastPostRef} key={post.id} {...post} />
      }
      return <Post key={post.id} {...post} />
    })
  })

  return (
    <div className='App container mx-auto w-[500px]'>
      <h1 id="top" className='text-center text-lg m-6'>&infin; Infinite Query &amp; Scroll<br />&infin; Ex. 1 - React only</h1>
      {content}
      <p className="center m-4 text-slate-400"><a href="#top">Back to Top</a></p>
    </div>
  );
}

export default ObserverReactQuery;