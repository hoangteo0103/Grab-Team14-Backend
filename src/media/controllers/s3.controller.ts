import { Controller, Query, Get } from '@nestjs/common';
import { S3Service } from 'src/media/services/s3.service';
import { signedUrlDto } from 'src/media/dtos/signed-url.dto';

@Controller('media/signedUrlForPuttingObject')
export class S3Controller {
  constructor(private s3Service: S3Service) {}

  @Get()
  async getSignedUrlForPuttingObject(@Query() dto: signedUrlDto) {
    const { url, key } = await this.s3Service.signedUrlForPuttingObject(dto);
    return { url, key };
  }
}
