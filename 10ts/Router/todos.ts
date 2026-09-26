import { Router } from 'express';

const router = Router();

const todos = [
  { id: 1, title: 'Learn TypeScript', completed: false },
  { id: 2, title: 'Build a Node.js app', completed: false },
  { id: 3, title: 'Write tests', completed: false },
];


router.get('/todos', (req, res, next) => {
  res.json(todos);
});

export default router;