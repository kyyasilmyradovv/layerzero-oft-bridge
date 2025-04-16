import { BigInt, Address } from '@graphprotocol/graph-ts';
import {
  SimpleOFT,
  Transfer as TransferEvent,
  Bridged as BridgedEvent,
} from '../generated/SimpleOFT/SimpleOFT';
import { BridgeTransfer, Transfer, Token } from '../generated/schema';

// Handle standard ERC20 transfer events
export function handleTransfer(event: TransferEvent): void {
  let token = Token.load('1');

  if (token == null) {
    token = new Token('1');
    let contract = SimpleOFT.bind(event.address);
    token.name = contract.name();
    token.symbol = contract.symbol();
    token.totalSupply = BigInt.fromI32(0);
    token.txCount = BigInt.fromI32(0);
  }

  token.txCount = token.txCount.plus(BigInt.fromI32(1));

  let transferId =
    event.transaction.hash.toHexString() + '-' + event.logIndex.toString();
  let transfer = new Transfer(transferId);
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.amount = event.params.value;
  transfer.timestamp = event.block.timestamp;

  transfer.save();
  token.save();
}

// Handle bridging events for cross-chain transfers
export function handleBridged(event: BridgedEvent): void {
  let id =
    event.transaction.hash.toHexString() + '-' + event.logIndex.toString();
  let bridgeTransfer = new BridgeTransfer(id);

  bridgeTransfer.user = event.params.user;
  bridgeTransfer.amount = event.params.amount;
  bridgeTransfer.dstChainId = event.params.dstChainId;
  bridgeTransfer.timestamp = event.block.timestamp;

  bridgeTransfer.save();
}
