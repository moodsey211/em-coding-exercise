import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import reverseString from './reverseString'

Deno.serve(async (req: Request): Promise<Response> => {
  const url = new URL(req.url)
  const text = url.searchParams.get('text')

  if (!text) {
    return new Response('No text provided', {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  return new Response(JSON.stringify({ reversed: reverseString(text) }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/reverse-string' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
