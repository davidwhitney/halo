# HALO - Framework Documentation

A lightweight TypeScript web framework with routing, middleware, and React server-side rendering support.

## Features

- Flexible routing system with wildcards and parameter capture
- Middleware pipeline for request processing
- Action results with content negotiation
- React server-side rendering support
- TypeScript-first development

## Usage

Install the package from npm:

```bash
npm install halo
```

Create a new application with a routing table and start the server:

```typescript
import React from 'react';
import { Application } from 'halo';
import { json, redirect, stringResult } from 'halo/results';

// 1. Create application instance
const app = new Application();

// 2. Define routes
app.configuration.router
  // Basic string response
  .get('/', async (ctx) => stringResult('Welcome to HALO!'))

  // Return objects with content negotiation - JSON by default
  .get('/api/users/{id}', async (ctx) => {
    const { id } = ctx.params;
    return { id, name: 'John Doe' };
  })

  // React component rendering
  .get('/profile', ProfileComponent)

  // Error handling
  .get('/error', async () => {
    throw new Error('Something went wrong');
  })

  // Wildcard routing
  .get('/files/{path:*}', async (ctx) => {
    const { path } = ctx.params;
    const contents = await readFile(path + '.txt', 'utf8');
    return content(contents, 'text/plain');
  });

// 3. Start the server
app.listen(3000);

// React component example
function ProfileComponent(props: Context) {
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Method: {props.request.method}</p>
    </div>
  );
}
```

## Routing

Basic routing is handled through the RouteTable class:

```typescript
const app = new Application();
app.configuration.router
  .get('/hello', async (ctx) => 'Hello World!')
  .post('/api/items', async (ctx) => json({ success: true }))
  .get('/users/{id}', async (ctx) => `User ${ctx.params.id}`);
```

### Route Parameters and Wildcards

The routing system supports wildcards and parameter capture:

```typescript
// Wildcard capture
.get('/files/{path:*}', ctx => stringResult(ctx.params.path))

// Parameter with regex constraint
.get('/users/{id:[0-9]+}', ctx => stringResult(ctx.params.id))

// Multiple parameters
.get('/posts/{year}/{month}/{slug}', ctx => stringResult(ctx.params.slug))

// Wildcard without capture
.get('/static/*', ctx => stringResult('Static files'))
```

## Middleware

Middleware executes in a chain before and after route handling:

```typescript
new Application({
  middleware: [
    LoggingMiddleware,
    ErrorHandlingMiddleware,
    // RouterMiddleware is automatically added last
  ]
});
```

You can create your own middleware by implementing the IMiddleware interface:

```typescript
class LoggingMiddleware implements IMiddleware {
  async execute(ctx: Context, next: NextFunction) {
    console.log(`Request: ${ctx.request.url}`);
    await next();
    console.log(`Response: ${ctx.response.statusCode}`);
  }
}
```

## Action Results

Action Results control response generation:

```typescript
// Built-in results
return json({ data: 'value' });
return stringResult('Hello');
return redirect('/login');
return notFound();
return xml({ root: 'value' });
return statusCode(404);
return empty();
```

ActionResults are responsible for formatting response data for the output stream.

### Adding Custom Action Results

Create a class implementing IActionResult:

```typescript
class CustomJsonResult implements IActionResult {
  constructor(private data: any) {}
  
  executeResult(output: IOutputChannel) {
    output.writeHeaders(200, {'Content-Type': 'application/custom'});
    output.writeBody(JSON.stringify(this.data));
    output.end();
  }
}
```

### Content Negotiation

The framework automatically handles content negotiation based on Accept headers whenever
you return an object from a route handler:

```typescript
// Returns JSON or XML based on Accept header
return { data: 'value' };

// Force JSON response - no negotiation
return json({ data: 'value' });
```

Content negotiation will be bypassed if you return an IActionResult directly.

## React Server Rendering

Three ways to use React components:

```typescript
// Pass component directly
.get('/page1', MyComponent)

// Return from handler
.get('/page2', async (ctx) => <MyComponent {...ctx} />)

// Pass pre-rendered element
.get('/page3', <MyComponent />)
```

Components receive the Context object as props:

```typescript
function MyComponent(props: Context) {
  return <div>Method: {props.request.method}</div>;
}
```
