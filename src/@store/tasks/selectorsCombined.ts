import get from 'lodash/get';
import includes from 'lodash/includes';
import moment from 'moment';
import { createSelector } from 'reselect';

import { IEvent, ITask } from '@types';
import { DownloadList } from '@store/@common/entities';
import { defaultProjectId } from '@store/identity/selectors';
import { selectedProjectId } from '@store/project';
import { routeProjectId } from '@store/router';
import { allTasks, Task, UserWork } from '@store/tasks';
import { filteredMembers, searchTerm, tasksFilter } from '@store/tasksFilter';
import { currentTask, currentTaskId } from '@store/timer';
import { lastUserWorks } from '@store/user-works/selectors';

export const filteredByProjectTasks = createSelector(
  [allTasks, selectedProjectId, currentTaskId],
  (tasks, projectId, taskId) =>
    projectId ? tasks.list.filter(el => el.projectId === projectId && el.id !== taskId) : tasks.list
);

const filteredFunction = {
  new: (a: ITask, b: ITask) => (a.id > b.id ? -1 : 1),
  recent: (a: ITask, b: ITask) => (a.id < b.id ? -1 : 1),
  smart: (a: ITask, b: ITask) => (a.value > b.value ? -1 : 1),
};

export const sortedByFilterTasks = createSelector(
  [filteredByProjectTasks, tasksFilter],
  (tasks = [], filter = 'smart') => [...tasks].sort(filteredFunction[filter])
);

export const sortedByFilterTasksWithActive = createSelector(
  [sortedByFilterTasks, currentTask],
  (tasks = [], curTask): Array<ITask | 'filter' | undefined> => [
    curTask,
    'filter',
    ...tasks.filter(t => t.id !== get(curTask, 'id')),
  ]
);

export const checkIsCurrent = createSelector(
  [currentTaskId],
  cTaskId => (sequenceNumber: number) => cTaskId === sequenceNumber
);

export const events = createSelector(
  [lastUserWorks, defaultProjectId],
  (userWorks: DownloadList<UserWork>, defPrId: number | undefined): IEvent[] => {
    return userWorks.list
      .filter(uw => moment().diff(uw.startAt, 'hours') <= 24)
      .sort((a, b) => (a.startAt.unix() > b.startAt.unix() ? 1 : -1))
      .map(userWork => ({
        data: userWork,
        finishAt: userWork.finishAt,
        isActive: userWork.projectId !== defPrId,
        name: (userWork.task as ITask).title || userWork.taskId.toString(),
        startAt: userWork.startAt,
      }));
  }
);

export const projectTasks = createSelector(
  [allTasks, routeProjectId],
  (list, projectId: number | undefined): Task[] => (projectId ? list.list.filter(el => el.projectId === projectId) : [])
);

export const filteredProjectTasks = createSelector(
  [projectTasks, searchTerm, filteredMembers],
  (list, sTerm = '', members = []) => {
    if (!sTerm && !members.length) {
      return list ? list : [];
    }
    return list && list.length
      ? list
          .filter(el => ~el.title.toLowerCase().indexOf(sTerm.trim().toLowerCase()))
          .filter(el => (members.length ? includes(members, el.performerId) : true))
      : [];
  }
);

export const selectedProjectTasks = createSelector(
  [allTasks, selectedProjectId],
  (list, projectId): Task[] => (projectId ? list.list.filter(el => el.projectId === projectId) : [])
);

export const getSelectedProjectTaskById = createSelector(
  selectedProjectTasks,
  (tasks: Task[]) => (id: number) => tasks.find(el => el.id === id)
);

export const STATUS_NAMES = ['Резерв', 'Сделать', 'В процессе', 'Обзор', 'Готово'];

export const allStatuses = () => STATUS_NAMES;
