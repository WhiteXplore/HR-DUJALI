import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirstTable } from './entities/firstTable.entity';
import { SecondTable } from './entities/secondTable.entity';
import { ThirdTable } from './entities/thirdTable.entity';
import { CreateUploadDto } from './dto/create-upload.dto';
@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(FirstTable)
    private readonly firstTableRepository: Repository<FirstTable>,

    @InjectRepository(SecondTable)
    private readonly secondTableRepository: Repository<SecondTable>,

    @InjectRepository(ThirdTable)
    private readonly thirdTableRepository: Repository<ThirdTable>,
  ) {}

  // The original create method (if needed)
  async create(createUploadDto: CreateUploadDto) {
    const { firstName, lastName, contactNumber, addresses, skills } =
      createUploadDto;

    // Create FirstTable entry
    const firstTable = this.firstTableRepository.create({
      firstName,
      lastName,
      contactNumber,
    });
    const savedFirst = await this.firstTableRepository.save(firstTable);

    // Create SecondTable entries linked to FirstTable
    const secondTableEntries = addresses.map((address) =>
      this.secondTableRepository.create({
        address,
        firstTable: savedFirst,
      }),
    );
    await this.secondTableRepository.save(secondTableEntries);

    // Create ThirdTable entries linked to FirstTable
    const thirdTableEntries = skills.map((skill) =>
      this.thirdTableRepository.create({
        skills: skill,
        firstTable: savedFirst,
      }),
    );
    await this.thirdTableRepository.save(thirdTableEntries);

    return {
      message: 'Upload created successfully',
      id: savedFirst.first_table_id,
    };
  }

  // Your new method for saving JSON data
  async saveJsonData(jsonData: any) {
    for (const data of jsonData) {
      const firstTable = this.firstTableRepository.create({
        firstName: data['First Name'],
        lastName: data['Last Name'],
        contactNumber: data['Contact Number'],
      });
      const savedFirst = await this.firstTableRepository.save(firstTable);

      const secondTableEntries = data['Address'].map((address: string) =>
        this.secondTableRepository.create({
          address,
          firstTable: savedFirst,
        }),
      );
      await this.secondTableRepository.save(secondTableEntries);

      const thirdTableEntries = data['Skills'].map((skill: string) =>
        this.thirdTableRepository.create({
          skills: skill,
          firstTable: savedFirst,
        }),
      );
      await this.thirdTableRepository.save(thirdTableEntries);
    }

    return { message: 'Data saved successfully' };
  }
}
