// app/users/page.js
import Search from "../components/Search"

export default function Page() {
  return (
    <main>
      <h1>Users update</h1>

      <Search />

      {/* Pro tip: Use this to see the raw JSON structure while coding */}
      {/*<pre>{JSON.stringify(data, null, 2)}</pre>*/}
    </main>
  )
}
