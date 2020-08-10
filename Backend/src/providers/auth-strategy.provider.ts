import {
  AuthenticationBindings,
  AuthenticationMetadata
} from '@loopback/authentication';
import {inject, Provider, ValueOrPromise} from '@loopback/context';
import {repository} from '@loopback/repository';
import {Strategy} from 'passport';
import {BasicStrategy} from 'passport-http';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import {AdministradorRepository, UsuarioRepository} from '../repositories';
import {AuthService} from '../services/auth.service';

export class MyAuthStrategyProvider implements Provider<Strategy | undefined> {
  authService: AuthService;

  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata,
    @repository(AdministradorRepository)
    public AdminRepository: AdministradorRepository,
    @repository(UsuarioRepository)
    public userRepository: UsuarioRepository
  ) {
    this.authService = new AuthService(userRepository, AdminRepository);
  }

  value(): ValueOrPromise<Strategy | undefined> {
    // The function was not decorated, so we shouldn't attempt authentication
    if (!this.metadata) {
      return undefined;
    }

    const name = this.metadata.strategy;
    switch (name) {
      case 'BasicStrategy':
        return new BasicStrategy(this.VerifyUser.bind(this));
      case 'TokenusuarioStrategy':
        return new BearerStrategy(this.VerifyusuarioToken.bind(this));
      case 'TokenAdminFirstStrategy':
        return new BearerStrategy(this.VerifyAdminTokenFirst.bind(this));
      case 'TokenAdminSecondStrategy':
        return new BearerStrategy(this.VerifyAdminTokenSecond.bind(this));
      case 'TokenAdminThirdStrategy':
        return new BearerStrategy(this.VerifyAdminTokenThird.bind(this))
      default:
        return Promise.reject(`The strategy name is not available.`);
        break;
    }
  }

  VerifyUser(
    username: string,
    password: string,
    cb: (err: Error | null, user?: object | false) => void,
  ) {
    let user = this.authService.Identify(username, password);
    return cb(null, user);
  }

  VerifyusuarioToken(
    token: string,
    cb: (err: Error | null, user?: object | false) => void,
  ) {
    this.authService.VerifyToken(token).then(data => {
      if (data && data.role >= 0) {
        return cb(null, data);
      }
      return cb(null, false);
    });
  }

  VerifyAdminTokenFirst(
    token: string,
    cb: (err: Error | null, user?: object | false) => void,
  ) {
    this.authService.VerifyToken(token).then(data => {
      if (data && data.role >= 1) {
        return cb(null, data);
      }
      return cb(null, false);
    });
  }

  VerifyAdminTokenSecond(
    token: string,
    cb: (err: Error | null, user?: object | false) => void,
  ) {
    this.authService.VerifyToken(token).then(data => {
      if (data && data.role >= 2) {
        return cb(null, data);
      }
      return cb(null, false);
    });
  }

  VerifyAdminTokenThird(
    token: string,
    cb: (err: Error | null, user?: object | false) => void,
  ) {
    this.authService.VerifyToken(token).then(data => {
      if (data && data.role == 3) {
        return cb(null, data);
      }
      return cb(null, false);
    });
  }

}
