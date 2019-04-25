import React from 'react';

const AdminView = () => (
  <div>
    <h1>Admin</h1>
    <p>Restricted area! Only users with the admin role are authorized.</p>
  </div>
);

const condition = authUser => authUser && !!authUser.roles['ADMIN'];

export default withAuthorization(condition)(AdminPage);
