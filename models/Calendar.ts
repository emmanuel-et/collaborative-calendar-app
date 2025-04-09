import { ObjectId } from "mongodb";

export enum CalendarRole {
    OWNER = "owner",
    EDITOR = "editor",
    VIEWER = "viewer"
}

export type Memberships = {
    [id: string]: CalendarRole
}
export interface CalendarInput {
    name: string;
    members: Memberships // [userId] -> role
}

export interface Calendar extends CalendarInput {
    _id?: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
