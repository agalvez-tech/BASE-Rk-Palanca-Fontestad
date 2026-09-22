import { cookieBorrar } from '../_auth.js'

export default async function handler(req, res) {
  res.setHeader('Set-Cookie', cookieBorrar())
  res.status(200).json({ ok: true })
}
