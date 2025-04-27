import { Body, Controller, Get, Post } from '@nestjs/common';
import { LocationService } from './Service/location.service';
import { EndpointResponse } from '@/Common/Decorators/endpoint.response';
import { LocationDto, PostLocationDto } from '@donohub/shared';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('locations')
@ApiTags('locations')
@ApiBearerAuth()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @EndpointResponse({
    type: LocationDto,
    isArray: true,
  })
  async getLocations() {
    return await this.locationService.getLocations();
  }

  @Get('dropdown')
  async getLocationDropdown() {
    const locations = await this.locationService.getLocations();
    return locations.flatMap((location) => {
      const formatedArr = [
        location.county,
        `${location.county},${location.city}`,
      ];

      if (location.street) {
        formatedArr.push(
          `${location.county},${location.city},${location.street}`,
        );
      }

      return formatedArr;
    });
  }

  @Post()
  @EndpointResponse({
    type: LocationDto,
  })
  async createLocation(@Body() body: PostLocationDto) {
    return await this.locationService.createLocation(body);
  }
}
