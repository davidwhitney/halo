import React from 'react';
import { Logger } from "../../observability/Logger";
import { IActionResult } from "../results/IActionResult";
import { ReactComponentResult } from "../results/ReactComponentResult";

export function DeveloperPageErrorHandler(error: unknown): IActionResult {    
    Logger.error("Pipeline error", error);

    const component = <ErrorPage 
        stack={error instanceof Error ? error.stack : undefined}
        message={error instanceof Error ? error.message : undefined}
        full={error}
    />;

    return new ReactComponentResult(component, null);
}

function ErrorPage(props: { stack?: string, message?: string, full?: unknown }) {
    const styles = {
        container: {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
            backgroundColor: '#fff',
            color: '#333'
        },
        header: {
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: '1rem',
            marginBottom: '2rem'
        },
        title: {
            color: '#dc3545',
            fontSize: '2rem',
            margin: '0 0 1rem 0'
        },
        message: {
            fontSize: '1.2rem',
            color: '#666',
            marginBottom: '2rem'
        },
        pre: {
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            border: '1px solid #e0e0e0'
        }
    };

    return (
        <html>
        <head>
            <title>Internal Server Error - {props.message}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body style={{ margin: 0, backgroundColor: '#f5f5f5' }}>
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.title}>Internal Server Error</h1>
                    {props.message && <p style={styles.message}>{props.message}</p>}
                </header>
                {props.stack && <pre style={styles.pre}>{props.stack}</pre>}
                {<pre style={styles.pre}>{JSON.stringify(props.full, null, 2)}</pre>}
            </div>
        </body>
        </html>
    );
}