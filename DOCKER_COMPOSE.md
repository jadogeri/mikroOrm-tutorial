<h2 style="font-family: sans-serif;">Step-by-Step Explanation of the Docker Compose file:</h2>

<div style="font-family: 'Courier New', Courier, monospace; font-size: 16px; line-height: 1.5; max-width: 800px;">
  
  <h3 style="border-bottom: 2px solid #333; margin-top: 30px;">--- Docker Compose File Structure ---</h3>

  <h4 style="margin-bottom: 5px;">1. Version Specification</h4>
  <p style="margin-top: 0;">This specifies the version of the Docker Compose file format. Version 3.8 is recommended for 2026 to access the latest features.</p>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #333; overflow-x: auto;"><code>version: '3.8'</code></pre>

  <h4 style="margin-bottom: 5px;">2. Services Definition</h4>
  <p style="margin-top: 0;">The top-level key that defines the different containers making up your application stack.</p>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #333; overflow-x: auto;"><code>services:</code></pre>

  <h4 style="margin-bottom: 5px;">3. Service Name</h4>
  <p style="margin-top: 0;">Custom name for your service (e.g., node-app, web-service, api).</p>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #333; overflow-x: auto;"><code>node-app:</code></pre>

  <h4 style="margin-bottom: 5px;">4. Build Context</h4>
  <p style="margin-top: 0;">Instructs Docker to build the image using the Dockerfile in the current directory (.).</p>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #333; overflow-x: auto;"><code>build: .</code></pre>

  <h4 style="margin-bottom: 5px;">5. Port Mapping</h4>
  <p style="margin-top: 0;">Maps host port 3000 to container port 3000 for local access.</p>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #333; overflow-x: auto;"><code>ports:
  - "3000:3000"</code></pre>

  <h4 style="margin-bottom: 5px;">6. Restart Policy</h4>
  <p style="margin-top: 0;">Ensures the container restarts automatically if it crashes or the system reboots.</p>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #333; overflow-x: auto;"><code>restart: always</code></pre>

  <h4 style="margin-bottom: 5px;">7. Environment Variables</h4>
  <p style="margin-top: 0;">Sets internal variables to ensure consistency across development and production.</p>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #333; overflow-x: auto;"><code>environment:
  - PORT=3000</code></pre>

  <h3 style="border-bottom: 2px solid #333; margin-top: 40px;">--- Basic Lifecycle ---</h3>

  <h4 style="margin-bottom: 5px;">Build and Start (Foreground)</h4>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #007acc; overflow-x: auto;"><code>docker compose up</code></pre>

  <h4 style="margin-bottom: 5px;">Build and Start (Background/Detached)</h4>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #007acc; overflow-x: auto;"><code>docker compose up -d</code></pre>

  <h4 style="margin-bottom: 5px;">Force Rebuild and Start</h4>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #007acc; overflow-x: auto;"><code>docker compose up --build -d</code></pre>

  <h4 style="margin-bottom: 5px;">Stop and Cleanup</h4>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #cc0000; overflow-x: auto;"><code>docker compose down</code></pre>

  <h4 style="margin-bottom: 5px;">Stop Running Containers</h4>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #cc0000; overflow-x: auto;"><code>docker compose stop</code></pre>

  <h4 style="margin-bottom: 5px;">Start Stopped Containers</h4>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #007acc; overflow-x: auto;"><code>docker compose start</code></pre>

  <h3 style="border-bottom: 2px solid #333; margin-top: 40px;">--- Building ---</h3>

  <h4 style="margin-bottom: 5px;">Build/Rebuild All Services</h4>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #333; overflow-x: auto;"><code>docker compose build</code></pre>

  <h4 style="margin-bottom: 5px;">Build Specific Service</h4>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #333; overflow-x: auto;"><code>docker compose build &lt;service_name&gt;</code></pre>

  <h3 style="border-bottom: 2px solid #333; margin-top: 40px;">--- Other Useful Commands ---</h3>

  <h4 style="margin-bottom: 5px;">View Logs</h4>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #333; overflow-x: auto;"><code>docker compose logs -f</code></pre>

  <h4 style="margin-bottom: 5px;">List Running Services</h4>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #333; overflow-x: auto;"><code>docker compose ps</code></pre>

  <h4 style="margin-bottom: 5px;">Run One-off Command</h4>
  <pre style="background: #f4f4f4; padding: 12px; border-left: 4px solid #333; overflow-x: auto;"><code>docker compose run &lt;service_name&gt; &lt;command&gt;</code></pre>
</div>
