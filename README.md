# `tig`

`tig` is a Firefox extension that allows you to tag pages with a color and some text.

`tig` may be useful for tagging pages in:

- Large documentation sites as:
  - Read (green)
  - Reading (yellow)
  - Unread (red)
- Revision sites as:
  - Mastered (green)
  - Learnt (yellow)
  - Need Help (orange)
  - Not Learnt (red)

## Development

### Testing Locally (on Firefox)

1. Open the `about:debugging` page
2. Click **This Firefox**
3. Click **Load Temporary Add-on**
4. Select _any_ file in your extension's directory

### Building

```
$ npm init
$ npm install
$ npm run build
```