import React from 'react';
import Heading from '../../components/Heading/Heading';

const AdminView = () => (
  <div>
    <Heading background>Admin view</Heading>
    <p>Restricted area! Only users with the admin role are authorized.</p>
  </div>
);

const condition = authUser => authUser && !!authUser.roles['ADMIN'];

export default withAuthorization(condition)(AdminPage);
