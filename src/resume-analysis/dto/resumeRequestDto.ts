import { IsNotEmpty, IsString } from 'class-validator';

export default class ResumeRequestDto {
  @IsString()
  @IsNotEmpty()
  resumeText: string;
  @IsString()
  @IsNotEmpty()
  user: string;
}
