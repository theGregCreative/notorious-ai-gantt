import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByUsername } from '@/lib/users';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const user = getUserByUsername(username);

    if (user && user.password === password) {
      // In a real app, you'd use a proper session management or JWT here
      res.status(200).json({ success: true, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}