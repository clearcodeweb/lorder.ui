import { Theme } from '@material-ui/core';

export const styles = (theme: Theme): any => ({
  report: {
    bottom: theme.spacing.unit * 2,
    cursor: 'pointer',
    left: theme.spacing.unit * 2,
    position: 'absolute',
    zIndex: 10000,
  },
});