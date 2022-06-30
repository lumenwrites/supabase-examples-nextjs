import { useUser } from '@supabase/auth-helpers-react'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Auth } from '@supabase/ui'

const LoginPage  = ({ user }) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient.from('test').select('*').single()
      setData(data)
    }
    if (user) loadData()
  }, [user])

  if (!user)
    return (
      <>
        <button
          onClick={() => {
            supabaseClient.auth.signIn(
              { provider: 'github' },
              { scopes: 'repo' }
            )
          }}
        >
          GitHub with scopes
        </button>
        <Auth
          // view="update_password"
          supabaseClient={supabaseClient}
          providers={['google', 'github']}
          // scopes={{github: 'repo'}} // TODO: enable scopes in Auth component.
          socialLayout="horizontal"
          socialButtonSize="xlarge"
        />
      </>
    )

  return (
    <>
      <p>
        [<Link href="/profile">withPageAuth</Link>] | [
        <Link href="/protected-page">supabaseServerClient</Link>] |{' '}
        <button
          onClick={() =>
            supabaseClient.auth.update({ data: { test5: 'updated' } })
          }
        >
          Update
        </button>
      </p>
      <p>user:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>client-side data fetching with RLS</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default LoginPage

import { getUser } from '@supabase/auth-helpers-nextjs'

export async function getServerSideProps({ req, res }) {
  const { user } = await getUser({ req, res }) // Access the user object
  console.log('[getServerSideProps] User:', user)
  return { props: { user } }
}
