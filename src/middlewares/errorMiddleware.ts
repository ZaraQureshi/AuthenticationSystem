// import { Context } from 'hono';
// import { AuthError, DatabaseError, PermissionError, RequestError, UnprocessableError } from '../utility/errors';

// export const errorMiddleware = (err: any, c: any) => {

//     if (err instanceof AuthError) return c.json({ error: err.message }, err.statusCode);
//     if (err instanceof RequestError) return c.json({ error: err.message }, err.statusCode);
//     if (err instanceof PermissionError) return c.json({ error: err.message }, err.statusCode);
//     if (err instanceof DatabaseError) return c.json({ error: err.message }, err.statusCode);
//     if (err instanceof UnprocessableError) return c.json({ error: err.message }, err.statusCode);

//     console.error(err.stack);
//     return c.json({ error: 'Something went wrong!', details: err.message }, 500);
// };

