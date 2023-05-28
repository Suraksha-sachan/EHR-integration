import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async validateUser(payload) {
    try {
      let id = payload.sub;
      let find = await this.userRepository.findOne({ where: { id } });

      if (!find) {
        return false;
      }

      return find;
    } catch (err) {
      
      return err;
    }
  }
}
