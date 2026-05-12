export default async function Page() {
  // console.log("feriends page...")

  const data = await fetch("http://localhost:3000/api/friendsdb", {
    method: "GET",
  })
  const posts = await data.json()
  // console.log(posts)
  return (
    <main>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.name}</li>
        ))}
      </ul>
    </main>
  )
}
