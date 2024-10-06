import { NextApiRequest, NextApiResponse } from 'next';
import { addUser, getUserByUsername } from '@/lib/users';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    if (getUserByUsername(username)) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const newUser = addUser({ username, password, isAdmin: false });
    res.status(201).json({ success: true, user: { id: newUser.id, username: newUser.username } });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}