import React from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import styles from './Pagination.module.scss';

const arrow = {
  size: 43,
  color: '#fff'
};

const Pagination = ({ paginationFn }) => (
  <div className={styles.pagination}>
    <button
      onClick={e => paginationFn(e, 'previous')}
      className={styles.paginationButton}
    >
      <MdNavigateBefore size={arrow.size} color={arrow.color} />
    </button>
    <button
      onClick={e => paginationFn(e, 'next')}
      className={styles.paginationButton}
    >
      <MdNavigateNext size={arrow.size} color={arrow.color} />
    </button>
  </div>
);

export default Pagination;
