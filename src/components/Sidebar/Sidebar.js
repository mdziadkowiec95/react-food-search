import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import AppContext from '../../AppContext';
import styles from './Sidebar.module.scss';
import List from './List';
import { CircleSpinner } from 'react-spinners-kit';
import delayUnmounting from '../delayUnmounting';
import cx from 'classnames';

class SidebarBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favListFetched: false,
      favList: []
    };
  }

  componentDidMount() {
    if (this.props.authUser) this.checkFavCollection();

    document.addEventListener('mousedown', this.handleClickOutside);
  }

  // componentWillReceiveProps = ({ authUser }) => {
  //   if (authUser) this.checkFavCollection(); /** remove to test componentDidUpdate */
  // };

  componentDidUpdate(prevProps) {
    if (this.props.authUser !== prevProps.authUser) this.checkFavCollection();
  }

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
          this.setState({
            favList: [],
            favListFetched: true,
            loading: false
          });
        }
      } else {
        this.setState({
          favList: [],
          favListFetched: true,
          loading: false
        });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.favorites().off();

    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = e => {
    if (this.wrapEl && !this.wrapEl.contains(e.target)) {
      this.props.toggleFn();
    }
  };

  render() {
    const loadingMessage = this.state.favListFetched ? (
      <h3 className={styles.emptySidebar}>
        Favorite list is empty.
        <br /> Let's serach for your best places now!
      </h3>
    ) : (
      <div className={styles.spinner}>
        <CircleSpinner
          size={60}
          color="#e67e22"
          loading={!this.state.favListFetched}
        />
      </div>
    );

    const wrapperStyle = this.props.isMounted
      ? styles.wrapper
      : cx(styles.wrapper, styles.wrapperOut);

    return (
      <aside className={wrapperStyle} ref={wrapEl => (this.wrapEl = wrapEl)}>
        <div className={styles.inner}>
          {this.props.authUser &&
          this.state.favListFetched &&
          this.state.favList.length !== 0 ? (
            <List items={this.state.favList} />
          ) : (
            <>
              {this.props.authUser ? (
                loadingMessage
              ) : (
                <div className={styles.nonAuthBox}>
                  <p>Sidebar is available only for registered users.</p>
                  <p>
                    Please{' '}
                    <Link to="/sign-in" className={styles.nonAuthBoxLink}>
                      SIGN IN
                    </Link>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    );
  }
}

const SidebarFb = withFirebase(SidebarBase);

const Sidebar = ({ delayTime, isMounted }) => (
  <AuthUserContext.Consumer>
    {authUser => (
      <AppContext.Consumer>
        {context => (
          <SidebarFb
            authUser={authUser}
            toggleFn={context.handleToggleSidebar}
            delay={delayTime}
            isMounted={isMounted}
          />
        )}
      </AppContext.Consumer>
    )}
  </AuthUserContext.Consumer>
);

export default delayUnmounting(Sidebar);
