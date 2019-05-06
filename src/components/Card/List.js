import React from 'react';
import Card from './Card';
import styles from './List.module.scss';
import { CircleSpinner } from 'react-spinners-kit';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  render() {
    const items = this.props.items;

    return (
      <div className={styles.wrapper}>
        <ul className={styles.list}>
          {items.map(item => (
            <Card key={item.id} {...item} />
          ))}
        </ul>
      </div>
    );
  }
}

// const List = ({ items }) => (
//   <div className={styles.wrapper}>
//     <ul className={styles.list}>
//       {items.length > 0 &&
//         items.map(item => (
//           <li key={item.id}>
//             <Card {...item} />
//           </li>
//         ))}
//     </ul>
//     <CircleSpinner size={60} color="#e67e22" loading={true} />
//   </div>
// );

export default List;
