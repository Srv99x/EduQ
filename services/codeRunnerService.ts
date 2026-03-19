type RunnerLanguage = 'python' | 'javascript' | 'typescript';

interface RunCodeResponse {
  stdout: string;
  stderr: string;
  output: string;
  exit_code: number;
}

const RUN_PATH = '/api/code/run';

const getRunnerEndpoints = (): string[] => {
  const envBase = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined;
  const bases = [envBase, '', 'http://localhost:8000'];
  const endpoints = bases
    .filter((base): base is string => Boolean(base !== undefined))
    .map((base) => (base ? `${base.replace(/\/$/, '')}${RUN_PATH}` : RUN_PATH));

  return Array.from(new Set(endpoints));
};

export const runCode = async (code: string, language: RunnerLanguage, stdin = ''): Promise<string> => {
  const endpoints = getRunnerEndpoints();
  let lastError = 'Runner request failed.';

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language, stdin }),
      });

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = (await response.json()) as RunCodeResponse | { detail?: string };

        if (!response.ok) {
          lastError = (data as { detail?: string }).detail || `Code execution failed (${response.status}).`;
          continue;
        }

        const okData = data as RunCodeResponse;
        const stdout = (okData.stdout || '').trim();
        const stderr = (okData.stderr || '').trim();
        const output = (okData.output || '').trim();

        if (okData.exit_code === 0) {
          return stdout || output || 'Program executed with no output.';
        }

        const errorLines: string[] = [];
        errorLines.push('Runtime Error');
        if (stderr) {
          errorLines.push(stderr);
        } else if (output) {
          errorLines.push(output);
        } else {
          errorLines.push('Execution failed with no error message from provider.');
        }

        if (stdout) {
          errorLines.push('');
          errorLines.push('Program Output Before Failure');
          errorLines.push(stdout);
        }

        return errorLines.join('\n');
      }

      const text = await response.text();
      const shortText = text.trim().slice(0, 140);

      if (!response.ok) {
        lastError = shortText || `Runner endpoint returned HTTP ${response.status}.`;
        continue;
      }

      lastError = 'Runner returned a non-JSON response. Ensure backend is running and reachable at http://localhost:8000.';
    } catch (error) {
      lastError =
        error instanceof Error
          ? error.message
          : 'Network error while contacting runner service.';
    }
  }

  throw new Error(lastError);
};
