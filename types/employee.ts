import { ObjectId } from "mongodb";

export type Building = "Caleres1" | "Caleres2";
export type Provider = "Staffmark" | "A1";

export interface Employee {
  _id?: ObjectId;
  id: string;
  name: string;
  building: Building;
  provider: Provider;
}
