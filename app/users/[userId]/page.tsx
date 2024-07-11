import getUser from "@/lib/getUser"
import getUserPosts from "@/lib/getUserPosts"
import { Suspense } from "react"
import UserPosts from "./components/UserPosts"
import { Metadata } from "next"
import getAllUsers from "@/lib/getAllUsers"
import { notFound } from "next/navigation"

type Params = {
  params: {
    userId: string
  }
}

export async function generateMetadata({ params: { userId }}: Params): Promise<Metadata> {
  // console.log(`Hello from the console!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
  // console.log(userId)
  const userData: Promise<User> = getUser(userId)
  const user: User = await userData

  if (user == undefined) {
    return {
      title: 'User Not Found'
    }
  }

  return {
    title: user.name,
    description: `This is the page of ${user.name}`
  }
}

export default async function UserPage({ params: { userId }}: Params) {
  const userData: Promise<User> = getUser(userId)
  const userPostsData: Promise<Post[]> = getUserPosts(userId)

  // const [user, userPosts] = await Promise.all([userData, userPostsData])

  const user = await userData

  if (user == undefined) return notFound()

  return (
    <>
      <h2>{user.name}</h2>
      <br/>
      <Suspense fallback={<h2>Loading... </h2>}>
        <UserPosts promise={userPostsData} />
      </Suspense>
    </>
  )
}

// creates ssg (Static Site Generators)
// when the users page is opened all the indavidual users are requested by the api 
// they are no longer being dynamically rendered by the server when you click on the user
// they get isr (incremental static regeneration) every 60 seconds if there is a change

// returns every path member that is dynamic
// for this case this is an array of type Users with their user ids
export async function generateStaticParams() {
  const usersData: Promise<User[]> = getAllUsers()
  const users = await usersData

  // params need to be a string
  return users.map(user => (
    {
      userId: user.id.toString()
    }
  ))
}