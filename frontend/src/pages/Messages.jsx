import React from "react";
import { Switch, Route, useRouteMatch } from "react-router";
import { CreateSubCategory, PageHeader } from "../components";
import SubcategoryList from "../components/Management/SubcategoryList";

const Messages = () => {
  const { path } = useRouteMatch();

  return (
    <div id="subcatetgory_management">
      <h1>Messages</h1>
      <PageHeader title="Data Bank" />
      <Switch>
        <Route path={`${path}`} exact component={SubcategoryList} />
        <Route path={`${path}/create`} exact component={CreateSubCategory} />
      </Switch>
    </div>
  );
};

export default Messages;
