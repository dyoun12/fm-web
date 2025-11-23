import { getPost } from "@/api/posts";
import { PostDetail } from "@/app/components/organisms/post-detail/post-detail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FM 게시물",
  description: ""
}

export default async function Post({params}: { params: Promise<{ postId: string }>}) {
  const { postId } = await params;
  const post = await getPost(postId);

  return (
    <section aria-labelledby="post-detail" className="mx-auto w-full max-w-[800px] px-6 py-12">
      <PostDetail 
        title={post.title}
        category={post.category}
        author={post.author ?? "FM Corp"}
        publishedAt={post.createdAt}
        content={post.content}      
      />
    </section>
  )
}