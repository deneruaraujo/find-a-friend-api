import { InMemoryPetAttachmentsRepository } from 'test/repositories/in-memory-pet-attachments-repository';
import { InMemoryPetsRepository } from 'test/repositories/in-memory-pets-repository';
import { RegisterPetUseCase } from './register-pet';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryPetAttachmentsRepository: InMemoryPetAttachmentsRepository;

let sut: RegisterPetUseCase;

describe('Register Pet', () => {
  beforeEach(() => {
    inMemoryPetAttachmentsRepository = new InMemoryPetAttachmentsRepository();
    inMemoryPetsRepository = new InMemoryPetsRepository(
      inMemoryPetAttachmentsRepository,
    );
    sut = new RegisterPetUseCase(inMemoryPetsRepository);
  });

  it('Should be able to register a pet', async () => {
    const result = await sut.execute({
      orgId: '1',
      city: 'Test city',
      name: 'Test name',
      about: 'Test about',
      age: '20',
      weight: '5',
      breed: 'Test breed',
      size: 'Big',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryPetsRepository.items[0]).toEqual(result.value?.pet);
    expect(
      inMemoryPetsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryPetsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ]);
  });

  it('should persist attachments when registering a new pet', async () => {
    const result = await sut.execute({
      orgId: '1',
      city: 'Test city',
      name: 'Test name',
      about: 'Test about',
      age: '20',
      weight: '5',
      breed: 'Test breed',
      size: 'Big',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryPetAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryPetAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
      ]),
    );
  });
});
