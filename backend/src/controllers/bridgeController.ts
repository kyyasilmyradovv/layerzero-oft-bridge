import { Request, Response } from 'express';
import { request, gql } from 'graphql-request';

// GraphQL query to fetch bridge transfers for a specific user
const GET_BRIDGE_HISTORY = gql`
  query GetBridgeHistory($userAddress: Bytes!) {
    bridgeTransfers(
      where: { user: $userAddress }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      user
      amount
      dstChainId
      timestamp
    }
  }
`;

const SUBGRAPH_URL = 'http://localhost:8000/subgraphs/name/simple-oft';

export const getBridgeHistory = async (req: Request, res: Response) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'User address is required' });
    }

    // Convert address to lowercase for consistent querying
    const userAddress = (address as string).toLowerCase();

    try {
      // Query the subgraph for bridge transfers
      const data = await request<{
        bridgeTransfers: {
          amount: string;
          dstChainId: string;
          timestamp: string;
        }[];
      }>(SUBGRAPH_URL, GET_BRIDGE_HISTORY, {
        userAddress,
      });

      // Format the response data
      const formattedHistory = data.bridgeTransfers.map((transfer: any) => ({
        amount: transfer.amount,
        dstChain: transfer.dstChainId,
        timestamp: parseInt(transfer.timestamp),
      }));

      res.json(formattedHistory);
    } catch (subgraphError) {
      console.error('Subgraph error:', subgraphError);

      // Return empty array if subgraph fails
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching bridge history:', error);
    res.status(500).json({ error: 'Failed to fetch bridge history' });
  }
};
