export type Building = "Caleres1" | "Caleres2";
export type Provider = "Staffmark" | "A1";

export interface Employee {
  name: string;
  id: string;
  building: Building;
  provider: Provider;
}
