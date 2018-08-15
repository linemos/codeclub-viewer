import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LockIcon from '@material-ui/icons/Lock';
import {filterChecked} from '../../reducers/filter';
import {collapseFilterGroup} from '../../reducers/filterGroupsCollapsed';
import FilterItem from './FilterItem';
import {somethingCheckedInGroup} from '../../selectors/filter';
import {getTranslateFilter} from '../../selectors/translate';

const styles = theme => ({
  listWidth: {
    width: '100%',
  },
  lockIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 18,
  },
});

const FilterGroup = ({
  classes, groupKey, filterTags, filterChecked,
  collapseFilterGroup, filterGroupsCollapsed, somethingChecked, translateFilter
}) => {
  const groupName = translateFilter(groupKey);
  if (groupName) {
    const filterItems = Object.keys(filterTags).map(key => {
      const onCheck = () => filterChecked(groupKey, key);
      const tagName = translateFilter(groupKey, key);
      const popoverContent = translateFilter(groupKey, key, true);

      const checked = filterTags[key];
      return tagName ? <FilterItem {...{key, checked, tagName, onCheck, popoverContent}}/>
        : null;
    }).filter(item => !!item); // filter out null-values;

    // Sort filterItems alphabetically except grades
    if (groupKey !== 'grade') {
      filterItems.sort((a, b) => a.props.tagName.localeCompare(b.props.tagName));
    }

    const nothingChecked = !somethingChecked;
    const isCollapsed = nothingChecked && filterGroupsCollapsed[groupKey];
    const onGroupClick = () => {
      if (nothingChecked) {
        collapseFilterGroup(groupKey, !isCollapsed);
      }
    };

    return (
      <div className={classes.listWidth}>
        <ListItem button disableGutters onClick={onGroupClick} disabled={somethingChecked}>
          {!isCollapsed ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
          <ListItemText classes={{primary: classes.label}} primary={groupName}/>
          {somethingChecked ? <LockIcon className={classes.lockIcon}/> : null}
        </ListItem>
        <Collapse in={!isCollapsed} mountOnEnter unmountOnExit>
          {filterItems}
        </Collapse>
      </div>
    );
  }
  else {
    return null;
  }
};

FilterGroup.propTypes = {
  // ownProps:
  classes: PropTypes.object.isRequired,
  groupKey: PropTypes.string,

  // mapStateToProps:
  filterTags: PropTypes.object.isRequired,
  filterGroupsCollapsed: PropTypes.object.isRequired,
  somethingChecked: PropTypes.bool.isRequired,
  translateFilter: PropTypes.func.isRequired,

  // mapDispatchToProps:
  filterChecked: PropTypes.func.isRequired,
  collapseFilterGroup: PropTypes.func.isRequired,
};

const mapStateToProps = (state, {groupKey}) => ({
  filterTags: state.filter[groupKey],
  filterGroupsCollapsed: state.filterGroupsCollapsed,
  somethingChecked: somethingCheckedInGroup(state, groupKey),
  translateFilter: getTranslateFilter(state),
});

const mapDispatchToProps = {
  filterChecked,
  collapseFilterGroup,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FilterGroup));
