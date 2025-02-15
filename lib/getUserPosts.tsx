export default async function getUserPosts(userId: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`, { next: { revalidate: 60}})
  // isr: incremental static regernaion
  // revalidate data every 60 seconds

  if (!res.ok) return undefined
    
  return res.json()
}