```js

```

- serves as a quick overview of React Router v6 with lots of code and minimal explanations.

- For a deeper understanding of concepts, see Main Concepts

- npm install react-router-dom@6

- Reading URL Parameters

Use :style syntax in your route path and useParams() to read them:

Note that the path segment :invoiceId and the param's key params.invoiceId match up.

A very common use-case is fetching data when the component renders:

```js
function Invoice() {
  let { invoiceId } = useParams()
  let invoice = useFakeFetch(`/api/invoices/${invoiceId}`)
  return invoice ? (
    <div>
      <h1>{invoice.customerName}</h1>
    </div>
  ) : (
    <Loading />
  )
}
```

- You can have an index route at any level of the route hierarchy that will render when the parent matches but none of its other children do.

```js
const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/blogs">Blogs</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
}

import { Routes, Route, Link, Outlet, useParams, useNavigate } from "react-router-dom"
;<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />

    <Route path="dashboard" element={<Dashboard />} />

    <Route path="teams" element={<Teams />}>
      <Route index element={<TeamsHome />} />
      <Route path=":teamId" element={<Team />} />
      <Route path="new" element={<NewTeam />} />
    </Route>

    <Route path="invoices" element={<Invoices />}>
      <Route index element={<InvoicesHome />} />
      <Route path=":invoiceId" element={<Invoice />} />
      <Route path="new" element={<NewInvoice />} />
      <Route path="sent" element={<SentInvoices />} />
    </Route>

    <Route path="blogs" element={<Blogs />} />
    <Route path="contact" element={<Contact />} />
    <Route path="*" element={<NotFound />} />
  </Route>
</Routes>

function Home() {
  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="teams">Teams</Link>
    </nav>
  )
}

function Invoices() {
  let navigate = useNavigate()
  return (
    <div>
      <NewInvoiceForm
        onSubmit={async (event) => {
          let newInvoice = await createInvoice(event.target)
          navigate(`/invoices/${newInvoice.id}`)
        }}
      />
    </div>
  )
}

function Invoice() {
  let params = useParams()
  return <h1>Invoice {params.invoiceId}</h1>
}

function Invoice() {
  let { invoiceId } = useParams()
  return <h1>Invoice {invoiceId}</h1>
}
```

- segments of the URL

- the matching child route is rendered with <Outlet>.

- The nested url segments map to nested component trees

- multiple levels of layout nesting.

- a root layout with navigation that persists while the inner page changes with the URL:

- Index routes can be thought of as "default child routes"

- the URL is just at the parent's path

```js
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Activity />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="activity" element={<Activity />} />
      </Route>
    </Routes>
  )
}
```

Relative Links
Relative <Link to> values (that do not begin with a /) are relative to the path of the route that rendered them. The two links below will link to /dashboard/invoices and /dashboard/team because they're rendered inside of <Dashboard>. This is really nice when you change a parent's URL or re-arrange your components because all of your links automatically update.

```js
import { Routes, Route, Link, Outlet } from "react-router-dom"

function Home() {
  return <h1>Home</h1>
}

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="invoices">Invoices</Link> <Link to="team">Team</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="dashboard" element={<Dashboard />}>
        <Route path="invoices" element={<Invoices />} />
        <Route path="team" element={<Team />} />
      </Route>
    </Routes>
  )
}
```

Multiple Sets of Routes
Although you should only ever have a single <Router> in an app, you may have as many <Routes> as you need, wherever you need them. Each <Routes> element operates independently of the others and picks a child route to render.

```js
function App() {
  return (
    <div>
      <Sidebar>
        <Routes>
          <Route path="/" element={<MainNav />} />
          <Route path="dashboard" element={<DashboardNav />} />
        </Routes>
      </Sidebar>

      <MainContent>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="about" element={<About />} />
            <Route path="support" element={<Support />} />
          </Route>
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="invoices" element={<Invoices />} />
            <Route path="team" element={<Team />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainContent>
    </div>
  )
}
```

Descendant <Routes>
You can render a <Routes> element anywhere you need one, including deep within the component tree of another <Routes>. These will work just the same as any other <Routes>, except they will automatically build on the path of the route that rendered them. If you do this, make sure to put a \* at the end of the parent route's path. Otherwise, the parent route won't match the URL when it is longer than the parent route's path, and your descendant <Routes> won't ever show up.

```js
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="dashboard/*" element={<Dashboard />} />
    </Routes>
  )
}

function Dashboard() {
  return (
    <div>
      <p>Look, more routes!</p>
      <Routes>
        <Route path="/" element={<DashboardGraphs />} />
        <Route path="invoices" element={<InvoiceList />} />
      </Routes>
    </div>
  )
}
```

but these are definitely the most common ones you'll use
