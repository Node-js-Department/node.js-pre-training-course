import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import { ToDoList } from '../solutions/task-01/ToDoList';
import { ToDoItem } from '../solutions/task-02/ToDoItem';
import { AddToDo } from '../solutions/task-03/AddToDo';
import { CompleteToDoList } from '../solutions/task-04/CompleteToDoList';
import { FilteredToDoList } from '../solutions/task-05/FilteredToDoList';
import { ActiveCount } from '../solutions/task-06/ActiveCount';
import { StyledToDoItem } from '../solutions/task-07/StyledToDoItem';
import { FetchToDos } from '../solutions/task-08/FetchToDos';
import { Card } from '../solutions/task-09/Card';
import { AddToDoForm } from '../solutions/task-10/AddToDoForm';

// 1. ToDoList
test('ToDoList renders todo titles', () => {
  render(<ToDoList todos={[{ id: 1, title: 'Test', completed: false }]} />);
  expect(screen.getByText('Test - not completed')).toBeInTheDocument();
});

// 2. ToDoItem
test('ToDoItem shows title and completed status', () => {
  render(<ToDoItem todo={{ id: 1, title: 'Test', completed: true }} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
  expect(screen.getByText(/completed/i)).toBeInTheDocument();
});

// 3. AddToDo
test('AddToDo adds a new todo when the form is submitted', () => {
  render(<AddToDo />);
  const input = screen.getByPlaceholderText(/add todo/i);
  fireEvent.change(input, { target: { value: 'Buy milk' } });
  fireEvent.click(screen.getByRole('button', { name: /add/i }));
  expect(screen.getByText('Buy milk')).toBeInTheDocument();
});

// 4. CompleteToDoList
test('CompleteToDoList marks a todo as completed when its Complete button is clicked', () => {
  render(<CompleteToDoList />);
  fireEvent.change(screen.getByPlaceholderText(/add todo/i), { target: { value: 'Buy milk' } });
  fireEvent.click(screen.getByRole('button', { name: /add/i }));
  expect(screen.getByText('Buy milk')).toBeInTheDocument();

  const beforeClick = document.body.textContent;
  fireEvent.click(screen.getByRole('button', { name: /complete/i }));

  // The task doesn't mandate a specific completed-state UI, but clicking
  // Complete must visibly change something -- a click that's a no-op
  // (the stub's behavior) is a failure regardless of which convention
  // the rest of the markup ends up using.
  expect(document.body.textContent).not.toBe(beforeClick);
});

// 5. FilteredToDoList
test('FilteredToDoList filters todos by completion status', () => {
  render(<FilteredToDoList />);
  fireEvent.change(screen.getByPlaceholderText(/add todo/i), { target: { value: 'Buy milk' } });
  fireEvent.click(screen.getByRole('button', { name: /add/i }));
  expect(screen.getByText('Buy milk')).toBeInTheDocument();

  // Newly added todos are not completed, so the Completed filter should hide it...
  fireEvent.click(screen.getByRole('button', { name: /^completed$/i }));
  expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();

  // ...while Active and All should still show it.
  fireEvent.click(screen.getByRole('button', { name: /^active$/i }));
  expect(screen.getByText('Buy milk')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /^all$/i }));
  expect(screen.getByText('Buy milk')).toBeInTheDocument();
});

// 6. ActiveCount
test('ActiveCount shows number of active todos', () => {
  render(<ActiveCount todos={[
    { id: 1, title: 'A', completed: false },
    { id: 2, title: 'B', completed: true }
  ]} />);
  expect(screen.getByText(/1 active/i)).toBeInTheDocument();
});

// 7. StyledToDoItem
test('StyledToDoItem applies the CSS Module "completed" class only when completed', () => {
  const { container, rerender } = render(
    <StyledToDoItem todo={{ id: 1, title: 'Test', completed: true }} />
  );
  expect(screen.getByText('Test')).toBeInTheDocument();
  expect(container.querySelector('.completed')).not.toBeNull();

  rerender(<StyledToDoItem todo={{ id: 1, title: 'Test', completed: false }} />);
  expect(container.querySelector('.completed')).toBeNull();
});

// 8. FetchToDos
test('FetchToDos renders with loading state', () => {
  render(<FetchToDos />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

// 9. Card
test('Card renders children inside a styled wrapper', () => {
  const { container } = render(<Card><span>Content</span></Card>);
  expect(screen.getByText('Content')).toBeInTheDocument();
  expect(container.firstElementChild?.className).toMatch(/card/i);
});

// 10. AddToDoForm
test('AddToDoForm adds a todo on submit and clears the input', () => {
  render(<AddToDoForm />);
  const input = screen.getByPlaceholderText(/add todo/i) as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'Buy milk' } });
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByText('Buy milk')).toBeInTheDocument();
  expect(input.value).toBe('');
});
