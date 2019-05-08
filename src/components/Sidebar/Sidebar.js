import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import AppContext from '../../AppContext';
import styles from './Sidebar.module.scss';

class SidebarBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favList: []
    };
  }

  componentDidMount() {
    console.log(this.props);
    if (this.props.authUser) this.checkFavCollection();
  }

  checkFavCollection() {
    this.props.firebase.favorites().on('value', snapshot => {
      const favObject = snapshot.val();

      if (favObject) {
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
    return (
      <aside className={styles.wrapper} onClick={this.props.toggleFn}>
        <ul>
          {this.props.authUser && this.state.favList.length > 0 ? (
            this.state.favList.map(item => (
              <li key={item.favID}>
                <Link to={`/restaurant/${item.favID}`}>
                  <p>{item.name}</p>
                  <p>{item.city}</p>
                </Link>
              </li>
            ))
          ) : (
            <li>
              {this.props.authUser ? (
                `There aren't any restaraunt liked`
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
