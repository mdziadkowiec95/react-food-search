import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import AppContext from '../../AppContext';
import styles from './Sidebar.module.scss';
import Item from './Item';
import { CircleSpinner } from 'react-spinners-kit';

const favListTEST = [
  {
    city: 'Kraków',
    favID: '10401007',
    img: '/static/media/thumb-placeholder.73058276.jpg',
    name: 'Pod Wawelem Kompania Kuflowa'
  },
  {
    city: 'Kraków',
    favID: '10401007',
    img: '/static/media/thumb-placeholder.73058276.jpg',
    name: 'Pod Wawelem Kompania Kuflowa'
  },
  {
    city: 'Kraków',
    favID: '10401007',
    img: '/static/media/thumb-placeholder.73058276.jpg',
    name: 'Pod Wawelem Kompania Kuflowa'
  }
];

class SidebarBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favListFetched: false,
      favList: [] /** [...favListTEST] for test purposes */
    };
  }

  componentDidMount() {
    this.checkFavCollection(); /** turn off for test purposesc */
  }

  componentWillReceiveProps = ({ authUser }) => {
    if (authUser) this.checkFavCollection(); /** turn off for test purposesc */
  };

  checkFavCollection() {
    this.props.firebase.favorites().on('value', snapshot => {
      const favObject = snapshot.val();

      if (favObject && this.props.authUser) {
        const userFavItems = favObject[this.props.authUser.uid];
        let favListArr = [];

        if (userFavItems) {
          const userFavItemsKeys = Object.keys(
            favObject[this.props.authUser.uid]
          );
          // Create favList array with favorite items
          userFavItemsKeys.map(key => {
            favListArr.push({
              name: userFavItems[key].name,
              favID: userFavItems[key].favID,
              city: userFavItems[key].city,
              img: userFavItems[key].img
            });
          });

          console.log(favListArr);

          this.setState({
            favList: favListArr,
            favListFetched: true,
            loading: false
          });
        } else {
          alert('undefined');
          this.setState({
            favList: [],
            loading: false
          });
        }
      } else {
        this.setState({
          favList: [],
          loading: false
        });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.favorites().off();
  }

  render() {
    const loadingMessage = this.state.favListFetched ? (
      `There are no favorite items`
    ) : (
      <div className={styles.spinner}>
        <CircleSpinner
          size={60}
          color="#e67e22"
          loading={!this.state.favListFetched}
        />
      </div>
    );

    return (
      <aside className={styles.wrapper} onClick={this.props.toggleFn}>
        <div className={styles.inner}>
          <ul>
            {this.props.authUser && this.state.favListFetched ? (
              this.state.favList.map(item => <Item {...item} />)
            ) : (
              <li>
                {this.props.authUser ? (
                  loadingMessage
                ) : (
                  <>
                    <p>Sidebar available only for registered users.</p>
                    <p>
                      Please <Link to="/sign-in">SIGN IN</Link>
                    </p>
                  </>
                )}
              </li>
            )}
          </ul>
        </div>
      </aside>
    );
  }
}

const SidebarFb = withFirebase(SidebarBase);

const Sidebar = props => (
  <AuthUserContext.Consumer>
    {authUser => (
      <AppContext.Consumer>
        {context => (
          <SidebarFb
            authUser={authUser}
            toggleFn={context.handleToggleSidebar}
          />
        )}
      </AppContext.Consumer>
    )}
  </AuthUserContext.Consumer>
);

export default Sidebar;
