import { NextApiRequest, NextApiResponse } from 'next'
import { getUserByUsername } from '@/lib/users'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // In a real app, you'd check the session or JWT token here
  // For this example, we'll just check if there's a user in localStorage
  const username = req.cookies.username

  if (username) {
    const user = getUserByUsername(username)
    if (user) {
      res.status(200).json({ authenticated: true, isAdmin: user.isAdmin })
    } else {
      res.status(401).json({ authenticated: false })
    }
  } else {
    res.status(401).json({ authenticated: false })
  }
}