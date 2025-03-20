import { Pool, PoolClient } from 'pg'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let pool: Pool
let client: PoolClient
const anonClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false
  },
  db: {
    schema: 'public'
  }
})
const serviceClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false
  },
  db: {
    schema: 'public'
  }
})

const TEST_EMAIL_DOMAIN = '@example.com'
const DEFAULT_PASSWORD = 'asdfasdf'

beforeAll(async () => {
  pool = new Pool({ connectionString: process.env.DATABASE_URL })
  client = await pool.connect()
})

beforeEach(async () => {
  // Clear out the database except for the seed data
  const usersToDelete = await client.query(`select id from auth.users where email like '%${TEST_EMAIL_DOMAIN}'`)
  const userIds = usersToDelete.rows.map((u) => u.id)
  await client.query(`delete from public.users where auth_user_id = ANY($1)`, [userIds])
  await client.query(`delete from auth.users where id = ANY($1)`, [userIds])
  await client.query("DELETE FROM public.courses_likes")
  await client.query("DELETE FROM public.courses")

  await serviceClient.auth.admin.createUser({
    email: 'test1@unittest.com',
    password: DEFAULT_PASSWORD,
    email_confirm: true,
  })
  await serviceClient.auth.admin.createUser({
    email: 'test2@unittest.com',
    password: DEFAULT_PASSWORD,
    email_confirm: true,
  })

  await client.query("INSERT INTO public.courses (title) VALUES ('test course 1')")
  await client.query("INSERT INTO public.courses_likes (user_id, course_id) SELECT a.id, b.id FROM public.users a, public.courses b")
})

const login = async (email: string): Promise<[SupabaseClient, string]> => {
  const {
    data: { session }
  } = await anonClient.auth.signInWithPassword({
    email,
    password: DEFAULT_PASSWORD
  })

  return [
    createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      },
      auth: {
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    }),
    session.user.id
  ]
}

describe('users', () => {
  /**
   * Items to take note of:
   * - update_at column is missing in the courses_likes table and it will cause an error if not added
   * - registration tests is flaky and will fail from time to time
   * - screenshot of this test running is in the docs/screenshots/support.png
   */
  it('can only view their own data', async () => {
    const [user1, user1Id] = await login('test1@unittest.com');

    const { data: user1Courses, error } = await user1.from('courses_likes').select('*');
    expect(error).toBeNull();
    expect(user1Courses.length).toBe(1);

    const { rows: userDetails } = await client.query('select * from public.users where auth_user_id = $1', [user1Id])
    expect(userDetails.length).toBe(1);
    expect(userDetails[0].auth_user_id).toBe(user1Id);
    expect(user1Courses[0].user_id).toBe(userDetails[0].id);
  })

  it('super admins should be able to view all users', async () => {
    const { data: users, error } = await serviceClient.from('users').select('*');
    expect(error).toBeNull();
    expect(users.length).toBe(2);
  })
})

describe('registration', () => {
  it('can self register', async () => {
    const email = `test${TEST_EMAIL_DOMAIN}`
    await anonClient.auth.signUp({
      email,
      password: DEFAULT_PASSWORD
    })
    const { rows: users } = await client.query('select id from auth.users where email = $1', [email])
    expect(users.length).toBe(1)
    const { rows: userProfiles } = await client.query('select * from public.users where auth_user_id = $1', [
      users[0].id
    ])
    expect(userProfiles.length).toBe(1)
    expect(userProfiles[0].auth_user_id).toBe(users[0].id)
  })
})

afterAll(async () => {
  await client.release()
  await pool.end()
})
