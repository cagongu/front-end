import { Service } from "./service";

export interface ServiceCustom {
    serviceCustomId: string;
    service: Service;
    isActive: boolean;
  }