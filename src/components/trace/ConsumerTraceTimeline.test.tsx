import { render, screen, waitFor } from "@/test/test-utils";
import { ConsumerTraceTimeline } from "./ConsumerTraceTimeline";

describe("ConsumerTraceTimeline", () => {
  const mockFetch = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>();
  global.fetch = mockFetch as unknown as typeof fetch;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders timeline records when fetch succeeds", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        traceRecords: [
          {
            id: "1",
            action: "REGISTERED",
            location: "Farm A",
            notes: null,
            expireDate: null,
            actor: { name: "Alice", role: "PRODUCER", company: "Farm Co" },
            transactionHash: "0x123",
            etherscanLink: "https://example.com/tx/0x123",
            createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
          },
        ],
      }),
    };

    mockFetch.mockResolvedValue(mockResponse as unknown as Response);

    render(<ConsumerTraceTimeline productId="test-id" />);

    await waitFor(() =>
      expect(screen.getByText(/Product journey/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/Farm A/i)).toBeInTheDocument();
    expect(screen.getByText(/Product registered/i)).toBeInTheDocument();
  });

  it("shows error message on failed fetch", async () => {
    const mockResponse = {
      ok: false,
      json: async () => ({ error: "Product not found" }),
    };

    mockFetch.mockResolvedValue(mockResponse as unknown as Response);

    render(<ConsumerTraceTimeline productId="missing-id" />);

    await waitFor(() =>
      expect(screen.getByText(/Product not found/i)).toBeInTheDocument()
    );
  });

  it("shows empty state when no records", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ traceRecords: [] }),
    };

    mockFetch.mockResolvedValue(mockResponse as unknown as Response);

    render(<ConsumerTraceTimeline productId="empty" />);

    await waitFor(() =>
      expect(screen.getByText(/No trace records yet/i)).toBeInTheDocument()
    );
  });
});
