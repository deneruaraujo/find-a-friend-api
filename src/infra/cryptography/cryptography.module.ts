import { Module } from '@nestjs/common';

import { HashComparer } from '@/domain/main/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/main/application/cryptography/hash-generator';

import { BcryptHasher } from './bcrypt-hasher';

@Module({
  providers: [
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [HashComparer, HashGenerator],
})
export class CryptographyModule {}