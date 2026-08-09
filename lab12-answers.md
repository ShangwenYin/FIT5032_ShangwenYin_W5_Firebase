# Assessed Lab 12.2 - Text Answers (D/HD Level)

## Question 1: How to reduce Time To First Byte (TTFB)?

**What is TTFB?**
Time To First Byte (TTFB) is the time between the browser sending a request and receiving the first byte of data from the server. It measures server responsiveness and network latency.

**Ways to reduce TTFB:**

1. **Use a CDN (Content Delivery Network)**: CDNs such as Cloudflare cache static content on edge servers distributed around the world. Users connect to the nearest edge server instead of the origin server, significantly reducing network latency and therefore TTFB.

2. **Server-side caching**: Cache database query results and dynamically generated pages in memory (e.g., Redis, Memcached) so that repeated requests are served from cache without re-running expensive logic.

3. **Optimise the web server**: Use a high-performance server such as Nginx, enable HTTP/2 (and HTTP/3), and tune worker processes and connection pools. HTTP/2 reduces latency through multiplexing.

4. **Reduce server processing time**: Optimise database queries (add indexes), avoid heavy synchronous operations, and make external API calls asynchronous where possible.

5. **Edge computing / Serverless**: Move logic closer to the user using edge functions (e.g., Cloudflare Workers) so responses are generated at the network edge rather than a distant origin.

6. **Minimise DNS lookup time**: Use DNS prefetching and fast DNS providers, reduce the number of external domains that need DNS resolution.

7. **Keep-alive connections**: Maintain persistent connections between the browser and server to avoid repeated TCP handshake overhead.

8. **Choose a geographically closer hosting region**: Hosting your server in the same region as your main users reduces round-trip time.

---

## Question 2: What is Hotlinking and how to avoid your site being hotlinked?

**What is Hotlinking?**
Hotlinking (or "leeching") is the practice of embedding images or other media from another website directly into your own pages by referencing the original URL (e.g., `<img src="https://yoursite.com/image.jpg">`). The hotlinking site uses your server bandwidth without hosting the file itself, costing you bandwidth and slowing down your site.

**How to prevent hotlinking:**

1. **Configure the web server to block hotlinking (Referer check)**:
   - **Nginx**: Use the `valid_referers` directive in the server or location block to only allow requests that come from your own domain; deny requests with missing or foreign Referer headers.
   - **Apache**: Use `RewriteCond %{HTTP_REFERER}` with mod_rewrite to block requests not originating from your domain.

2. **Use a CDN's anti-hotlinking feature**: CDN providers (Cloudflare, Alibaba Cloud CDN) offer built-in "Referer anti-leech" / "Hotlink protection" settings. You specify your allowed domain list and the CDN rejects or replaces other referrers.

3. **Add a watermark or dynamic URL tokens**: Watermark your images so even if they are hotlinked the content is branded. Use time-limited signed URLs (token authentication) so links expire, preventing long-term hotlinking.

4. **Use JavaScript to verify the page origin**: Serve images via a script that checks `document.referrer` or `window.location.hostname` and only loads the image when the page is your own domain.

5. **Monitor your access logs**: Check server logs for requests from unusual Referer domains to detect hotlinking early, then block the offending domains.

6. **Disable hotlinking at the server/edge level**: As a last resort, serve a placeholder image (e.g., a warning image) instead of the real asset when the request comes from a foreign referer.
