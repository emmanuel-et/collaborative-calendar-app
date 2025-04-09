import { ObjectId } from "mongodb";

export enum CalendarRole {
    OWNER = "owner",
    EDITOR = "editor",
    VIEWER = "viewer"
}
export interface CalendarInput {
    name: string;
    members: {
        [userId: string]: CalendarRole
    }
}

export interface Calendar extends CalendarInput {
    _id?: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
