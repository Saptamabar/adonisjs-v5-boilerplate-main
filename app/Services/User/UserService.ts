import BaseService from "App/Base/Services/BaseService"
import UserRepository from "App/Repositories/User/UserRepository"

export default class UserService extends BaseService {
  constructor() {
    super(new UserRepository())
  }
}
    