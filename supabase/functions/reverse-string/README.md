# Function: `reverse-string`

## Description

This function reverses a string.

## Parameters

- `text`: The string to reverse.

## Return Value

- `reversed`: The reversed string.

## Example Usage

```bash
curl -X GET http://localhost:54321/functions/v1/reverse-string?text=hello \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

## Response

```json
{
  "reversed": "olleh"
}
```
