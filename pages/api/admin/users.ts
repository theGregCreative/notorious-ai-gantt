import { NextApiRequest, NextApiResponse } from 'next';
import { getUsers, deleteUser, updateUser } from '@/lib/users';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // In a real app, you'd check if the user is authenticated and is an admin here

  if (req.method === 'GET') {
    const users = getUsers().map(({ id, username, isAdmin }) => ({ id, username, isAdmin }));
    res.status(200).json(users);
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    deleteUser(id as string);
    res.status(200).json({ success: true });
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const updates = req.body;
    const updatedUser = updateUser(id as string, updates);
    if (updatedUser) {
      res.status(200).json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}