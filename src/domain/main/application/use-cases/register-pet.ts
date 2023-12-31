import { Either, right } from '@/core/either';
import { Pet } from '../../enterprise/entities/pet';
import { PetsRepository } from '../repositories/pets-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PetAttachment } from '../../enterprise/entities/pet-attachment';
import { PetAttachmentList } from '../../enterprise/entities/pet-attachment-list';
import { Injectable } from '@nestjs/common';

interface RegisterPetUseCaseRequest {
  orgId: string;
  city: string;
  name: string;
  about: string;
  age: string;
  weight: string;
  breed: string;
  size: string;
  attachmentsIds: string[];
}

type RegisterPetUseCaseResponse = Either<
  null,
  {
    pet: Pet;
  }
>;
@Injectable()
export class RegisterPetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    orgId,
    city,
    name,
    about,
    age,
    weight,
    breed,
    size,
    attachmentsIds,
  }: RegisterPetUseCaseRequest): Promise<RegisterPetUseCaseResponse> {
    const pet = Pet.create({
      orgId: new UniqueEntityId(orgId),
      city,
      name,
      about,
      age,
      weight,
      breed,
      size,
    });

    const petAttachments = attachmentsIds.map((attachmentId) => {
      return PetAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        petId: pet.id,
      });
    });

    pet.attachments = new PetAttachmentList(petAttachments);

    await this.petsRepository.create(pet);

    return right({
      pet,
    });
  }
}
