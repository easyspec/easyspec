import type { Field } from "../types";

export const EXAMPLE_FORM_FIELDS: Field[] = [
  {
    name: "appConfig",
    type: "object",
    title: "Application Configuration",
    description: "Example demonstrating all field types",
    children: [
      // Text field with validation
      {
        name: "serviceName",
        type: "text",
        title: "Service Name",
        placeholder: "my-service",
        description: "Unique service identifier",
        required: true,
        regex: "^[a-z][a-z0-9-]*$",
        validationMessage: "Lowercase letters, numbers, and hyphens only",
        links: [
          {
            text: "Service naming conventions",
            url: "https://kubernetes.io/docs/concepts/overview/working-with-objects/names/",
          },
        ],
      },
      // Number field
      {
        name: "port",
        type: "number",
        title: "Port",
        value: 3000,
        description: "Service port number",
      },
      // Boolean field
      {
        name: "debugMode",
        type: "boolean",
        title: "Debug Mode",
        value: false,
        description: "Enable verbose logging",
      },
      // Enum (dropdown) field
      {
        name: "environment",
        type: "enum",
        title: "Environment",
        required: true,
        options: [
          { value: "development", label: "Development" },
          { value: "staging", label: "Staging" },
          { value: "production", label: "Production" },
        ],
      },
      // Multiselect field
      {
        name: "features",
        type: "multiselect",
        title: "Features",
        description: "Enable features",
        options: [
          { value: "auth", label: "Authentication" },
          { value: "api", label: "REST API" },
          { value: "websockets", label: "WebSockets" },
          { value: "cache", label: "Caching" },
          { value: "metrics", label: "Metrics" },
        ],
        value: ["auth", "api"],
      },
      // Nested object
      {
        name: "database",
        type: "object",
        title: "Database",
        description: "Database configuration",
        children: [
          {
            name: "host",
            type: "text",
            title: "Host",
            placeholder: "localhost",
            value: "localhost",
            required: true,
          },
          {
            name: "port",
            type: "number",
            title: "Port",
            value: 5432,
          },
          {
            name: "ssl",
            type: "boolean",
            title: "Use SSL",
            value: true,
          },
        ],
      },
      // Array field
      {
        name: "endpoints",
        type: "array",
        title: "API Endpoints",
        description: "List of endpoints",
        maxItems: 5,
        children: [
          {
            name: "0",
            type: "object",
            title: "Endpoint",
            children: [
              {
                name: "path",
                type: "text",
                title: "Path",
                placeholder: "/api/users",
                value: "/api/users",
                required: true,
              },
              {
                name: "method",
                type: "enum",
                title: "Method",
                options: [
                  { value: "GET", label: "GET" },
                  { value: "POST", label: "POST" },
                  { value: "PUT", label: "PUT" },
                  { value: "DELETE", label: "DELETE" },
                ],
                value: "GET",
              },
              {
                name: "public",
                type: "boolean",
                title: "Public",
                value: false,
              },
            ],
          },
        ],
      },
    ],
  },
];
