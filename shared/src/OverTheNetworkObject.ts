export enum ObjectType { Ping = 0, ConnectOrReconnect, RequestRoom, Room, RequestSync, Sync, RequestMessage, Message }
export enum BidEmotion { laugh = 0, neutral, indecisive }
export type OverTheNetworkObject = Int8Array;

export abstract class Converter {
    
}