import { Pet } from '../../enterprise/entities/pet';
import { PaginationParams } from '@/core/repositories/pagination-params';

export abstract class PetsRepository {
  abstract findById(id: string): Promise<Pet | null>;
  abstract findManyByOrgId(
    orgId: string,
    params: PaginationParams,
  ): Promise<Pet[]>;
  abstract findManyByOrgCity(
    orgCity: string,
    params: PaginationParams,
  ): Promise<Pet[]>;

  abstract create(pet: Pet): Promise<void>;
  abstract save(pet: Pet): Promise<void>;
  abstract delete(pet: Pet): Promise<void>;
}