import { Router } from 'express';
import { ITodo } from '../model/todo'

const router = Router();

const todos: ITodo[] = [
  { id: 1, text: 'Learn TypeScript', completed: false },
  { id: 2, text: 'Build a Node.js app', completed: false },
  { id: 3, text: 'Write tests', completed: false },
];


router.get('/todos', (req, res, next) => {
  res.json({todos});
});

router.post('/todos', (req, res, next) => {
  const { id, text, completed } = req.body;
  
  const newTodo: ITodo = { id, text, completed };
  todos.push(newTodo);

  res.json({newTodo});
});

router.put('/todos/:id', (req, res, next) => {
  const todoId = parseInt(req.params.id);
  const { text, completed } = req.body;

  const todoIndex = todos.findIndex(todo => todo.id === todoId);
  if (todoIndex !== -1) {
    todos[todoIndex] = { id: todoId, text, completed };
    res.json({ updatedTodo: todos[todoIndex] });
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
})

router.delete('/todos/:id', (req, res, next) => {
  const todoId = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === todoId);
  if (todoIndex !== -1) {
    const deletedTodo = todos.splice(todoIndex, 1)[0];
    res.json({ deletedTodo });
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

export default router;