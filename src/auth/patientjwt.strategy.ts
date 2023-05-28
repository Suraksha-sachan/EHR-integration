import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class PatientJwtStrategy extends PassportStrategy(Strategy, 'patient') {
  constructor(private readonly authService: AuthService) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        jsonWebTokenOptions: {
          ignoreNotBefore: true,
        },
        secretOrKey: process.env.PATIENT_SECRET_KEY
      }
    );
  }
  async validate(payload: any) {
    return payload;
  }
}
