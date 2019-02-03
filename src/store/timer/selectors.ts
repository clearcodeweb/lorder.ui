import { createSelector } from 'reselect';

import { IState, IUserWork } from 'src/@types';
import { convertSecondsToDuration, convertSecondsToDurationWithLocal } from 'src/store/@common/helpers';
import { filteredTaskList } from 'src/store/tasks/selectors';
import { IUserWorkDelete } from '../tasks/user-works';

const baseState = (state: IState) => state.timer;

export const currentTime = createSelector(baseState, state => state.time);

export const currentTimeHumanize = createSelector(currentTime, time => convertSecondsToDuration(time));

export const currentProjectId = createSelector(baseState, state => state.projectId);

export const currentTaskId = createSelector(baseState, state => state.taskId);

export const currentUserWorkId = createSelector(baseState, state => state.userWorkId);

export const currentUserWorkData = createSelector(
  baseState,
  (state): IUserWorkDelete => ({
    projectId: state.projectId as number,
    taskId: state.taskId as number,
    userWorkId: state.userWorkId as number,
  })
);

export const isTimerStarted = createSelector(baseState, state => !!state.timer);

export const currentTask = createSelector([filteredTaskList, currentTaskId], (tasks, taskId) =>
  tasks.find(el => el.id === taskId)
);

export const currentUserWork = createSelector(
  [currentTask, currentUserWorkId],
  (task, userWorkId) => task && task.userWorks.find((el: IUserWork) => el.id === userWorkId)
);

export const currentTaskTime = createSelector(
  [currentTime, currentTask, currentUserWork],
  (time, task, userWork) => (userWork ? userWork.durationInSeconds : time)
);

export const currentTaskTimeToString = createSelector([currentTaskTime], seconds => {
  return convertSecondsToDuration(seconds);
});

export const currentTaskTimeWithLocal = createSelector([currentTaskTime], seconds =>
  convertSecondsToDurationWithLocal(seconds)
);
