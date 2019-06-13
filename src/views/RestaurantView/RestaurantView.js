import React from 'react';
import Details from '../../components/Restaurant/Restaurant';
import Container from '../../components/Base/Container';

const RestaurantView = ({ match, history }) => (
  <Container>
    <Details id={match.params.id} />
  </Container>
);

export default RestaurantView;
