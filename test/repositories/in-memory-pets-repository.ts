import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PetAttachmentsRepository } from '@/domain/main/application/repositories/pet-attachments-repository';
import { PetsRepository } from '@/domain/main/application/repositories/pets-repository';
import { Pet } from '@/domain/main/enterprise/entities/pet';

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = [];

  constructor(private petAttachmentsRepository: PetAttachmentsRepository) {}

  async findById(id: string) {
    const pet = this.items.find((item) => item.id.toString() === id);

    if (!pet) {
      return null;
    }

    return pet;
  }

  async findManyByOrgId(orgId: string, { page }: PaginationParams) {
    const pets = this.items
      .filter((item) => item.orgId.toString() === orgId)
      .slice((page - 1) * 20, page * 20);

    return pets;
  }

  async findManyByCity(city: string, { page }: PaginationParams) {
    const pets = this.items
      .filter((item) => item.city === city)
      .slice((page - 1) * 20, page * 20);

    return pets;
  }

  async findManyByName({ page }: PaginationParams, name?: string) {
    const pets = this.items
      .filter((item) => item.name === name)
      .slice((page - 1) * 20, page * 20);

    return pets;
  }

  async findManyByAge({ page }: PaginationParams, age?: string) {
    const pets = this.items
      .filter((item) => item.age === age)
      .slice((page - 1) * 20, page * 20);

    return pets;
  }

  async findManyByWeight({ page }: PaginationParams, weight?: string) {
    const pets = this.items
      .filter((item) => item.weight === weight)
      .slice((page - 1) * 20, page * 20);

    return pets;
  }

  async findManyByBreed({ page }: PaginationParams, breed?: string) {
    const pets = this.items
      .filter((item) => item.breed === breed)
      .slice((page - 1) * 20, page * 20);

    return pets;
  }

  async findManyBySize({ page }: PaginationParams, size?: string) {
    const pets = this.items
      .filter((item) => item.size === size)
      .slice((page - 1) * 20, page * 20);

    return pets;
  }

  async create(pet: Pet) {
    this.items.push(pet);

    await this.petAttachmentsRepository.createMany(pet.attachments.getItems());

    DomainEvents.dispatchEventsForAggregate(pet.id);
  }

  async save(pet: Pet) {
    const itemIndex = this.items.findIndex((item) => item.id === pet.id);

    this.items[itemIndex] = pet;

    await this.petAttachmentsRepository.createMany(
      pet.attachments.getNewItems(),
    );

    await this.petAttachmentsRepository.deleteMany(
      pet.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(pet.id);
  }

  async delete(pet: Pet) {
    const itemIndex = this.items.findIndex((item) => item.id === pet.id);

    this.items.splice(itemIndex, 1);

    this.petAttachmentsRepository.deleteManyByPetId(pet.id.toString());
  }
}
