import { TSchedule } from './offeredCourse.interface';

const hasTimeConflict = (
  assignSchedule: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignSchedule) {
    const existingStartTime = new Date(`2024-09-28T${schedule.startTime}`);
    const existingEndTime = new Date(`2024-09-28T${schedule.endTime}`);
    const newStartTime = new Date(`2024-09-28T${newSchedule.startTime}`);
    const newEndTime = new Date(`2024-09-28T${newSchedule.endTime}`);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      console.log('yes');
      return true;
    }
  }
  return false;
};

export default hasTimeConflict;
