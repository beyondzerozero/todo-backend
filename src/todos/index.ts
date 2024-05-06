import { Hono } from "hono";

const app = new Hono();

type Todo = {
  id: number;
  title: string;
  delete_flg: boolean;
};

let todos: Todo[] = [
  { id: 1, title: "React 공부하기", delete_flg: false },
  { id: 2, title: "Next.js 공부하기", delete_flg: false },
  { id: 3, title: "Hono 공부하기", delete_flg: false },
];

/*
 * Todo 목록 얻는 API
 */
app.get("/", (c) => c.json(todos.filter((todo) => !todo.delete_flg)));

/*
 * Todo 등록 API
 */
app.post("/", async (c) => {
  const { title } = await c.req.json<{ title: string }>();
  if (!title) {
    return c.json({ message: "제목은 필수항목입니다." }, 400);
  }
  const newId = todos[todos.length - 1].id + 1;
  const newTodo: Todo = { id: newId, title, delete_flg: false };
  todos = [...todos, newTodo];
  return c.json(newTodo);
});

/*
 * Todo 변경 API
 */
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const index = todos.findIndex((todo) => todo.id === Number(id));

  if (index === -1) {
    return c.json({ message: "Todo가 존재하지 않습니다." }, 404);
  }

  const { title } = await c.req.json<{ title: string }>();
  if (!title) {
    return c.json({ message: "제목은 필수항목이빈다." }, 400);
  }
  todos[index] = { ...todos[index], title };
  return c.json(todos[index]);
});

/*
 * Todo 삭제 API
 */
app.put("/:id/delete", async (c) => {
  const id = c.req.param("id");
  const index = todos.findIndex((todo) => todo.id === Number(id));

  if (index === -1) {
    return c.json({ message: "Todo가 존재하지 않습니다." }, 404);
  }

  todos[index] = { ...todos[index], delete_flg: true };
  return c.json(todos[index]);
});

export default app;
