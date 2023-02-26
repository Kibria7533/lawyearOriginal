import React from "react";
import { Switch, Route, useRouteMatch } from "react-router";
import { CreateSubCategory, PageHeader, SubcategoryList } from "../components";

const SubCategoryManagement = () => {
  const { path } = useRouteMatch();

  return (
    <div id="subcatetgory_management">
      <PageHeader title="Questionnaire and Documents Bank" />
      <Switch>
        <Route path={`${path}`} exact component={SubcategoryList} />
        <Route path={`${path}/create`} exact component={CreateSubCategory} />
      </Switch>
    </div>
  );
};

export default SubCategoryManagement;
