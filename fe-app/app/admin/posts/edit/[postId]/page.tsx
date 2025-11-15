import { EditPostController } from "@/app/components/organisms/edit-post-controller/edit-post-controller"
export default async function Page({ params }: {
  params: Promise<{ postId: string }>
}) {
  const { postId } = await params;

  return (
    <EditPostController postId={postId}/>
  )
}
