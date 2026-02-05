# Mermaid Diagrams for Confluence - Privacy Policy

**Last updated:** February 5, 2026

## Overview

Mermaid Diagrams for Confluence ("the App") is an Atlassian Forge app that renders Mermaid diagram syntax as visual diagrams within Confluence pages. This privacy policy describes how the App handles data.

## Data Collection and Storage

### What We Collect

The App processes the following data, all of which is stored within Atlassian's Forge platform:

- **Mermaid diagram code**: The diagram syntax you write in the macro configuration. This is stored as part of the Confluence page content via the standard Forge macro config mechanism.
- **Cached external content**: If you use the External URL feature, the App fetches the content from the URL you specify and caches it in Forge App Storage. The cache stores the fetched text content, the URL, and a timestamp.

### What We Do NOT Collect

- No personal information (names, emails, IP addresses)
- No analytics or tracking data
- No data is sent to third-party services
- No cookies are used

## Data Processing

All data processing occurs within the Atlassian Forge platform:

- Diagram rendering happens client-side in your browser using the Mermaid.js library
- External URL fetching is performed by the Forge backend (server-side) to the URLs you explicitly configure
- Cached content is stored in Forge App Storage, which is scoped to your Atlassian site

## External Network Requests

When using the External URL feature, the App's backend makes HTTP GET requests to the URL you provide. Supported domains are restricted to:

- `*.githubusercontent.com`
- `*.github.com`
- `*.gitlab.com`
- `*.bitbucket.org`

No other external network requests are made.

## Data Retention

- Macro configuration data is retained as part of your Confluence page content
- Cached external content is retained in Forge App Storage until overwritten by a fresh fetch
- Uninstalling the App removes all Forge App Storage data

## Data Portability and Deletion

- All diagram source code is visible in the macro configuration and can be copied at any time
- Uninstalling the App removes all cached data from Forge App Storage
- Page content (including macro configuration) follows standard Confluence data management

## Third-Party Libraries

The App uses the following open-source library for rendering:

- **Mermaid.js** (MIT License) - Renders diagram syntax into SVG images, running entirely in the browser

## Changes to This Policy

We may update this privacy policy from time to time. Changes will be reflected in the "Last updated" date above.

## Contact

For privacy-related questions, please open an issue on our support repository or contact us through the Atlassian Marketplace listing.
