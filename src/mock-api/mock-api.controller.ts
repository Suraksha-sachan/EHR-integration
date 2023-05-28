import { Controller, Get, Header, Headers, Param, Query, UnauthorizedException } from '@nestjs/common';
import { MockApiService } from './mock-api.service';

@Controller('mock-api')
export class MockApiController {
  constructor(
    private readonly mockApiService: MockApiService) { }

  @Get('/fhir/Organization')
  async getAllOrganization(@Query('_count') count: any, @Headers('Authorization') authorization: string) {
    let apiToken
    if (authorization) {
      apiToken = authorization.split('Bearer ')[1]
    }
    if (!authorization || !apiToken) {
      throw new UnauthorizedException({ 'message': 'Unauthorized Access' })
    }
    return await this.mockApiService.getOrganization(count);
  }

  @Get('/fhir/Location')
  async getAllLocation(@Query('_count') count: any, @Headers('Authorization') authorization: string) {
    let apiToken
    if (authorization) {
      apiToken = authorization.split('Bearer ')[1]
    }
    if (!authorization || !apiToken) {
      throw new UnauthorizedException({ 'message': 'Unauthorized Access' })
    }
    return await this.mockApiService.getLocation(count);
  }

  @Get('/fhir/Practitioner')
  async getAllPractitioner(@Query('_count') count: any, @Headers('Authorization') authorization: string) {
    let apiToken
    if (authorization) {
      apiToken = authorization.split('Bearer ')[1]
    }
    if (!authorization || !apiToken) {
      throw new UnauthorizedException({ 'message': 'Unauthorized Access' })
    }
    return await this.mockApiService.getPractitioner(count);
  }

  @Get('/fhir/Patient')
  async getAllPatient(@Query('_count') count: any, @Param('id') id: string, @Headers('Authorization') authorization: string) {
    let apiToken
    if (authorization) {
      apiToken = authorization.split('Bearer ')[1]
    }
    if (!authorization || !apiToken) {
      throw new UnauthorizedException({ 'message': 'Unauthorized Access' })
    }
    return await this.mockApiService.getPatient(count, id);
  }

  @Get('/fhir/Patient/:id')
  async getPatientById(@Query('_count') count: any, @Param('id') id: string, @Headers('Authorization') authorization: string) {
    let apiToken
    if (authorization) {
      apiToken = authorization.split('Bearer ')[1]
    }
    if (!authorization || !apiToken) {
      throw new UnauthorizedException({ 'message': 'Unauthorized Access' })
    }
    return await this.mockApiService.getPatient(count, id);
  }

  @Get('/fhir/Appointment')
  async getAllAppointment(@Query('_count') count: any, @Query('actor') actor: any, @Headers('Authorization') authorization: string) {
    let apiToken
    if (authorization) {
      apiToken = authorization.split('Bearer ')[1]
    }
    if (!authorization || !apiToken) {
      throw new UnauthorizedException({ 'message': 'Unauthorized Access' })
    }
    if (actor) {
      return await this.mockApiService.getImportAppointment(actor)

    }
      return await this.mockApiService.getAppointment(count);
  }

  @Get('/oauth2/token')
  async getApiAccessToken(@Headers('Authorization') authorization: string) {

    let token;
    if (authorization) {
      token = authorization.split('Basic ')[1];
    }
    if (!authorization || !token) {
      throw new UnauthorizedException({ 'message': 'Invalid Client Credentials.' })
    }
    return await this.mockApiService.getToken();
  }



}
