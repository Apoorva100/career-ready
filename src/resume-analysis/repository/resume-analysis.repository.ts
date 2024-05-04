import { Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProfessionalSummary, Resume } from '../entities/resume.entity';
import { Model } from 'mongoose';
import { UpdateProfessionalSummaryDTO } from '../dto/UpdateResumeDTO';

@Injectable()
export class ResumeAnalysisRepository {
  constructor(
    @InjectModel('Resume')
    private readonly resumeModel: Model<Resume>,
  ) {}

  async findOne(uuid: string): Promise<Resume> {
    return await this.resumeModel.findOne({ user: uuid });
  }
  async create(resume: Resume): Promise<Resume> {
    return await this.resumeModel.create(resume);
  }

  async updateProfessionalSummary(
    updateProfessionalSummaryDTO: UpdateProfessionalSummaryDTO,
  ) {
    const resume = await this.resumeModel.findOne({
      user: updateProfessionalSummaryDTO.user,
    });
    const professionalSummary = await Promise.all(
      updateProfessionalSummaryDTO.professionalSummary.map(
        (response, index) => {
          const summary = new ProfessionalSummary();
          summary.companyName = response.companyName;
          summary.role = response.role;
          summary.durationInMonths = response.durationInMonths;
          summary.skills = resume.professionalSummary[index].skills;
          return summary;
        },
      ),
    );

    const updateData = {
      $set: {
        professionalSummary,
      },
    };
    return await this.resumeModel.updateOne(
      { user: updateProfessionalSummaryDTO.user },
      updateData,
    );
  }
}
