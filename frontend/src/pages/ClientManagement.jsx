import React from "react";
import { Route, useRouteMatch, Switch } from "react-router-dom";
import { ClientDetails, ClientList, CreateClient, PageHeader } from "../components";

const ClientManagement = () => {
  const { path } = useRouteMatch();

  return (
    <div id="client_management">
      {/* <PageHeader title="Clients" /> */}
      <Switch>
        <Route path={`${path}/list`} exact component={ClientList} />
        <Route path={`${path}/create`} exact component={CreateClient} />
        <Route path={`${path}/details/:id`} exact component={ClientDetails} />
      </Switch>
    </div>
  );
};

export default ClientManagement;
