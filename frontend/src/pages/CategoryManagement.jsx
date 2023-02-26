import React from "react";
import { Route, useRouteMatch, Switch } from "react-router-dom";
import { CategoriesList, CreateCategories, PageHeader } from "../components";

const CategoryManagement = () => {
  const { path } = useRouteMatch();

  return (
    <div id="category_management">
      <PageHeader title="Categories Management" />
      <Switch>
        <Route path={`${path}/list`} exact component={CategoriesList} />
        <Route path={`${path}/create`} exact component={CreateCategories} />
      </Switch>
    </div>
  );
};

export default CategoryManagement;
