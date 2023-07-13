import React from 'react'

/*
  body: "eos qui et ipsum ipsam suscipit aut\nsed omnis non odio\nexpedita earum mollitia molestiae aut atque rem suscipit\nnam impedit esse"
  id: 22
  title: "dolor sint quo a velit explicabo quia nam"
  userId:3
*/

export interface IPost {
  id: number;
  userId: number;
  body: string;
  title: string;
}

const Post = React.forwardRef<HTMLDivElement | null, IPost>((props, ref) => {

  const classNames = "bg-emerald-200 text-left border border-emerald-500 p-4 mt-4 last-of-type:mb-4 rounded-md bg"

  const content = <>
    <div>{props.title}</div>
    <div className='text-right text-xs'>{props.id}</div>
  </>

  if (ref) {
    return <article className={classNames} ref={ref}>{content}</article>
  }

  return <article className={classNames}>{content}</article>

})

export default React.memo(Post)