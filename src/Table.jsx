import { useMemo, useState } from 'react';
import classes from './Table.module.css';

function Table({ issues }) {
  //* *------------------------------------ NEW CODE
  const [updatedIssues, setUpdatedIssues] = useState(() => {
    return issues.map((issue, index) => ({
      ...issue,
      id: index.toString().padStart(3, '0'),
      checked: false,
    }));
  });

  const handleIssueCheckboxChange = (issueToUpdateId) => {
    return (e) => {
      const updatedCheckedValue = e.target.checked;

      setUpdatedIssues((prevIssues) => {
        return [...prevIssues].map((issue) => ({
          ...issue,
          ...(issue.id === issueToUpdateId && { checked: updatedCheckedValue }),
        }));
      });
    };
  };

  const handleAllIssuesCheckboxChange = (e) => {
    const updatedCheckedValue = e.target.checked;

    setUpdatedIssues((prevIssues) => {
      return [...prevIssues].map((issue) => ({
        ...issue,
        ...(issue.status === 'open' && { checked: updatedCheckedValue }),
      }));
    });
  };

  /**
   * !Consideration
   * Possibly combine the 2 useMemo together as they depend
   * on the same dependency value.
   */
  const isAllIssuesCheckboxChecked = useMemo(() => {
    return updatedIssues
      .filter((issue) => issue.status === 'open')
      .every((issue) => issue.checked);
  }, [updatedIssues]);

  const issuesSelectedAmount = useMemo(() => {
    return updatedIssues.reduce((acc, issue) => (acc += issue.checked ? 1 : 0), 0);
  }, [updatedIssues]);

  const allIssuesCheckboxLabel =
    issuesSelectedAmount > 0 ? `Selected ${issuesSelectedAmount}` : 'None selected';

  /* 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  */
  const [checkedState, setCheckedState] = useState(
    new Array(issues.length).fill({
      checked: false,
      backgroundColor: '#ffffff',
    })
  );

  const [selectDeselectAllIsChecked, setSelectDeselectAllIsChecked] = useState(false);

  const [numCheckboxesSelected, setNumCheckboxesSelected] = useState(0);

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((element, index) => {
      if (position === index) {
        return {
          ...element,
          checked: !element.checked,
          backgroundColor: element.checked ? '#ffffff' : '#eeeeee',
        };
      }
      return element;
    });
    setCheckedState(updatedCheckedState);

    const totalSelected = updatedCheckedState
      .map((element) => element.checked)
      .reduce((sum, currentState, index) => {
        if (currentState) {
          return sum + issues[index].value;
        }
        return sum;
      }, 0);
    setNumCheckboxesSelected(totalSelected);

    handleIndeterminateCheckbox(totalSelected);
  };

  const handleIndeterminateCheckbox = (total) => {
    const indeterminateCheckbox = document.getElementById(
      'custom-checkbox-selectDeselectAll'
    );
    let count = 0;

    issues.forEach((element) => {
      if (element.status === 'open') {
        count += 1;
      }
    });

    if (total === 0) {
      indeterminateCheckbox.indeterminate = false;
      setSelectDeselectAllIsChecked(false);
    }
    if (total > 0 && total < count) {
      indeterminateCheckbox.indeterminate = true;
      setSelectDeselectAllIsChecked(false);
    }
    if (total === count) {
      indeterminateCheckbox.indeterminate = false;
      setSelectDeselectAllIsChecked(true);
    }
  };

  const handleSelectDeselectAll = (event) => {
    let { checked } = event.target;

    const allTrueArray = [];
    issues.forEach((element) => {
      if (element.status === 'open') {
        allTrueArray.push({ checked: true, backgroundColor: '#eeeeee' });
      } else {
        allTrueArray.push({ checked: false, backgroundColor: '#ffffff' });
      }
    });

    const allFalseArray = new Array(issues.length).fill({
      checked: false,
      backgroundColor: '#ffffff',
    });
    checked ? setCheckedState(allTrueArray) : setCheckedState(allFalseArray);

    const totalSelected = (checked ? allTrueArray : allFalseArray)
      .map((element) => element.checked)
      .reduce((sum, currentState, index) => {
        if (currentState && issues[index].status === 'open') {
          return sum + issues[index].value;
        }
        return sum;
      }, 0);
    setNumCheckboxesSelected(totalSelected);
    setSelectDeselectAllIsChecked((prevState) => !prevState);
  };

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th>
            <input
              className={classes.checkbox}
              type='checkbox'
              checked={isAllIssuesCheckboxChecked}
              onChange={handleAllIssuesCheckboxChange}
            />
          </th>
          <th className={classes.numChecked}>{allIssuesCheckboxLabel}</th>
        </tr>
        <tr>
          <th />
          <th>Name</th>
          <th>Message</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {updatedIssues.map(({ id, name, message, status, checked }) => {
          const isIssueOpen = status === 'open';

          return (
            <tr
              key={id}
              className={isIssueOpen ? classes.openIssue : classes.resolvedIssue}
              style={{ backgroundColor: checked ? '#eeeeee' : '#ffffff' }}
            >
              <td>
                <input
                  className={classes.checkbox}
                  type='checkbox'
                  disabled={!isIssueOpen}
                  checked={checked}
                  onChange={handleIssueCheckboxChange(id)}
                />
              </td>
              <td>{name}</td>
              <td>{message}</td>
              <td>
                <span className={isIssueOpen ? classes.greenCircle : classes.redCircle} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export default Table;
