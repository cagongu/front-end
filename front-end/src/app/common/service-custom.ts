import { Service } from "./service";

export interface ServiceCustom {
  serviceCustomId: string;
  service: Service;
  serviceMetrics: number;
  isActive: boolean;
}