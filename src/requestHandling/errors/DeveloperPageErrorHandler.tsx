import { Logger } from "../../observability/Logger";
import { ContentResult } from "../results/ContentResult";
import { IActionResult } from "../results/IActionResult";

export function DeveloperPageErrorHandler(error: unknown): IActionResult {    
    Logger.error("Pipeline error", error);
    const page = formatError(error);
    return new ContentResult(page, 'text/html', 500);
}

function formatError(error: unknown): string {
    const message = error instanceof Error ? error.message : 'An error occurred';
    const stack = error instanceof Error ? error.stack : undefined;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>HALO Error - ${message}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            margin: 0;
            background-color: #f5f5f5;
        }
        .error-container {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #fff;
            color: #333;
        }
        .error-header {
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
        }
        .error-title {
            color: #dc3545;
            font-size: 2rem;
            margin: 0 0 1rem 0;
        }
        .error-message {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 2rem;
        }
        .error-stack {
            background-color: #f8f9fa;
            padding: 1rem;
            border-radius: 4px;
            overflow: auto;
            font-family: monospace;
            font-size: 0.9rem;
            border: 1px solid #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <header class="error-header">
            <h1 class="error-title">HALO Developer Error Page</h1>
            <p class="error-message">${message}</p>
        </header>
        <h2>Stack</h2>
        <pre class="error-stack">${stack}</pre>

        <h2>Details</h2>
        <pre class="error-stack">${JSON.stringify(error)}</pre>

        <h3>Warning</h3>        
        <p>This page is intended for developers and may contain sensitive information.</p>
        <p>You should disable this page in production.</p>
    </div>
</body>
</html>`;
}