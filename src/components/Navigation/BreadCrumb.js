import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Link from 'react-router/lib/Link';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import LevelIcon from '../LevelIcon';
import {getAvailableLanguages} from '../../utils/filterUtils';
import {getLanguageIndependentCoursePath} from '../../resources/courses';
import {getCourseTitle} from '../../resources/courseFrontmatter';
import {getLanguageAndIsReadme, getLessonFrontmatter} from '../../resources/lessonFrontmatter';
import {getCourseIcon} from '../../resources/courseIcon';
import {getTranslator} from '../../selectors/translate';
import {getLevel} from '../../resources/lessons';

const styles = theme => ({
  courseImage: {
    height: '20px',
  },
  text: {
    marginLeft: theme.spacing.unit,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
});

const BreadCrumb = ({classes, course, lesson, file, courseLanguage, t}) => {
  const isLesson = !!lesson;
  const isCourse = course && !isLesson;

  const {language:lessonLanguage, isReadme} = isLesson ? getLanguageAndIsReadme(course, lesson, file) || {} : {};
  const {title:lessonTitle, path:lessonPath} = isLesson ?
    getLessonFrontmatter(course, lesson, lessonLanguage, isReadme) : {};

  const courseTitle = getCourseTitle(course, courseLanguage);
  const coursePath = isCourse || isLesson ? getLanguageIndependentCoursePath(course) : '';

  const homeCrumb = <IconButton component={Link} to={'/'} aria-label={t('general.home')}>
    <HomeIcon/>
  </IconButton>;

  const courseCrumb = <Button size='small' component={Link} to={coursePath}>
    <img className={classes.courseImage} src={getCourseIcon(course)} alt={t('general.picture', {title: courseTitle})}/>
    <span className={classes.text}>{courseTitle}</span>
  </Button>;

  const lessonCrumb = <Button size='small' component={Link} to={lessonPath} aria-label={lessonTitle}>
    <LevelIcon level={getLevel(course, lesson)}/>
    <span className={classes.text}>{lessonTitle}</span>
  </Button>;

  return <div>
    {homeCrumb}
    {coursePath ? <span> / </span> : null}
    {coursePath ? courseCrumb : null}
    {isLesson ? <span> / </span> : null}
    {isLesson ? lessonCrumb : null}
  </div>;
};

BreadCrumb.propTypes = {
  // ownProps
  classes: PropTypes.object.isRequired,
  course: PropTypes.string,
  lesson: PropTypes.string,
  file: PropTypes.string,
  t: PropTypes.func.isRequired,

  // mapStateToProps
  courseLanguage: PropTypes.oneOf(getAvailableLanguages()).isRequired,
};

const mapStateToProps = (state) => ({
  courseLanguage: state.language,
  t: getTranslator(state),
});

export default connect(
  mapStateToProps
)(withStyles(styles)(BreadCrumb));
