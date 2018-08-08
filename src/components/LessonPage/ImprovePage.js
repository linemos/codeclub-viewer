import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ForumIcon from '@material-ui/icons/Forum';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import CodeIcon from '@material-ui/icons/Code';
import {capitalize} from '../../utils/stringUtils';
import {getTranslator} from '../../selectors/translate';
import {getLessonFrontmatter} from '../../resources/lessonFrontmatter';

const container = {
  textAlign: 'center',
  borderRadius: '10px',
  '@media print': {
    display: 'none',
  },
};

const styles = theme => ({
  studentContainer: {
    ...container,
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit,
    backgroundColor: '#eef7ee',
    border: '1px solid #b1daae',
  },
  teacherContainer: {
    ...container,
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit,
    backgroundColor: '#eff6f6',
    border: '1px solid #a3cccb',
  },
  button: {
    margin: theme.spacing.unit,
  },
  buttonText: {
    marginLeft: theme.spacing.unit,
  },
});

const ImprovePage = ({classes, course, lesson, language, isReadme, t, isStudentMode}) => {
  const {path} = getLessonFrontmatter(course, lesson, language, isReadme);
  const linkToSourceCode = `https://github.com/kodeklubben/oppgaver/tree/master/src/${course}/${lesson}`;
  const linkToLesson = `http://oppgaver.kidsakoder.no/${path}`;
  const newIssueFill = '?title=' + t('lessons.improvepage.newissuelink.title') + ' \'' +
                       capitalize(course) + ': ' + capitalize(lesson).replace(/_/g, ' ') + '\'' +
                       '&body=' + t('lessons.improvepage.newissuelink.lesson') + ': ' + linkToLesson +
                       '%0A' + t('lessons.improvepage.newissuelink.sourcecode') + ': ' + linkToSourceCode +
                       '%0A%0A' + t('lessons.improvepage.newissuelink.info') + '%0A';

  const url = {
    newIssue: 'https://github.com/kodeklubben/oppgaver/issues/new/' + newIssueFill,
    showCode: linkToSourceCode,
    forum: 'https://forum.kidsakoder.no/c/oppgaver'
  };
  const options = {
    variant: 'outlined',
    size: 'small',
    target: '_blank',
    rel: 'noopener',
    className: classes.button,
  };
  const buttons = (
    <Grid container justify='center'>
      <Button href={url.newIssue} {...options}>
        <ReportProblemIcon/>
        <span className={classes.buttonText}>{t('lessons.improvepage.newissuebutton')}</span>
      </Button>
      <Button href={url.forum} {...options}>
        <ForumIcon/>
        <span className={classes.buttonText}>{t('lessons.improvepage.forumbutton')}</span>
      </Button>
      <Button href={url.showCode} {...options}>
        <CodeIcon/>
        <span className={classes.buttonText}>{t('lessons.improvepage.showcodebutton')}</span>
      </Button>
    </Grid>
  );
  return (
    <div className={isStudentMode ? classes.studentContainer : classes.teacherContainer}>
      <h2>{t('lessons.improvepage.header')}</h2>
      <p>
        {t('lessons.improvepage.textline1')}
        <br/>
        {t('lessons.improvepage.textline2')}
      </p>
      {buttons}
    </div>
  );
};

ImprovePage.propTypes = {
  // ownProps
  classes: PropTypes.object.isRequired,
  course: PropTypes.string.isRequired,
  lesson: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  isReadme: PropTypes.bool.isRequired,

  // mapStateToProps
  isStudentMode: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  isStudentMode: state.isStudentMode,
  t: getTranslator(state)
});

export default connect(
  mapStateToProps
)(withStyles(styles)(ImprovePage));
