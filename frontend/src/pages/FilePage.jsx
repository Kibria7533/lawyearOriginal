import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import {
  PageHeader,
  OpenNewFile,
  OldFileDetails,
  FileList,
} from "../components";

const FilePage = () => {
  const { path } = useRouteMatch();
  return (
    <div className="my-file">
      <PageHeader title="My File" />
      <Switch>
        <Route path={`${path}`} exact component={FileList} />
        <Route path={`${path}/open`} exact component={OpenNewFile} />
        <Route path={`${path}/details/:id`} component={OldFileDetails} />
      </Switch>
    </div>
  );
};

export default FilePage;
