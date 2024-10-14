import config from '../app/config';
import AppError from '../error/AppError';
import { USER_ROLE } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';

const superUser = {
  id: '0001',
  email: 'web.mohosin@gmail.com',
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: 'superAdmin',
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  // when database is connected , we wil check is there any super admin exits

  const isSuperAdminExits = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExits) {
    User.create(superUser);
  }
};

export default seedSuperAdmin
