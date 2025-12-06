import { useState, useEffect } from "react";

function ApiTest() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  async function testEndpoint(name, url, options = {}) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const res = await fetch(url, {
        method: options.method || "GET",
        headers: { "Content-Type": "application/json", ...options.headers },
        credentials: "include",
        signal: controller.signal,
        ...options,
      });
      
      clearTimeout(timeoutId);
      
      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        data = { text };
      }
      
      return {
        success: res.ok,
        status: res.status,
        data,
      };
    } catch (error) {
      let errorMessage = error.message;
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout - Backend server may not be running';
      } else if (error.message === 'Failed to fetch') {
        errorMessage = 'Failed to fetch - Check if backend server is running at http://127.0.0.1:8000';
      }
      return {
        success: false,
        error: errorMessage,
        errorType: error.name,
      };
    }
  }

  async function runAllTests() {
    setLoading(true);
    const tests = {
      "Health Check": await testEndpoint("Health", "http://127.0.0.1:8000/api/health/"),
      "Recipes List": await testEndpoint("Recipes", "http://127.0.0.1:8000/api/recipes/?limit=5"),
      "Categories": await testEndpoint("Categories", "http://127.0.0.1:8000/api/categories/"),
      "Test DB": await testEndpoint("Test DB", "http://127.0.0.1:8000/api/test-db/"),
    };
    setResults(tests);
    setLoading(false);
  }

  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1>API Connection Test</h1>
      <button onClick={runAllTests} disabled={loading} style={{ marginBottom: 20, padding: "10px 20px" }}>
        {loading ? "Testing..." : "Run Tests Again"}
      </button>
      {Object.entries(results).map(([name, result]) => (
        <div key={name} style={{ marginBottom: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
          <h3>{name}</h3>
          {result.success ? (
            <div style={{ color: "green" }}>
              ✓ Success (Status: {result.status})
              <pre style={{ background: "#f5f5f5", padding: 10, borderRadius: 4, overflow: "auto" }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div style={{ color: "red" }}>
              ✗ Failed
              {result.status && <div>Status: {result.status}</div>}
              {result.error && <div>Error: {result.error}</div>}
              {result.data && (
                <pre style={{ background: "#f5f5f5", padding: 10, borderRadius: 4, overflow: "auto" }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      ))}
      <div style={{ marginTop: 20, padding: 16, background: "#fff3cd", borderRadius: 8 }}>
        <h3>Troubleshooting:</h3>
        <ol>
          <li><strong>Check if Django server is running:</strong>
            <ul>
              <li>Open terminal/command prompt</li>
              <li>Navigate to: <code>cd recipe_back</code></li>
              <li>Run: <code>python manage.py runserver</code></li>
              <li>You should see: <code>Starting development server at http://127.0.0.1:8000/</code></li>
            </ul>
          </li>
          <li><strong>Test backend directly:</strong>
            <ul>
              <li>Open in browser: <a href="http://127.0.0.1:8000/api/health/" target="_blank">http://127.0.0.1:8000/api/health/</a></li>
              <li>If this works, the backend is running</li>
              <li>If this fails, the backend is not running</li>
            </ul>
          </li>
          <li><strong>Check browser console (F12):</strong>
            <ul>
              <li>Look for CORS errors</li>
              <li>Look for network errors</li>
              <li>Check if requests are being blocked</li>
            </ul>
          </li>
          <li><strong>Verify ports:</strong>
            <ul>
              <li>Backend should be on: <code>http://127.0.0.1:8000</code></li>
              <li>Frontend should be on: <code>http://localhost:5173</code></li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default ApiTest;

