import React, { useCallback, useRef, useState } from 'react';
import Post from '../../UI/Post/Post';
import usePost from '../../hooks/usePosts/usePosts';

function IntersectionObserverExample() {

  const [pageNum, setPageNum] = useState(1)

  const {
    result,
    isLoading,
    isError,
    error,
    hasNextPage,
  } = usePost(pageNum)

  // const lastPostRef = useRef(null)
  const intObserver = useRef<IntersectionObserver | null>(null)

  const lastPostRef = useCallback((post: HTMLDivElement | null) => {

    console.log("lastPostRef", post)

    // если уже загружаем пост ничего не делаем
    if (isLoading || !hasNextPage) return

    // проверяем что у нас есть обзервер и убираем его если он есть
    if (intObserver.current) intObserver.current.disconnect()

    // объявляем обзервер и передаем функцию которая вызоветься при срабатывании
    intObserver.current = new IntersectionObserver((posts) => {
      console.log(posts)
      if (posts[0].isIntersecting) {
        console.log('We are near the last post!')
        setPageNum(prev => prev + 1)
      }
    })

    // если в ref записалась node тогда можно наблюдать за div
    if (post) intObserver.current.observe(post)

  }, [isLoading, hasNextPage])

  if (isError) {
    return <div>Error: {error}</div>
  }

  const content = result.map((post, i) => {
    if (result.length === i + 1) {
      return <Post key={post.id} {...post} ref={lastPostRef} />
    }
    return <Post key={post.id} {...post} />
  })

  return (
    <div className='App container mx-auto w-[500px]'>
      <h1 id="top" className='text-center text-lg m-6'>&infin; Infinite Query &amp; Scroll<br />&infin; Ex. 1 - React only</h1>
      {content}
      <p className="center m-4 text-slate-400"><a href="#top">Back to Top</a></p>
    </div>
  );
}

export default IntersectionObserverExample;