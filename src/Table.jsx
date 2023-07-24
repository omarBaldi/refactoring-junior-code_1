import { useEffect, useMemo, useRef, useState } from 'react';
import classes from './Table.module.css';

function Table({ issues }) {
  const allIssuesCheckboxRef = useRef(null);

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

  const {
    isAllIssuesCheckboxChecked,
    issuesSelectedAmount,
    shouldCheckboxBeIndeterminate,
  } = useMemo(() => {
    const issuesOpenStatus = updatedIssues.filter((issue) => issue.status === 'open');
    const issuesSelectedAmount = updatedIssues.reduce(
      (acc, issue) => (acc += issue.checked ? 1 : 0),
      0
    );

    return {
      shouldCheckboxBeIndeterminate:
        issuesSelectedAmount > 0 && issuesSelectedAmount < issuesOpenStatus.length,
      isAllIssuesCheckboxChecked: issuesOpenStatus.every((issue) => issue.checked),
      issuesSelectedAmount,
    };
  }, [updatedIssues]);

  const allIssuesCheckboxLabel =
    issuesSelectedAmount > 0 ? `Selected ${issuesSelectedAmount}` : 'None selected';

  /**
   * @description
   * Apply indeterminate property to checkbox
   * only if the total amount of issues checked
   * is greater than 0 and less than the total amount of
   * issue with status "open"
   */
  useEffect(() => {
    allIssuesCheckboxRef.current.indeterminate = shouldCheckboxBeIndeterminate;
  }, [shouldCheckboxBeIndeterminate]);

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th>
            <input
              ref={allIssuesCheckboxRef}
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
