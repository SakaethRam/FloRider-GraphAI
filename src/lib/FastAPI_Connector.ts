/* ================================
   FASTAPI BASE CONFIG
================================ */

const BASE_URL = "http://localhost:8000";

/* ================================
   TYPES
================================ */

export interface LLMResponse {
  text: string;
  raw?: any;
}

export interface GraphResponse {
  nodes_and_edges: string[];
}

export interface TableResponse {
  entities: string[];
  relationships: { from: string; to: string; type: string }[];
  table: Record<string, any>[];
  description?: string;
}

/* ================================
   LLM API (FILE + PROMPT)
================================ */

export const getLLMResponse = async ({
  prompt,
  file,
  model = "graph",
}: {
  prompt: string;
  file?: File | null;
  model?: "flo" | "graph";
}): Promise<LLMResponse> => {
  try {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("model", model);

    if (file) {
      formData.append("file", file);
    }

    const res = await fetch(`${BASE_URL}/llm`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("LLM API failed");
    }

    return await res.json();
  } catch (err) {
    console.error("LLM Connector Error:", err);
    return { text: "LLM request failed" };
  }
};

/* ================================
   GRAPH API (FILE → NODES/EDGES)
================================ */

export const getGraphResponse = async (
  file: File
): Promise<GraphResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/graph`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Graph API failed");
    }

    return await res.json();
  } catch (err) {
    console.error("Graph Connector Error:", err);
    return { nodes_and_edges: [] };
  }
};

/* ================================
   TABLE API (JSON → ER GRAPH)
================================ */

export const getTableResponse = async (
  data: Record<string, any>[]
): Promise<TableResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/table`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Table API failed");
    }

    return await res.json();
  } catch (err) {
    console.error("Table Connector Error:", err);

    return {
      entities: [],
      relationships: [],
      table: [],
      description: "Failed to generate table insights",
    };
  }
};

/* ================================
   🔥 SMART ROUTER (OPTIONAL)
   Auto decide which API to call
================================ */

export const analyzeInput = async ({
  prompt,
  file,
  tableData,
}: {
  prompt?: string;
  file?: File | null;
  tableData?: Record<string, any>[];
}) => {
  try {
    // PRIORITY 1: TABLE
    if (tableData && tableData.length) {
      return {
        type: "table",
        data: await getTableResponse(tableData),
      };
    }

    // PRIORITY 2: GRAPH (file-based dataset)
    if (file) {
      return {
        type: "graph",
        data: await getGraphResponse(file),
      };
    }

    // PRIORITY 3: LLM
    return {
      type: "llm",
      data: await getLLMResponse({
        prompt: prompt || "",
      }),
    };
  } catch (err) {
    console.error("Analyze Error:", err);
    return {
      type: "error",
      data: null,
    };
  }
};