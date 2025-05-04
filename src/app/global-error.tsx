'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Erro crítico do sistema
            </h2>
            <p className="text-gray-600 mb-4">
              Ocorreu um erro grave. Por favor, tente novamente.
            </p>
            <button
              onClick={reset}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
