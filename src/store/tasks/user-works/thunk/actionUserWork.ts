import get from 'lodash-es/get';
import { Dispatch } from 'react-redux';
import { change } from 'redux-form';

import { IState } from 'src/@types';
// import { changeIco } from 'src/store/@common/helpers';
import { selectProject } from 'src/store/project';
import { getProjectById, Project } from 'src/store/projects';
import { CREATE_USER_WORK_FORM_NAME, replaceTasks } from 'src/store/tasks';
import { currentTaskTimeToString, currentUserWorkData, setCurrentUserWorkId, tickUserWorkTimer } from 'src/store/timer';
import { IUserWorkData, IUserWorkDelete, patchAndStopUserWork, postAndStartUserWork } from '../actions';
import { UserWork } from '../UserWork';

export let timer: any;

export const startTimer = (userWork: Partial<UserWork>, project: Project) => async (
  dispatch: Dispatch,
  getState: any
) => {
  clearInterval(timer);
  if (!userWork.durationInSeconds) {
    userWork = new UserWork(userWork);
  }
  timer = setInterval(() => {
    dispatch(tickUserWorkTimer({ userWork, project }));
    document.title = `${currentTaskTimeToString(getState())} | ${get(userWork, 'task.title')} (${get(
      project,
      'title'
    )})`;
  }, 1000);
  dispatch(
    setCurrentUserWorkId({
      projectId: project.id,
      taskId: userWork.taskId,
      time: userWork.durationInSeconds,
      timer,
      userWorkId: userWork.id,
    })
  );
  // changeIco('/stop.ico');
};

export const startUserWork = (data: IUserWorkData) => async (dispatch: Dispatch, getState: () => IState) => {
  const preparedData = { ...data };
  const project: Project = getProjectById(getState())(preparedData.projectId);
  if (!preparedData.title) {
    if (preparedData.description) {
      preparedData.title = preparedData.description;
    } else {
      preparedData.title = `Задача для проекта ${project.title}`;
    }
  }
  dispatch(selectProject(data.projectId));
  dispatch(change(CREATE_USER_WORK_FORM_NAME, 'projectId', data.projectId));
  const res = await dispatch(
    postAndStartUserWork({
      project,
      userWork: preparedData,
    })
  );
  const finishedTasks = get(res, 'payload.data.finished');
  if (finishedTasks && finishedTasks.length) {
    dispatch(replaceTasks(finishedTasks));
  }

  const userWorkData = get(res, 'payload.data.started');
  const userWork = new UserWork(userWorkData);

  return await dispatch(startTimer(userWork, project) as any);
};

export const stopUserWork = () => async (dispatch: Dispatch, getState: any) => {
  const data: IUserWorkDelete = currentUserWorkData(getState());
  clearInterval(timer);
  dispatch(
    setCurrentUserWorkId({
      projectId: undefined,
      taskId: undefined,
      timer: undefined,
      userWorkId: undefined,
    })
  );
  // changeIco();
  document.title = 'Старт';
  return await dispatch(patchAndStopUserWork(data));
};
